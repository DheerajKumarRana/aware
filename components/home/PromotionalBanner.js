import Link from 'next/link';
import styles from './PromotionalBanner.module.css';

export default function PromotionalBanner() {
    return (
        <section className={styles.section}>
            <div className={styles.overlay}></div>
            <div className={styles.content}>
                <h2 className={styles.title}>Summer Collection</h2>
                <p className={styles.subtitle}>Discover the latest trends and elevate your style this season.</p>
                <Link href="/collections/summer-sale" className={styles.button}>
                    Shop Now
                </Link>
            </div>
        </section>
    );
}
