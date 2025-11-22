import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div>
      {/* Hero Section - Editorial Style */}
      <section className={styles.hero}>
        {/* Placeholder for video - using a high quality image for now */}
        <div className={styles.videoBackground} style={{ backgroundColor: '#1a1a1a' }}>
          {/* In a real app, use <video> tag here */}
          <img
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop"
            alt="Hero Background"
            className={styles.videoBackground}
          />
        </div>
        <div className={styles.overlay}></div>

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>The New Standard</h1>
          <p className={styles.heroSubtitle}>
            Elevated essentials for the conscious creator.
          </p>
          <Link href="/collections/all" className={styles.ctaButton}>
            Explore Collection
          </Link>
        </div>
      </section>

      {/* Shop the Look - Lifestyle Integration */}
      <section className={styles.shopTheLook}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Shop The Look</h2>
        </div>

        <div className={styles.lookContainer}>
          <div className={styles.lookImageWrapper}>
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"
              alt="Model wearing full outfit"
              className={styles.lookImage}
            />
          </div>

          <div className={styles.productList}>
            <div className={styles.productCard}>
              <div className={styles.productThumb} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1551028919-ac7bcb57458b?q=80&w=500&auto=format&fit=crop)', backgroundSize: 'cover' }}></div>
              <div className={styles.productInfo}>
                <h4>Essential Oversized Tee</h4>
                <p>$45.00</p>
                <Link href="/products/essential-tee" className={styles.shopLink}>View Product</Link>
              </div>
            </div>

            <div className={styles.productCard}>
              <div className={styles.productThumb} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1542272617-08f086302542?q=80&w=500&auto=format&fit=crop)', backgroundSize: 'cover' }}></div>
              <div className={styles.productInfo}>
                <h4>Relaxed Fit Trousers</h4>
                <p>$85.00</p>
                <Link href="/products/relaxed-trousers" className={styles.shopLink}>View Product</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Carousel - Community Favorites */}
      <section className={styles.trending}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Trending Now</h2>
        </div>

        <div className={styles.trendingScroll}>
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className={styles.trendingItem}>
              <div className={styles.trendingImage} style={{ backgroundImage: `url(https://images.unsplash.com/photo-${item === 1 ? '1521572163474-6864f9cf17ab' : item === 2 ? '1503341455253-b2e72333dbdb' : '1576566588028-4147f3842f27'}?q=80&w=500&auto=format&fit=crop)`, backgroundSize: 'cover' }}></div>
              <div className={styles.trendingMeta}>
                <div className={styles.trendingName}>Signature Hoodie</div>
                <div className={styles.trendingPrice}>$65.00</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
