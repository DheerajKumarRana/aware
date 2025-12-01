'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/components/wishlist/wishlist-context';
import { useAuth } from '@/components/auth/auth-context';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { isLoggedIn, openLoginModal } = useAuth();
    const [selectedImage, setSelectedImage] = useState(product.images.edges[0]?.node.url);
    const [activeColor, setActiveColor] = useState(null);

    // Extract color variants
    const colorOptions = new Map();
    product.variants?.edges?.forEach(({ node: variant }) => {
        const colorOption = variant.selectedOptions.find(opt => opt.name === 'Color');
        if (colorOption && variant.image) {
            if (!colorOptions.has(colorOption.value)) {
                colorOptions.set(colorOption.value, variant.image.url);
            }
        }
    });

    const colors = Array.from(colorOptions.entries());
    const displayColors = colors.slice(0, 4);
    const remainingColors = colors.length - 4;

    const handleSwatchClick = (e, imageUrl, color) => {
        e.preventDefault(); // Prevent navigation
        setSelectedImage(imageUrl);
        setActiveColor(color);
    };

    const handleWishlistClick = (e) => {
        e.preventDefault(); // Prevent navigation
        if (!isLoggedIn) {
            openLoginModal();
            return;
        }
        toggleWishlist(product);
    };

    const isWishlisted = isInWishlist(product.id);

    return (
        <Link href={`/products/${product.handle}`} className={styles.productCard}>
            <div className={styles.imageWrapper}>
                {selectedImage ? (
                    <img
                        src={selectedImage}
                        alt={product.title}
                        className={styles.productImage}
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#eee' }}></div>
                )}

                <button
                    className={`${styles.wishlistButton} ${isWishlisted ? styles.active : ''}`}
                    onClick={handleWishlistClick}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
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

            <div className={styles.productInfo}>
                <h3 className={styles.productTitle}>{product.title}</h3>
                <p className={styles.productPrice}>
                    {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
                </p>

                {/* Color Swatches */}
                {colors.length > 0 && (
                    <div className={styles.swatchContainer}>
                        {displayColors.map(([color, imageUrl]) => (
                            <div
                                key={color}
                                className={`${styles.swatch} ${activeColor === color ? styles.active : ''}`}
                                style={{ backgroundImage: `url(${imageUrl})` }}
                                title={color}
                                onClick={(e) => handleSwatchClick(e, imageUrl, color)}
                            />
                        ))}
                        {remainingColors > 0 && (
                            <span className={styles.moreSwatches}>+{remainingColors}</span>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
}
