'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { client, customerQuery, customerAddressUpdateMutation } from '@/lib/shopify';
import { useAuth } from '@/components/auth/auth-context';
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
            if (token === 'demo-token') {
                // Mock data for demo
                setCustomer({
                    firstName: 'Demo',
                    lastName: 'User',
                    email: 'demo@example.com',
                    orders: { edges: [] },
                    defaultAddress: {
                        address1: '123 Fashion St',
                        city: 'New York',
                        province: 'NY',
                        zip: '10001',
                        country: 'USA'
                    }
                });
                setLoading(false);
                return;
            }

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

    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [addressForm, setAddressForm] = useState({
        address1: '',
        city: '',
        province: '',
        zip: '',
        country: ''
    });

    useEffect(() => {
        if (customer?.defaultAddress) {
            setAddressForm({
                address1: customer.defaultAddress.address1 || '',
                city: customer.defaultAddress.city || '',
                province: customer.defaultAddress.province || '',
                zip: customer.defaultAddress.zip || '',
                country: customer.defaultAddress.country || ''
            });
        }
    }, [customer]);

    const handleEditClick = () => {
        setIsEditingAddress(true);
    };

    const handleCancelEdit = () => {
        setIsEditingAddress(false);
        // Reset form to current customer address
        if (customer?.defaultAddress) {
            setAddressForm({
                address1: customer.defaultAddress.address1 || '',
                city: customer.defaultAddress.city || '',
                province: customer.defaultAddress.province || '',
                zip: customer.defaultAddress.zip || '',
                country: customer.defaultAddress.country || ''
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddressForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('shopifyCustomerAccessToken');

        if (token === 'demo-token') {
            // Mock update for demo
            setCustomer(prev => ({
                ...prev,
                defaultAddress: {
                    ...prev.defaultAddress,
                    ...addressForm
                }
            }));
            setIsEditingAddress(false);
            return;
        }

        if (!customer?.defaultAddress?.id) {
            console.error("No address ID found to update");
            return;
        }

        try {
            const { data } = await client.request(customerAddressUpdateMutation, {
                variables: {
                    customerAccessToken: token,
                    id: customer.defaultAddress.id,
                    address: addressForm
                }
            });

            if (data?.customerAddressUpdate?.customerUserErrors?.length > 0) {
                console.error(data.customerAddressUpdate.customerUserErrors);
                alert('Failed to update address: ' + data.customerAddressUpdate.customerUserErrors[0].message);
            } else {
                // Success - update local state
                setCustomer(prev => ({
                    ...prev,
                    defaultAddress: {
                        ...prev.defaultAddress,
                        ...addressForm
                    }
                }));
                setIsEditingAddress(false);
            }
        } catch (err) {
            console.error('Error updating address:', err);
            alert('An error occurred while updating the address.');
        }
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Account Details</h2>
                        {!isEditingAddress && (
                            <button onClick={handleEditClick} className={styles.editButton}>
                                Edit Address
                            </button>
                        )}
                    </div>

                    <div className={styles.card}>
                        <div className={styles.addressDetails}>
                            <p><strong>{customer.firstName} {customer.lastName}</strong></p>
                            <p>{customer.email}</p>

                            {isEditingAddress ? (
                                <form onSubmit={handleSaveAddress} className={styles.addressForm}>
                                    <div className={styles.formGroup}>
                                        <label>Address</label>
                                        <input
                                            type="text"
                                            name="address1"
                                            value={addressForm.address1}
                                            onChange={handleInputChange}
                                            className={styles.formInput}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={addressForm.city}
                                            onChange={handleInputChange}
                                            className={styles.formInput}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div className={styles.formGroup} style={{ flex: 1 }}>
                                            <label>State/Province</label>
                                            <input
                                                type="text"
                                                name="province"
                                                value={addressForm.province}
                                                onChange={handleInputChange}
                                                className={styles.formInput}
                                            />
                                        </div>
                                        <div className={styles.formGroup} style={{ flex: 1 }}>
                                            <label>Zip/Postal Code</label>
                                            <input
                                                type="text"
                                                name="zip"
                                                value={addressForm.zip}
                                                onChange={handleInputChange}
                                                className={styles.formInput}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={addressForm.country}
                                            onChange={handleInputChange}
                                            className={styles.formInput}
                                        />
                                    </div>
                                    <div className={styles.formActions}>
                                        <button type="submit" className={styles.saveButton}>Save</button>
                                        <button type="button" onClick={handleCancelEdit} className={styles.cancelButton}>Cancel</button>
                                    </div>
                                </form>
                            ) : (
                                customer.defaultAddress ? (
                                    <>
                                        <br />
                                        <p>{customer.defaultAddress.address1}</p>
                                        <p>{customer.defaultAddress.city}, {customer.defaultAddress.province} {customer.defaultAddress.zip}</p>
                                        <p>{customer.defaultAddress.country}</p>
                                    </>
                                ) : (
                                    <p className={styles.emptyState}>No default address set.</p>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
