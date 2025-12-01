'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './PriceRangeSlider.module.css';

export default function PriceRangeSlider({ min, max, onChange }) {
    const [minVal, setMinVal] = useState(min);
    const [maxVal, setMaxVal] = useState(max);
    const minValRef = useRef(min);
    const maxValRef = useRef(max);
    const range = useRef(null);

    // Convert to percentage
    const getPercent = useCallback(
        (value) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    // Set width of the range to decrease from the left side
    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxValRef.current);

        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [minVal, getPercent]);

    // Set width of the range to decrease from the right side
    useEffect(() => {
        const minPercent = getPercent(minValRef.current);
        const maxPercent = getPercent(maxVal);

        if (range.current) {
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [maxVal, getPercent]);

    return (
        <div className={styles.container}>
            <div className={styles.valuesDisplay}>
                Price: ₹{minVal} - ₹{maxVal}
            </div>

            <div className={styles.sliderContainer}>
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={minVal}
                    onChange={(event) => {
                        const value = Math.min(Number(event.target.value), maxVal - 1);
                        setMinVal(value);
                        minValRef.current = value;
                        onChange(value, maxVal);
                    }}
                    className={`${styles.thumb} ${styles.thumbLeft}`}
                    style={{ zIndex: minVal > max - 100 && "5" }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={maxVal}
                    onChange={(event) => {
                        const value = Math.max(Number(event.target.value), minVal + 1);
                        setMaxVal(value);
                        maxValRef.current = value;
                        onChange(minVal, value);
                    }}
                    className={`${styles.thumb} ${styles.thumbRight}`}
                />

                <div className={styles.slider}>
                    <div className={styles.sliderTrack} />
                    <div ref={range} className={styles.sliderRange} />
                </div>
            </div>

            <div className={styles.staticValues}>
                <span>₹{min}</span>
                <span>₹{max}</span>
            </div>
        </div>
    );
}
