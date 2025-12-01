'use client';

import { useRef } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import styles from './Bestsellers.module.css';



export default function Bestsellers({ products }) {
    const carouselRef = useRef(null);

    const scroll = (direction) => {
        if (carouselRef.current) {
            const { current } = carouselRef;
            const scrollAmount = 350;
            if (direction === 'left') {
                current.scrollLeft -= scrollAmount;
            } else {
                current.scrollLeft += scrollAmount;
            }
        }
    };

    if (!products || products.length === 0) return null;

    return (
        <section className={styles.bestsellersSection}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Bestsellers</h2>
                    <div className={styles.controls}>
                        <button className={styles.controlBtn} onClick={() => scroll('left')} aria-label="Scroll left">
                            &larr;
                        </button>
                        <button className={styles.controlBtn} onClick={() => scroll('right')} aria-label="Scroll right">
                            &rarr;
                        </button>
                    </div>
                </div>
                <div className={styles.carousel} ref={carouselRef}>
                    {products.map((product) => (
                        <div key={product.id} className={styles.carouselItem}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
