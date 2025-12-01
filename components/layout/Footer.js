'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

import { client, customerCreateMutation } from '@/lib/shopify';

export default function Footer() {
    const [currentYear, setCurrentYear] = useState(2025);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const { data } = await client.request(customerCreateMutation, {
                variables: {
                    input: { email, acceptsMarketing: true }
                }
            });

            if (data.customerCreate?.customerUserErrors?.length > 0) {
                throw new Error(data.customerCreate.customerUserErrors[0].message);
            }

            setStatus('success');
            setMessage('Thanks for subscribing!');
            setEmail('');
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            setStatus('error');
            setMessage(error.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <h3>AWARE</h3>
                    <p>Elevated essentials for the modern individual. Designed for comfort, engineered for style, and crafted with conscience.</p>
                    <div className={styles.socialLinks}>
                        <a href="#" className={styles.socialIcon} aria-label="Instagram">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                        <a href="#" className={styles.socialIcon} aria-label="Twitter">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                        </a>
                        <a href="#" className={styles.socialIcon} aria-label="Facebook">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                        </a>
                    </div>
                </div>

                <div className={styles.column}>
                    <h4>Shop</h4>
                    <ul>
                        <li><Link href="/collections/new-arrivals">New Arrivals</Link></li>
                        <li><Link href="/collections/bestsellers">Bestsellers</Link></li>
                        <li><Link href="/collections/men">Men</Link></li>
                        <li><Link href="/collections/women">Women</Link></li>
                        <li><Link href="/collections/accessories">Accessories</Link></li>
                    </ul>
                </div>

                <div className={styles.column}>
                    <h4>Support</h4>
                    <ul>
                        <li><Link href="/pages/faq">FAQ</Link></li>
                        <li><Link href="/pages/shipping">Shipping & Returns</Link></li>
                        <li><Link href="/pages/size-guide">Size Guide</Link></li>
                        <li><Link href="/pages/contact">Contact Us</Link></li>
                        <li><Link href="/pages/track-order">Track Order</Link></li>
                    </ul>
                </div>

                <div className={styles.column}>
                    <h4>Newsletter</h4>
                    <div className={styles.newsletter}>
                        <p>Subscribe to receive updates, access to exclusive deals, and more.</p>
                        <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className={styles.input}
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={status === 'loading' || status === 'success'}
                            />
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={status === 'loading' || status === 'success'}
                            >
                                {status === 'loading' ? '...' : status === 'success' ? 'Joined' : 'Join'}
                            </button>
                        </form>
                        {message && <p className={styles.message} style={{ color: status === 'error' ? 'red' : 'green', fontSize: '0.8rem', marginTop: '0.5rem' }}>{message}</p>}
                    </div>
                </div>
            </div>

            <div className={styles.bottomBar}>
                <div className={styles.copyright}>
                    © {currentYear} Aware Clothing. All rights reserved.
                </div>
                <div className={styles.legalLinks}>
                    <Link href="/policies/privacy-policy">Privacy Policy</Link>
                    <Link href="/policies/terms-of-service">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
