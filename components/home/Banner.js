'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './Banner.module.css';
import Link from 'next/link';

export default function Banner({
    slides = [],
    marqueeText = "Welcome to our store",
    autoplaySpeed = 5000,
    enableAutoplay = true
}) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const timeoutRef = useRef(null);
    const progressRefs = useRef([]);

    const totalSlides = slides.length;

    // Reset progress bars
    const resetProgress = () => {
        progressRefs.current.forEach(bar => {
            if (bar) {
                bar.style.transition = 'none';
                bar.style.width = '0%';
            }
        });
    };

    // Animate current progress bar
    const animateProgress = (index) => {
        const bar = progressRefs.current[index];
        if (bar && enableAutoplay) {
            // Force reflow
            bar.getBoundingClientRect();
            bar.style.transition = `width ${autoplaySpeed}ms linear`;
            bar.style.width = '100%';
        }
    };

    const goToSlide = (index) => {
        if (index === currentSlide) return;
        setCurrentSlide(index);
        resetProgress();
        // Animation will be triggered by useEffect
    };

    useEffect(() => {
        resetProgress();
        animateProgress(currentSlide);

        if (enableAutoplay) {
            timeoutRef.current = setTimeout(() => {
                setCurrentSlide((prev) => (prev + 1) % totalSlides);
            }, autoplaySpeed);
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [currentSlide, enableAutoplay, autoplaySpeed, totalSlides]);

    if (!slides.length) return null;

    return (
        <div className={styles.bannerSection}>
            <div className={styles.bannerCarousels}>
                <div
                    className={styles.bannerTrack}
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {slides.map((slide, index) => (
                        <div key={index} className={styles.bannerSlide}>
                            {slide.link ? (
                                <Link href={slide.link}>
                                    <img src={slide.image} alt={slide.alt || `Slide ${index + 1}`} />
                                </Link>
                            ) : (
                                <img src={slide.image} alt={slide.alt || `Slide ${index + 1}`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className={styles.bannerPagination}>
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`${styles.bannerDot} ${index === currentSlide ? styles.active : ''}`}
                            onClick={() => goToSlide(index)}
                        >
                            <div
                                className={styles.progress}
                                ref={el => progressRefs.current[index] = el}
                            ></div>
                        </div>
                    ))}
                </div>
            </div>

            {marqueeText && (
                <div className={styles.bannerMarquee}>
                    <div className={styles.marqueeContent}>
                        {[1, 2, 3, 4].map(i => (
                            <span key={i} className={styles.marqueeItem}>{marqueeText}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
