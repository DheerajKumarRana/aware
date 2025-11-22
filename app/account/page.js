'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { client, customerQuery } from '@/lib/shopify';
import styles from './page.module.css';

export default function Account() {
    const router = useRouter();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('shopifyCustomerAccessToken');

        if (!token) {
            router.push('/login');
            return;
        }

        async function fetchCustomer() {
            try {
                const { data } = await client.request(customerQuery, {
                    variables: { customerAccessToken: token }
                });

                if (data?.customer) {
                    setCustomer(data.customer);
                } else {
                    // Token might be invalid/expired
                    localStorage.removeItem('shopifyCustomerAccessToken');
                    router.push('/login');
                }
            } catch (err) {
                console.error(err);
                // Handle error (maybe redirect to login if auth fails)
            } finally {
                setLoading(false);
            }
        }

        fetchCustomer();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('shopifyCustomerAccessToken');
        router.push('/login');
    };

    if (loading) {
        return <div className={styles.container}>Loading...</div>;
    }

    if (!customer) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>My Account</h1>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    Sign Out
                </button>
            </div>

            <div className={styles.grid}>
                <div className={styles.ordersSection}>
                    <h2 className={styles.sectionTitle}>Order History</h2>
                    <div className={styles.orderList}>
                        {customer.orders.edges.length === 0 ? (
                            <p className={styles.emptyState}>You haven't placed any orders yet.</p>
                        ) : (
                            customer.orders.edges.map(({ node: order }) => (
                                <div key={order.id} className={styles.orderItem}>
                                    <div className={styles.orderHeader}>
                                        <span>Order #{order.orderNumber}</span>
                                        <span>{order.totalPrice.amount} {order.totalPrice.currencyCode}</span>
                                    </div>
                                    <div className={styles.orderMeta}>
                                        <span>{new Date(order.processedAt).toLocaleDateString()}</span>
                                        <span>{order.fulfillmentStatus}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className={styles.detailsSection}>
                    <h2 className={styles.sectionTitle}>Account Details</h2>
                    <div className={styles.card}>
                        <div className={styles.addressDetails}>
                            <p><strong>{customer.firstName} {customer.lastName}</strong></p>
                            <p>{customer.email}</p>
                            {customer.defaultAddress ? (
                                <>
                                    <br />
                                    <p>{customer.defaultAddress.address1}</p>
                                    <p>{customer.defaultAddress.city}, {customer.defaultAddress.province} {customer.defaultAddress.zip}</p>
                                    <p>{customer.defaultAddress.country}</p>
                                </>
                            ) : (
                                <p className={styles.emptyState}>No default address set.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
