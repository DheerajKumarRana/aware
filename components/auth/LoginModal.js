'use client';

import { useState } from 'react';
import { useAuth } from './auth-context';
import { client, customerCreateMutation, customerAccessTokenCreateMutation } from '@/lib/shopify';
import styles from './LoginModal.module.css';

export default function LoginModal() {
    const { isLoginModalOpen, closeLoginModal, login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' or 'email'

    // Form states
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isSignup, setIsSignup] = useState(false); // Toggle between login and signup for email

    if (!isLoginModalOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (loginMethod === 'email') {
            try {
                if (isSignup) {
                    // Email Signup
                    const { data } = await client.request(customerCreateMutation, {
                        variables: {
                            input: { email, password, firstName, lastName }
                        }
                    });

                    if (data?.customerCreate?.customerUserErrors?.length > 0) {
                        setError(data.customerCreate.customerUserErrors[0].message);
                        setLoading(false);
                    } else {
                        // Success - switch to login or auto-login if possible (Shopify requires login after signup)
                        setIsSignup(false);
                        setError('Account created! Please log in.');
                        setLoading(false);
                    }
                } else {
                    // Email Login
                    const { data } = await client.request(customerAccessTokenCreateMutation, {
                        variables: {
                            input: { email, password }
                        }
                    });

                    if (data?.customerAccessTokenCreate?.customerUserErrors?.length > 0) {
                        setError(data.customerAccessTokenCreate.customerUserErrors[0].message);
                        setLoading(false);
                    } else if (data?.customerAccessTokenCreate?.customerAccessToken?.accessToken) {
                        const token = data.customerAccessTokenCreate.customerAccessToken.accessToken;
                        login(token);
                        closeLoginModal();
                    }
                }
            } catch (err) {
                setError('An error occurred. Please try again.');
                console.error(err);
                setLoading(false);
            }
        } else {
            // Simulate Phone OTP
            setTimeout(() => {
                setLoading(false);
                alert(`OTP sent to ${phone}`);
                login('demo-token');
                closeLoginModal();
            }, 1000);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeBtn} onClick={closeLoginModal}>×</button>
                <div className={styles.content}>
                    <div className={styles.imageSection}>
                        <img
                            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"
                            alt="Fashion Model"
                            className={styles.image}
                        />
                    </div>
                    <div className={styles.formSection}>
                        <h2 className={styles.title}>{isSignup ? 'CREATE ACCOUNT' : 'LOGIN'}</h2>
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
                            ) : (
                                <>
                                    {isSignup && (
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
                                        </>
                                    )}
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
                                {loading ? 'PROCESSING...' : (loginMethod === 'phone' ? 'SEND OTP' : (isSignup ? 'CREATE ACCOUNT' : 'LOGIN'))}
                            </button>
                        </form>

                        {loginMethod === 'email' && (
                            <div style={{ marginTop: '1.5rem', width: '100%', maxWidth: '300px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
                                    <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
                                    <span style={{ padding: '0 10px', color: '#666', fontSize: '0.8rem' }}>OR</span>
                                    <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
                                </div>
                                <button
                                    onClick={() => setIsSignup(!isSignup)}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        background: 'white',
                                        border: '1px solid #000',
                                        color: '#000',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {isSignup ? 'Switch to Login' : 'Create New Account'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
