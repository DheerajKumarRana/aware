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
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return <div style={{ padding: 40 }}>Loading debug data...</div>;
    if (error) return (
        <div style={{ padding: 40, color: 'red' }}>
            <h2>Error Occurred</h2>
            <p><strong>Message:</strong> {error.message}</p>
            <p><strong>Stack:</strong> {error.stack}</p>
            <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
    );

    return (
        <div style={{ padding: 40 }}>
            <h1>Debug: Men Collection</h1>
            <pre style={{ background: '#f4f4f4', padding: 20, borderRadius: 8, overflow: 'auto' }}>
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
}
