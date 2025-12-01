import Link from 'next/link';
import styles from './FeaturedCategories.module.css';

const categories = [
    {
        id: 1,
        name: 'New Arrivals',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
        link: '/collections/new'
    },
    {
        id: 2,
        name: 'Men\'s Collection',
        image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1974&auto=format&fit=crop',
        link: '/collections/men'
    },
    {
        id: 3,
        name: 'Art Prints',
        image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=2080&auto=format&fit=crop',
        link: '/collections/art-prints'
    },
    {
        id: 4,
        name: 'Best Sellers',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
        link: '/collections/bestsellers'
    }
];

export default function FeaturedCategories() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>Shop by Category</h2>
                <div className={styles.grid}>
                    {categories.map((category) => (
                        <Link href={category.link} key={category.id} className={styles.card}>
                            <img src={category.image} alt={category.name} className={styles.image} />
                            <div className={styles.overlay}>
                                <span className={styles.label}>{category.name}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
