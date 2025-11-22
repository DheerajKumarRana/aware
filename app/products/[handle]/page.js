import { client, productQuery } from '@/lib/shopify';
import styles from './page.module.css';
import Link from 'next/link';

// Force dynamic rendering for now to ensure fresh data
export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }) {
    const { handle } = params;

    let product = null;

    try {
        const { data } = await client.request(productQuery, {
            variables: { handle }
        });
        product = data?.product;
    } catch (err) {
        console.error('Error fetching product:', err);
    }

    if (!product) {
        return (
            <div className={styles.container}>
                <h1>Product Not Found</h1>
                <p>We couldn't find the product you're looking for.</p>
                <Link href="/" style={{ textDecoration: 'underline' }}>Return Home</Link>
            </div>
        );
    }

    const images = product.images.edges.map(edge => edge.node);
    const variants = product.variants.edges.map(edge => edge.node);

    // Group options (e.g., Size, Color)
    // This is a simplified view; in a real app you'd manage state for selected options
    const options = {};
    variants.forEach(variant => {
        variant.selectedOptions.forEach(opt => {
            if (!options[opt.name]) options[opt.name] = new Set();
            options[opt.name].add(opt.value);
        });
    });

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
                        <button className={styles.addToCart}>
                            Add to Cart
                        </button>
                        <p style={{ fontSize: '0.875rem', textAlign: 'center', color: '#666' }}>
                            Free shipping on orders over $100
                        </p>
                    </div>

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
