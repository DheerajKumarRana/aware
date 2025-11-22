'use client';

import { client, collectionQuery } from '@/lib/shopify';
import { useState, useEffect } from 'react';

export default function TestCollectionPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await client.request(collectionQuery, {
                    variables: { handle: 'men', filters: [] }
                });
                setData(result);
            } catch (err) {
                setError(err);
            } finally {
            </pre >
        </div >
    );
}
