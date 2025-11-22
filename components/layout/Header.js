'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { useCart } from '@/components/cart/cart-context';
import { useWishlist } from '@/components/wishlist/wishlist-context';

export default function Header() {
    const { toggleCart, cart } = useCart();
    const { wishlist } = useWishlist();

    const cartQuantity = cart?.lines?.edges?.reduce((sum, { node }) => sum + node.quantity, 0) || 0;

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    AWARE
                </Link>

                <nav className={styles.nav}>
                    <div className={styles.navItem}>
                        <Link href="/collections/all" className={styles.navLink}>Shop All</Link>
                        {/* Mega Menu */}
                        <div className={styles.megaMenu}>
                            <div className={styles.megaContent}>
                                {/* Column 1: Featured */}
                                <div className={styles.megaColumn}>
                                    <h4>Featured</h4>
                                    <ul>
                                        <li><Link href="/collections/new">New</Link></li>
                                        <li><Link href="/collections/bestsellers">Bestsellers</Link></li>
                                        <li><Link href="/collections/trending">Trending</Link></li>
                                        <li><Link href="/pages/social">As Seen on Social</Link></li>
                                    </ul>
                                </div>

                                {/* Column 2: Categories */}
                                <div className={styles.megaColumn}>
                                    <h4>Categories</h4>
                                    <ul>
                                        <li><Link href="/collections/art-prints">Art Prints</Link></li>
                                        <li><Link href="/collections/framed-prints">Framed Prints</Link></li>
                                        <li><Link href="/collections/posters">Posters Wall</Link></li>
                                        <li><Link href="/collections/tapestries">Tapestries</Link></li>
                                        <li><Link href="/collections/canvas">Canvas</Link></li>
                                    </ul>
                                </div>

                                {/* Column 3: Shop by Color */}
                                <div className={styles.megaColumn}>
                                    <h4>Shop by Color</h4>

                                    <div className={styles.colorSectionTitle}>CLASSICS</div>
                                    <div className={styles.colorGrid}>
                                        <Link href="/collections/red" className={styles.colorSwatch} style={{ backgroundColor: '#FF4500' }} title="Red"></Link>
                                        <Link href="/collections/yellow" className={styles.colorSwatch} style={{ backgroundColor: '#FFD700' }} title="Yellow"></Link>
                                        <Link href="/collections/blue" className={styles.colorSwatch} style={{ backgroundColor: '#0047AB' }} title="Blue"></Link>
                                        <Link href="/collections/green" className={styles.colorSwatch} style={{ backgroundColor: '#008000' }} title="Green"></Link>
                                        <Link href="/collections/sky" className={styles.colorSwatch} style={{ backgroundColor: '#87CEEB' }} title="Sky"></Link>
                                        <Link href="/collections/orange" className={styles.colorSwatch} style={{ backgroundColor: '#FFA500' }} title="Orange"></Link>
                                        <Link href="/collections/beige" className={styles.colorSwatch} style={{ backgroundColor: '#F5F5DC' }} title="Beige"></Link>
                                        <Link href="/collections/peach" className={styles.colorSwatch} style={{ backgroundColor: '#FFDAB9' }} title="Peach"></Link>
                                    </div>

                                    <div className={`${styles.colorSectionTitle} ${styles.trending}`}>TRENDING</div>
                                    <div className={styles.colorGrid}>
                                        <Link href="/collections/lemon" className={styles.colorSwatch} style={{ backgroundColor: '#FFFACD' }} title="Lemon"></Link>
                                        <Link href="/collections/brown" className={styles.colorSwatch} style={{ backgroundColor: '#5D4037' }} title="Brown"></Link>
                                        <Link href="/collections/purple" className={styles.colorSwatch} style={{ backgroundColor: '#4A148C' }} title="Purple"></Link>
                                        <Link href="/collections/lilac" className={styles.colorSwatch} style={{ backgroundColor: '#C8A2C8' }} title="Lilac"></Link>
                                    </div>
                                </div>

                                {/* Column 4: Shop by Subject */}
                                <div className={styles.megaColumn}>
                                    <h4>Shop by Subject</h4>
                                    <ul>
                                        <li><Link href="/collections/bauhaus">Bauhaus</Link></li>
                                        <li><Link href="/collections/matisse">Matisse</Link></li>
                                        <li><Link href="/collections/pop-art">Pop Art</Link></li>
                                        <li><Link href="/collections/bohemian">Bohemian</Link></li>
                                        <li><Link href="/collections/cottage-core">Cottage Core</Link></li>
                                        <li><Link href="/collections/minimal">Minimal</Link></li>
                                        <li><Link href="/collections/scandinavian">Scandinavian</Link></li>
                                    </ul>
                                </div>

                                {/* Column 5: Featured Image */}
                                <div className={styles.megaColumn}>
                                    <div className={styles.megaImageWrapper}>
                                        <img
                                            src="https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=1000&auto=format&fit=crop"
                                            alt="Featured Collection"
                                            className={styles.megaImage}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Link href="/collections/all" className={styles.navLink}>All</Link>
                    <Link href="/pages/about" className={styles.navLink}>About</Link>
                </nav>

                <div className={styles.actions}>
                    <Link href="/wishlist" className={styles.iconButton}>
                        <span className={styles.wishlistIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            {wishlist.length > 0 && <span className={styles.wishlistCount}>{wishlist.length}</span>}
                        </span>
                    </Link>
                    <Link href="/account" className={styles.iconButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </Link>
                    <button className={styles.iconButton} onClick={toggleCart}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        {cartQuantity > 0 && <span className={styles.wishlistCount} style={{ top: -5, right: -5 }}>{cartQuantity}</span>}
                    </button>
                </div>
            </div>
        </header>
    );
}
