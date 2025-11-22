import Link from 'next/link';
import styles from './page.module.css';
import Link from 'next/link';
import Banner from '@/components/home/Banner';

export default function Home() {
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
      />

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
                <span>$120</span>
              </div>
            </div>
          </div>
          <div className={styles.lookProducts}>
            <h2 className={styles.sectionTitle}>Shop The Look</h2>
            <p className={styles.sectionSubtitle}>Effortless elegance for every occasion.</p>
            <div className={styles.productStack}>
              {/* Product Card Placeholders */}
              {[1, 2].map((i) => (
                <Link href={`/products/sample-product-${i}`} key={i} className={styles.miniProductCard}>
                  <div className={styles.miniProductImage}></div>
                  <div className={styles.miniProductInfo}>
                    <h4>Essential Blazer</h4>
                    <p>$180.00</p>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/collections/all" className={styles.textLink}>View All Products &rarr;</Link>
          </div>
        </div>
      </section>

      {/* Trending Carousel */}
      <section className={styles.trending}>
        <div className={styles.container}>
          <div className={styles.trendingHeader}>
            <h2 className={styles.sectionTitle}>Trending Now</h2>
            <div className={styles.carouselControls}>
              <button className={styles.controlBtn}>&larr;</button>
              <button className={styles.controlBtn}>&rarr;</button>
            </div>
          </div>

          <div className={styles.carouselTrack}>
            {/* Carousel Items */}
            {[1, 2, 3, 4].map((i) => (
              <Link href={`/products/trending-${i}`} key={i} className={styles.carouselItem}>
                <div className={styles.carouselImage}></div>
                <div className={styles.carouselInfo}>
                  <h3>Summer Dress</h3>
                  <p>$89.00</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
