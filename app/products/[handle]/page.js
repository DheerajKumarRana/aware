'use client';

import { client, productQuery } from '@/lib/shopify';
import styles from './page.module.css';
import { useCart } from '@/components/cart/cart-context';
import { useWishlist } from '@/components/wishlist/wishlist-context';
import { useAuth } from '@/components/auth/auth-context';
import { useState, useEffect, use } from 'react';

export default function ProductPage({ params }) {
    const resolvedParams = use(params);
    const { handle } = resolvedParams;
    const { addToCart, isLoading } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { isLoggedIn, openLoginModal } = useAuth();

    const [product, setProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [activeImage, setActiveImage] = useState(null);
    const [openAccordion, setOpenAccordion] = useState('details');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await client.request(productQuery, { variables: { handle } });
                setProduct(data?.product);

                if (data?.product?.variants?.edges?.length > 0) {
                    const firstVariant = data.product.variants.edges[0].node;
                    const colorOpt = firstVariant.selectedOptions.find(o => o.name === 'Color');
                    const sizeOpt = firstVariant.selectedOptions.find(o => o.name === 'Size');

                    if (colorOpt) setSelectedColor(colorOpt.value);
                    if (sizeOpt) setSelectedSize(sizeOpt.value);
                    if (firstVariant.image) setActiveImage(firstVariant.image.url);
                }
            } catch (err) {
                console.error('Error fetching product:', err);
            }
        };
        fetchProduct();
    }, [handle]);

    if (!product) return <div className={styles.loading}>Loading...</div>;

    const variants = product.variants.edges.map(edge => edge.node);
    const images = product.images.edges.map(edge => edge.node);

    // Group variants by color for swatches
    const colorMap = new Map();
    const sizeSet = new Set();

    variants.forEach(variant => {
        const color = variant.selectedOptions.find(o => o.name === 'Color')?.value;
        const size = variant.selectedOptions.find(o => o.name === 'Size')?.value;

        if (color && !colorMap.has(color)) {
            colorMap.set(color, {
                image: variant.image?.url,
                id: variant.id
            });
        }
        if (size) sizeSet.add(size);
    });

    // Sort sizes (custom logic or simple sort)
    const sizes = Array.from(sizeSet); // Add custom sort if needed

    // Find currently selected variant
    const selectedVariant = variants.find(v =>
        v.selectedOptions.some(o => o.name === 'Color' && o.value === selectedColor) &&
        v.selectedOptions.some(o => o.name === 'Size' && o.value === selectedSize)
    );

    const isAvailable = selectedVariant?.availableForSale;
    const isSaved = isInWishlist(product.id);

    const handleAddToCart = () => {
        if (selectedVariant && isAvailable) {
            addToCart(selectedVariant.id);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {/* Left: Thumbnails */}
                <div className={styles.thumbnailList}>
                    {images.map((img, i) => (
                        <div
                            key={i}
                            className={`${styles.thumbnail} ${activeImage === img.url ? styles.active : ''}`}
                            onClick={() => setActiveImage(img.url)}
                        >
                            <img src={img.url} alt={img.altText || `View ${i}`} />
                        </div>
                    ))}
                </div>

                {/* Center: Main Image */}
                <div className={styles.mainColumn}>
                    <div className={styles.mainImageWrapper}>
                        <img
                            src={activeImage || images[0]?.url}
                            alt={product.title}
                            className={styles.mainImage}
                        />
                        <button
                            className={`${styles.wishlistButton} ${isSaved ? styles.active : ''}`}
                            onClick={() => {
                                if (!isLoggedIn) {
                                    openLoginModal();
                                } else {
                                    toggleWishlist(product);
                                }
                            }}
                        >
                            <svg
                                className={styles.wishlistIcon}
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </button>
                    </div>
                    <div className={styles.colorBanner}>
                        AVAILABLE IN {colorMap.size} COLORS TO MATCH YOUR STYLE!
                    </div>
                </div>

                {/* Right: Details */}
                <div className={styles.detailsColumn}>
                    <h1 className={styles.title}>{product.title}</h1>
                    <div className={styles.price}>
                        {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
                    </div>

                    {/* Color Swatches */}
                    <div className={styles.section}>
                        <span className={styles.sectionTitle}>COLORS</span>
                        {colorMap.size > 1 ? (
                            <div className={styles.colorGrid}>
                                {Array.from(colorMap.entries()).map(([color, data]) => (
                                    <div
                                        key={color}
                                        className={`${styles.swatch} ${selectedColor === color ? styles.activeSwatch : ''}`}
                                        onClick={() => {
                                            setSelectedColor(color);
                                            if (data.image) setActiveImage(data.image);
                                        }}
                                        title={color}
                                    >
                                        <img src={data.image} alt={color} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className={styles.singleOptionText}>Only 1 color available right now</p>
                        )}
                    </div>

                    {/* Sizes */}
                    <div className={styles.section}>
                        <div className={styles.sizeHeader}>
                            <span className={styles.sectionTitle}>SIZES</span>
                            <span className={styles.sizeChart}>SIZE CHART</span>
                        </div>
                        {sizes.length > 1 ? (
                            <div className={styles.sizeGrid}>
                                {sizes.map(size => {
                                    // Check if this size exists for the selected color
                                    const variant = variants.find(v =>
                                        v.selectedOptions.some(o => o.name === 'Color' && o.value === selectedColor) &&
                                        v.selectedOptions.some(o => o.name === 'Size' && o.value === size)
                                    );
                                    const available = variant?.availableForSale;

                                    return (
                                        <button
                                            key={size}
                                            className={`${styles.sizeBtn} ${selectedSize === size ? styles.activeSize : ''}`}
                                            disabled={!available}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className={styles.singleOptionText}>Only 1 size available right now</p>
                        )}
                        <div className={styles.deliveryNote}>
                            FREE 1-2 day delivery on 5k+ pincodes
                        </div>
                    </div>

                    {/* Add to Bag */}
                    <button
                        className={styles.addToBag}
                        disabled={!isAvailable || isLoading}
                        onClick={handleAddToCart}
                    >
                        {isLoading ? 'ADDING...' : (isAvailable ? 'ADD TO BAG' : 'OUT OF STOCK')}
                    </button>

                    {/* Accordions */}
                    <div className={styles.accordions}>
                        {[
                            { id: 'details', label: 'DETAILS', content: product.details?.value || product.descriptionHtml },
                            { id: 'reviews', label: 'REVIEWS', content: 'Customer reviews will appear here.' },
                            { id: 'delivery', label: 'DELIVERY', content: product.delivery?.value || 'Free shipping on orders over $100.' },
                            { id: 'returns', label: 'RETURNS', content: product.returns?.value || '30-day return policy.' }
                        ].map(item => (
                            <div key={item.id} className={styles.accordionItem}>
                                <button
                                    className={styles.accordionHeader}
                                    onClick={() => setOpenAccordion(openAccordion === item.id ? null : item.id)}
                                >
                                    {item.label}
                                    <span>{openAccordion === item.id ? '−' : '+'}</span>
                                </button>
                                {openAccordion === item.id && (
                                    <div className={styles.accordionContent}>
                                        <div dangerouslySetInnerHTML={{ __html: item.content }} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
