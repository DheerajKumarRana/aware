'use client';

import { client, productQuery } from '@/lib/shopify';
import styles from './page.module.css';
import Link from 'next/link';
import { useCart } from '@/components/cart/cart-context';
import { useWishlist } from '@/components/wishlist/wishlist-context';
import { useState, useEffect } from 'react';

export default function ProductPage({ params }) {
    const { handle } = params;
    const { addToCart, isLoading } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await client.request(productQuery, { variables: { handle } });
                setProduct(data?.product);
                if (data?.product?.variants?.edges?.[0]) {
                    setSelectedVariant(data.product.variants.edges[0].node);
                }
            } catch (err) {
                console.error('Error fetching product:', err);
            }
        };
        fetchProduct();
    }, [handle]);

    if (!product) {
        return (
            <div className={styles.container}>
                <h1>Loading...</h1>
            </div>
        );
    }

    const images = product.images.edges.map(edge => edge.node);
    const variants = product.variants.edges.map(edge => edge.node);

    // Group options
    const options = {};
    variants.forEach(variant => {
        variant.selectedOptions.forEach(opt => {
            if (!options[opt.name]) options[opt.name] = new Set();
            options[opt.name].add(opt.value);
        });
    });

    const handleAddToCart = () => {
        if (selectedVariant) {
            addToCart(selectedVariant.id);
        }
    };

    const isSaved = isInWishlist(product.id);

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {/* Gallery Section */}
                <div className={styles.gallery}>
                    <div className={styles.mainImageWrapper}>
                        {images[0] ? (
                            <img src={images[0].url} alt={images[0].altText || product.title} className={styles.mainImage} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', backgroundColor: '#eee' }}></div>
                        )}
                    </div>
                    <div className={styles.thumbnailGrid}>
                        {images.slice(0, 4).map((img, i) => (
                            <div key={i} className={styles.thumbnail}>
                                <img src={img.url} alt={img.altText || `View ${i}`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Details Section */}
                <div className={styles.details}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>{product.title}</h1>
                        <div className={styles.price}>
                            {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
                        </div>
                    </div>

                    <div className={styles.options}>
                        {Object.entries(options).map(([name, values]) => (
                            <div key={name} className={styles.optionGroup}>
                                <label className={styles.optionLabel}>{name}</label>
                                <div className={styles.optionValues}>
                                    {Array.from(values).map(val => (
                                        <button key={val} className={styles.optionButton}>
                                            {val}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.actions}>
                        <button
                            className={styles.addToCart}
                            onClick={handleAddToCart}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Adding...' : 'Add to Cart'}
                        </button>
                        <button
                            className={styles.wishlistBtn}
                            onClick={() => toggleWishlist(product)}
                            style={{
                                background: 'none',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                width: '48px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: isSaved ? '#ff4d4d' : 'inherit',
                                marginLeft: '10px'
                            }}
                            title={isSaved ? "Remove from Wishlist" : "Add to Wishlist"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>
                    </div>
                    <p style={{ fontSize: '0.875rem', textAlign: 'center', color: '#666', marginTop: '0.5rem' }}>
                        Free shipping on orders over $100
                    </p>

                    <div className={styles.description} dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
                </div>
            </div>

            {/* Recommendations Placeholder */}
            <div className={styles.recommendations}>
                <h2 className={styles.recTitle}>Complete The Look</h2>
                <div className={styles.recGrid}>
                    {/* Placeholders */}
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ aspectRatio: '3/4', backgroundColor: '#f5f5f5' }}></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
