'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import styles from './FilterSidebar.module.css';
import PriceRangeSlider from './PriceRangeSlider';

export default function FilterSidebar({ filters }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Helper to update URL params
    const updateFilter = (key, value, checked) => {
        const params = new URLSearchParams(searchParams.toString());

        if (checked) {
            // Add filter
            // Shopify expects repeated keys for multiple values: ?filter.v.option.size=M&filter.v.option.size=L
            params.append(key, value);
        } else {
            // Remove specific value
            const values = params.getAll(key);
            params.delete(key);
            values.filter(v => v !== value).forEach(v => params.append(key, v));
        }

        router.push(`?${params.toString()}`);
    };

    const handlePriceChange = (e, type) => {
        // Debounce could be added here for better performance
        const params = new URLSearchParams(searchParams.toString());
        const value = e.target.value;
        const key = `filter.v.price.${type}`; // gte or lte

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        // Use replace for smoother typing experience, or push on blur
        router.replace(`?${params.toString()}`);
    };

    if (!filters || filters.length === 0) {
        return <div className={styles.empty}>No filters available</div>;
    }

    return (
        <aside className={styles.sidebar}>
            {filters.map((filter) => (
                <div key={filter.id} className={styles.filterGroup}>
                    <h3 className={styles.filterTitle}>{filter.label}</h3>

                    {filter.type === 'PRICE_RANGE' ? (
                        <div className={styles.priceRange}>
                            <PriceRangeSlider
                                min={0}
                                max={10000} // Adjust max price as needed
                                onChange={(min, max) => {
                                    // Debounce URL updates
                                    const timeoutId = setTimeout(() => {
                                        const params = new URLSearchParams(searchParams.toString());
                                        if (min > 0) params.set('filter.v.price.gte', min);
                                        else params.delete('filter.v.price.gte');

                                        if (max < 10000) params.set('filter.v.price.lte', max);
                                        else params.delete('filter.v.price.lte');

                                        router.replace(`?${params.toString()}`);
                                    }, 500);
                                    return () => clearTimeout(timeoutId);
                                }}
                            />
                        </div>
                    ) : (
                        <div className={styles.filterList}>
                            {filter.values.map((value) => {
                                // Parse the input JSON to get the key/value for URL
                                // Example input: {"variantOption":{"name":"color","value":"Blue"}}
                                const inputObj = JSON.parse(value.input);
                                let paramKey = '';
                                let paramValue = '';

                                if (inputObj.variantOption) {
                                    paramKey = `filter.v.option.${inputObj.variantOption.name.toLowerCase()}`;
                                    paramValue = inputObj.variantOption.value;
                                } else if (inputObj.taxonomyMetafield) {
                                    // Handle taxonomy filters (e.g. color, size from standard taxonomy)
                                    // Format: filter.p.m.namespace.key
                                    paramKey = `filter.p.m.${inputObj.taxonomyMetafield.namespace}.${inputObj.taxonomyMetafield.key}`;
                                    paramValue = inputObj.taxonomyMetafield.value;
                                } else if (inputObj.available !== undefined) {
                                    paramKey = 'filter.v.availability';
                                    paramValue = inputObj.available ? '1' : '0';
                                } else if (inputObj.productType) {
                                    paramKey = 'filter.p.product_type';
                                    paramValue = inputObj.productType;
                                }

                                // Safety check: if we couldn't parse the key, don't select it
                                const isChecked = paramKey ? searchParams.getAll(paramKey).includes(paramValue) : false;

                                // Debug logging
                                console.log('Filter Debug:', {
                                    label: value.label,
                                    inputRaw: value.input,
                                    inputObj: inputObj,
                                    paramKey,
                                    isChecked
                                });

                                return (
                                    <label key={value.id} className={styles.filterItem}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkboxInput}
                                            checked={isChecked}
                                            onChange={(e) => updateFilter(paramKey, paramValue, e.target.checked)}
                                        />
                                        <span className={`${styles.checkbox} ${isChecked ? styles.checked : ''}`}></span>
                                        <span className={styles.label}>{value.label}</span>
                                        <span className={styles.count}>({value.count})</span>
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </div>
            ))}
        </aside>
    );
}
