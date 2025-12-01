import Link from 'next/link';
import styles from './page.module.css';
import Banner from '@/components/home/Banner';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import NewArrivals from '@/components/home/NewArrivals';
import Bestsellers from '@/components/home/Bestsellers';
import StyleShowcase from '@/components/home/StyleShowcase';
import PromotionalBanner from '@/components/home/PromotionalBanner';

import { client, productsQuery } from '@/lib/shopify';

export default async function Home() {
  // Fetch products from Shopify
  let products = [];
  try {
    const { data } = await client.request(productsQuery, { variables: { first: 10 } });
    products = data.products.edges.map(edge => edge.node);
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to empty array or handle error gracefully
  }

  const newArrivals = products.slice(0, 4);
  const bestsellers = products.slice(4, 10);

  // Placeholder data for the banner
  // In a real app, this could come from Shopify Metaobjects or a CMS
  const bannerSlides = [
    {
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop',
      alt: 'Fashion Collection 1',
      link: '/collections/new-arrivals'
    },
    {
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
      alt: 'Fashion Collection 2',
      link: '/collections/summer-sale'
    },
    {
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop',
      alt: 'Fashion Collection 3',
      link: '/collections/all'
    }
  ];

  return (
    <main className={styles.main}>
      {/* Custom Banner Section */}
      <Banner
        slides={bannerSlides}
        marqueeText="FREE SHIPPING ON ALL ORDERS OVER $100 • NEW ARRIVALS JUST LANDED • SHOP THE LATEST TRENDS"
        autoplaySpeed={5000}
        marqueeSpeed={20}
      />

      {/* Featured Categories */}
      <FeaturedCategories />

      {/* New Arrivals */}
      <NewArrivals products={newArrivals} />

      {/* Shop the Look Section */}
      <section className={styles.shopTheLook}>
        <div className={styles.lookContainer}>
          <div className={styles.lookImageWrapper}>
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"
              alt="Complete Look"
              className={styles.lookImage}
            />
            <div className={styles.hotspot} style={{ top: '30%', left: '40%' }}>
              <div className={styles.hotspotDot}></div>
              <div className={styles.hotspotCard}>
                <p>Silk Blouse</p>
                <span>₹3,999</span>
              </div>
            </div>
          </div>
          <div className={styles.lookProducts}>
            <h2 className={styles.sectionTitle}>Shop The Look</h2>
            <p className={styles.sectionSubtitle}>Effortless elegance for every occasion.</p>
            <div className={styles.productStack}>
              {/* Product Card Placeholders */}
              {/* Product Card Placeholders - Using real products if available */}
              {products.slice(0, 2).map((product) => (
                <Link href={`/products/${product.handle}`} key={product.id} className={styles.productCard}>
                  <img
                    src={product.images?.edges[0]?.node?.url || "https://via.placeholder.com/300"}
                    alt={product.title}
                    className={styles.productThumb}
                  />
                  <div className={styles.productInfo}>
                    <h4>{product.title}</h4>
                    <p>{product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/collections/all" className={styles.textLink}>View All Products &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Style Showcase */}
      <StyleShowcase />

      {/* Bestsellers */}
      <Bestsellers products={bestsellers} />

      {/* Promotional Banner */}
      <PromotionalBanner />
    </main>
  );
}
