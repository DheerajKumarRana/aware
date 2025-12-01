'use client';

import { useWishlist } from '@/components/wishlist/wishlist-context';
import { useCart } from '@/components/cart/cart-context';
import styles from './page.module.css';
import Link from 'next/link';

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>My Wishlist</h1>

            {wishlist.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>Your wishlist is empty.</p>
                    <Link href="/collections/all" style={{ textDecoration: 'underline', marginTop: '1rem', display: 'inline-block' }}>
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className={styles.grid}>
                    {wishlist.map((product) => (
                        <div key={product.id} className={styles.card}>
                            <button
                                className={styles.removeBtn}
                                onClick={(e) => {
                                    e.preventDefault();
                                    removeFromWishlist(product.id);
                                }}
                                title="Remove from Wishlist"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </button>
                            <Link href={`/products/${product.handle}`} className={styles.link}>
                                <div className={styles.imageWrapper}>
                                    <img
                                        src={product.featuredImage?.url || product.images?.edges?.[0]?.node?.url || 'https://via.placeholder.com/300'}
                                        alt={product.title}
                                        className={styles.image}
                                    />
                                </div>
                                <div className={styles.details}>
                                    <h3 className={styles.productTitle}>{product.title}</h3>
                                    <p className={styles.price}>
                                        {product.priceRange?.minVariantPrice?.amount} {product.priceRange?.minVariantPrice?.currencyCode}
                                    </p>
                                    <div className={styles.buttonGroup}>
                                        <button
                                            className={styles.addToCartBtn}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const variantId = product.variants?.edges?.[0]?.node?.id;
                                                if (variantId) addToCart(variantId, 1);
                                            }}
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            className={styles.buyNowBtn}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const variantId = product.variants?.edges?.[0]?.node?.id;
                                                if (variantId) {
                                                    addToCart(variantId, 1);
                                                    window.location.href = '/cart';
                                                }
                                            }}
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
