import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <h3>AWARE</h3>
                    <p>Premium clothing for the modern individual. Designed for comfort, engineered for style.</p>
                </div>

                <div className={styles.column}>
                    <h4>Shop</h4>
                    <ul>
                        <li><Link href="/collections/all">All Products</Link></li>
                        <li><Link href="/collections/new-arrivals">New Arrivals</Link></li>
                        <li><Link href="/collections/accessories">Accessories</Link></li>
                    </ul>
                </div>

                <div className={styles.column}>
                    <h4>Support</h4>
                    <ul>
                        <li><Link href="/faq">FAQ</Link></li>
                        <li><Link href="/shipping">Shipping</Link></li>
                        <li><Link href="/returns">Returns</Link></li>
                    </ul>
                </div>

                <div className={styles.column}>
                    <h4>Company</h4>
                    <ul>
                        <li><Link href="/about">About Us</Link></li>
                        <li><Link href="/contact">Contact</Link></li>
                        <li><Link href="/terms">Terms</Link></li>
                    </ul>
                </div>
            </div>

            <div className={styles.copyright}>
                © {new Date().getFullYear()} Aware Clothing. All rights reserved.
            </div>
        </footer>
    );
}
