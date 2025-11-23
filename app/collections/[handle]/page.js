import { client, collectionQuery, productsQuery } from '@/lib/shopify';
import styles from './page.module.css';
import Link from 'next/link';

// Force dynamic rendering to handle search params
export const dynamic = 'force-dynamic';

export default async function CollectionPage({ params, searchParams }) {
    const { handle } = await params;

    // Parse filters from URL search params
    // Example: ?filter.v.option.size=M becomes { "v.option.size": "M" }
    // Note: This is a simplified implementation. Real Shopify filtering requires mapping these correctly to the API input.
    // For this demo, we'll fetch the collection but the actual filtering logic would need a more complex mapper 
    // or using the Shopify Search & Discovery app's standard URL structure.

    // Since we are using the basic Storefront API, we'll fetch products and display them.
    // Implementing full dynamic filtering requires fetching 'facets' which is available in newer API versions.
    // For now, we will display the structure and the products.

    let collection = null;

    try {
        console.log(`Fetching collection with handle: ${handle}`);

        if (handle === 'all') {
            // Fetch all products directly
            const { data } = await client.request(productsQuery, { variables: { first: 20 } });
            console.log('All products data received:', data);
            collection = {
                title: 'All Products',
                description: 'Browse our entire collection.',
                products: data?.products
            };
        } else {
            // Fetch specific collection
            const { data } = await client.request(collectionQuery, {
                variables: { handle, filters: [] }
            });
            console.log('Collection data received:', data);
            collection = data?.collection;
        }
    } catch (err) {
        console.error('Error fetching collection:', err);
        console.error('Error details:', JSON.stringify(err, null, 2));
    }

    if (!collection) {
        return (
            <div className={styles.container}>
                <h1>Collection Not Found</h1>
                <Link href="/" style={{ textDecoration: 'underline' }}>Return Home</Link>
            </div>
        );
    }

    const products = collection.products.edges.map(edge => edge.node);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>{collection.title}</h1>
                {collection.description && (
                    <p className={styles.description}>{collection.description}</p>
                )}
            </div>

            <div className={styles.layout}>
                {/* Sidebar - Placeholder for Dynamic Filters */}
                <aside className={styles.sidebar}>
                    <div className={styles.filterGroup}>
                        <h3 className={styles.filterTitle}>Availability</h3>
                        <div className={styles.filterList}>
                            <label className={styles.filterItem}>
                                <div className={`${styles.checkbox} ${styles.checked}`}></div>
                                In Stock
                            </label>
                            <label className={styles.filterItem}>
                                <div className={styles.checkbox}></div>
                                Out of Stock
                            </label>
                        </div>
                    </div>

                    <div className={styles.filterGroup}>
                        <h3 className={styles.filterTitle}>Price</h3>
                        <div className={styles.filterList}>
                            <label className={styles.filterItem}>
                                <div className={styles.checkbox}></div>
                                Under $50
                            </label>
                            <label className={styles.filterItem}>
                                <div className={styles.checkbox}></div>
                                $50 - $100
                            </label>
                            <label className={styles.filterItem}>
                                <div className={styles.checkbox}></div>
                                $100+
                            </label>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <main className={styles.main}>
                    {products.length === 0 ? (
                        <div className={styles.emptyState}>
                            <h3>No products found</h3>
                            <p>Try changing your filters or check back later.</p>
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {products.map((product) => (
                                <Link key={product.id} href={`/products/${product.handle}`} className={styles.productCard}>
                                    <div className={styles.imageWrapper}>
                                        {product.images.edges[0] ? (
                                            <img
                                                src={product.images.edges[0].node.url}
                                                alt={product.images.edges[0].node.altText || product.title}
                                                className={styles.productImage}
                                            />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', backgroundColor: '#eee' }}></div>
                                        )}
                                    </div>
                                    <div className={styles.productInfo}>
                                        <h3 className={styles.productTitle}>{product.title}</h3>
                                        <p className={styles.productPrice}>
                                            {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
