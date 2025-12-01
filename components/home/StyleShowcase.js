import Link from 'next/link';
import styles from './StyleShowcase.module.css';

const stylesList = [
    {
        id: 1,
        name: 'Bauhaus',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
        link: '/collections/bauhaus'
    },
    {
        id: 2,
        name: 'Matisse',
        image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000&auto=format&fit=crop',
        link: '/collections/matisse'
    },
    {
        id: 3,
        name: 'Pop Art',
        image: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=1000&auto=format&fit=crop',
        link: '/collections/pop-art'
    },
    {
        id: 4,
        name: 'Minimal',
        image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1000&auto=format&fit=crop',
        link: '/collections/minimal'
    },
    {
        id: 5,
        name: 'Bohemian',
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000&auto=format&fit=crop',
        link: '/collections/bohemian'
    }
];

export default function StyleShowcase() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Curated Styles</h2>
                    <p className={styles.subtitle}>Explore our collections by artistic movement and aesthetic.</p>
                </div>
                <div className={styles.grid}>
                    {stylesList.map((style) => (
                        <Link href={style.link} key={style.id} className={styles.item}>
                            <img src={style.image} alt={style.name} className={styles.image} />
                            <div className={styles.content}>
                                <h3 className={styles.itemTitle}>{style.name}</h3>
                                <span className={styles.itemLink}>Explore Collection</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
