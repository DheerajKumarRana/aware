'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-context';
import { client, customerCreateMutation } from '@/lib/shopify';
import styles from '@/components/auth/LoginModal.module.css'; // Reuse modal styles for consistency

export default function Signup() {
    const router = useRouter();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [phone, setPhone] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' or 'email'

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (loginMethod === 'email') {
            try {
                const { data } = await client.request(customerCreateMutation, {
                    variables: {
                        input: { email, password, firstName, lastName }
                    }
                });

                if (data?.customerCreate?.customerUserErrors?.length > 0) {
                    setError(data.customerCreate.customerUserErrors[0].message);
                    setLoading(false);
                } else {
                    // Success - redirect to login
                    router.push('/login?registered=true');
                }
            } catch (err) {
                setError('An error occurred. Please try again.');
                console.error(err);
                setLoading(false);
            }
        } else {
            // Simulate Phone signup process
            setTimeout(() => {
                setLoading(false);
                login('demo-token');
                router.push('/account');
            }, 1000);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem' }}>
            <div className={styles.modal} style={{ position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <div className={styles.content}>
                    <div className={styles.imageSection}>
                        <img
                            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"
                            alt="Fashion Model"
                            className={styles.image}
                        />
                    </div>
                    <div className={styles.formSection}>
                        <h2 className={styles.title}>LOGIN OR SIGNUP</h2>
                        <p className={styles.subtitle}>Unlock coupons, profile and much more</p>

                        {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', width: '100%', maxWidth: '300px' }}>
                            <button
                                onClick={() => { setLoginMethod('phone'); setError(''); }}
                                style={{
                                    flex: 1,
                                    padding: '0.5rem',
                                    border: 'none',
                                    borderBottom: loginMethod === 'phone' ? '2px solid black' : '1px solid #ddd',
                                    background: 'none',
                                    fontWeight: loginMethod === 'phone' ? 'bold' : 'normal',
                                    cursor: 'pointer'
                                }}
                            >
                                Phone
                            </button>
                            <button
                                onClick={() => { setLoginMethod('email'); setError(''); }}
                                style={{
                                    flex: 1,
                                    padding: '0.5rem',
                                    border: 'none',
                                    borderBottom: loginMethod === 'email' ? '2px solid black' : '1px solid #ddd',
                                    background: 'none',
                                    fontWeight: loginMethod === 'email' ? 'bold' : 'normal',
                                    cursor: 'pointer'
                                }}
                            >
                                Email
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            {loginMethod === 'phone' ? (
                                <>
                                    <div className={styles.inputGroup}>
                                        <input
                                            type="text"
                                            placeholder="Name (Optional)"
                                            className={styles.input}
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <span className={styles.prefix}>+91</span>
                                        <input
                                            type="tel"
                                            placeholder="Phone Number"
                                            className={styles.input}
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={styles.inputGroup}>
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            className={styles.input}
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <input
                                            type="text"
                                            placeholder="Last Name"
                                            className={styles.input}
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            className={styles.input}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            className={styles.input}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            minLength={8}
                                        />
                                    </div>
                                </>
                            )}

                            <button type="submit" className={styles.submitBtn} disabled={loading}>
                                {loading ? 'PROCESSING...' : (loginMethod === 'phone' ? 'SEND OTP' : 'CREATE ACCOUNT')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
