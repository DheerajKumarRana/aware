import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import styles from './NewArrivals.module.css';



export default function NewArrivals({ products }) {
    if (!products || products.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>New Arrivals</h2>
                    <Link href="/collections/new-arrivals" className={styles.link}>View All</Link>
                </div>
                <div className={styles.grid}>
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
