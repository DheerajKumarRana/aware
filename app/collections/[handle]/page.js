import { client, collectionQuery, productsQuery } from '@/lib/shopify';
import styles from './page.module.css';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import FilterSidebar from '@/components/collection/FilterSidebar';

// Force dynamic rendering to handle search params
export const dynamic = 'force-dynamic';

export default async function CollectionPage({ params, searchParams }) {
    const { handle } = await params;
    const resolvedSearchParams = await searchParams; // Next.js 15 requires awaiting searchParams

    // Parse filters from URL search params
    const filters = [];

    // Iterate over search params to build Shopify filter array
    // Example: ?filter.v.option.size=M -> { "variantOption": { "name": "size", "value": "M" } }
    Object.entries(resolvedSearchParams).forEach(([key, value]) => {
        if (key.startsWith('filter.v.option.')) {
            const optionName = key.replace('filter.v.option.', '');
            // Handle multiple values for same key
            const values = Array.isArray(value) ? value : [value];
            values.forEach(val => {
                filters.push({ variantOption: { name: optionName, value: val } });
            });
        } else if (key.startsWith('filter.p.m.')) {
            // Parse taxonomy/metafield filters
            // Format: filter.p.m.namespace.key
            const parts = key.replace('filter.p.m.', '').split('.');
            if (parts.length >= 2) {
                const namespace = parts[0];
                const keyName = parts.slice(1).join('.'); // Join back in case key has dots
                const values = Array.isArray(value) ? value : [value];
                values.forEach(val => {
                    // We use 'taxonomyMetafield' because that's what the API returned in the input
                    filters.push({
                        taxonomyMetafield: {
                            namespace,
                            key: keyName,
                            value: val
                        }
                    });
                });
            }
        } else if (key === 'filter.v.availability') {
            const val = Array.isArray(value) ? value[0] : value;
            filters.push({ available: val === '1' });
        } else if (key === 'filter.p.product_type') {
            const values = Array.isArray(value) ? value : [value];
            values.forEach(val => {
                filters.push({ productType: val });
            });
        } else if (key.startsWith('filter.v.price.')) {
            const type = key.replace('filter.v.price.', ''); // gte or lte
            const val = Array.isArray(value) ? value[0] : value;
            filters.push({ price: { [type === 'gte' ? 'min' : 'max']: parseFloat(val) } });
        }
    });

    let collection = null;
    let availableFilters = [];

    try {
        if (handle === 'all') {
            // "All" collection logic often needs a specific collection handle in Shopify
            // or a different query. For simplicity, we'll try to fetch a collection named 'all'
            // If that fails, we fallback to productsQuery but that doesn't support facets easily.
            // Best practice: Create a smart collection in Shopify with handle 'all' (condition: price > 0)

            const { data } = await client.request(collectionQuery, {
                variables: { handle, filters }
            });

            if (data?.collection) {
                collection = data.collection;
                availableFilters = data.collection.products.filters;
            } else {
                // Fallback if 'all' collection doesn't exist
                const { data: allData } = await client.request(productsQuery, { variables: { first: 20 } });
                collection = {
                    title: 'All Products',
                    description: 'Browse our entire collection.',
                    products: allData?.products
                };
            }
        } else {
            // Fetch specific collection
            const { data } = await client.request(collectionQuery, {
                variables: { handle, filters }
            });
            collection = data?.collection;
            availableFilters = data?.collection?.products?.filters || [];
        }
    } catch (err) {
        console.error('Error fetching collection:', err);
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
                {/* Dynamic Filters */}
                <FilterSidebar filters={availableFilters} />

                {/* Product Grid */}
                <main className={styles.main}>
                    {products.length === 0 ? (
                        <div className={styles.emptyState}>
                            <h3>No products found</h3>
                            <p>Try changing your filters or check back later.</p>
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {products.map((product) => {
                                return (
                                    <ProductCard key={product.id} product={product} />
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
