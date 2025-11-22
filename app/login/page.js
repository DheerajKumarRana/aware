'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { client, customerAccessTokenCreateMutation } from '@/lib/shopify';
import styles from '../auth.module.css';

export default function Login() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const { data } = await client.request(customerAccessTokenCreateMutation, {
                variables: {
                    input: { email, password }
                }
            });

            if (data?.customerAccessTokenCreate?.customerUserErrors?.length > 0) {
                setError(data.customerAccessTokenCreate.customerUserErrors[0].message);
            } else if (data?.customerAccessTokenCreate?.customerAccessToken?.accessToken) {
                // Success - store token and redirect
                const token = data.customerAccessTokenCreate.customerAccessToken.accessToken;
                localStorage.setItem('shopifyCustomerAccessToken', token);
                // Force a hard refresh or use context to update auth state
                window.location.href = '/account';
            }
        } catch (err) {
            setError('Invalid email or password.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Welcome Back</h1>
                <p className={styles.subtitle}>Sign in to access your account.</p>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input type="email" id="email" name="email" required className={styles.input} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input type="password" id="password" name="password" required className={styles.input} />
                    </div>

                    <button type="submit" disabled={loading} className={styles.button}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className={styles.footer}>
                    Don't have an account? <Link href="/signup" className={styles.link}>Sign up</Link>
                </div>
            </div>
        </div>
    );
}
