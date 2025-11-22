'use client';

import { useCart } from './cart-context';
import styles from './CartDrawer.module.css';
import Link from 'next/link';

export default function CartDrawer() {
    const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity } = useCart();

    if (!cart) return null;

    const totalQuantity = cart.lines.edges.reduce((sum, { node }) => sum + node.quantity, 0);

    return (
        <>
            <div
                className={`${styles.overlay} ${isCartOpen ? styles.open : ''}`}
                onClick={toggleCart}
            />
            <div className={`${styles.drawer} ${isCartOpen ? styles.open : ''}`}>
                <div className={styles.header}>
                    <h2>Shopping Cart ({totalQuantity})</h2>
                    <button className={styles.closeBtn} onClick={toggleCart}>&times;</button>
                </div>

                <div className={styles.items}>
                    {cart.lines.edges.length === 0 ? (
                        <div className={styles.emptyCart}>
                            <p>Your cart is empty.</p>
                            <Link href="/collections/all" onClick={toggleCart} style={{ textDecoration: 'underline', marginTop: '1rem', display: 'block' }}>
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        cart.lines.edges.map(({ node: line }) => (
                            <div key={line.id} className={styles.item}>
                                <img
                                    src={line.merchandise.product.featuredImage?.url || 'https://via.placeholder.com/100'}
                                    alt={line.merchandise.product.title}
                                    className={styles.itemImage}
                                />
                                <div className={styles.itemDetails}>
                                    <div>
                                        <h3 className={styles.itemTitle}>{line.merchandise.product.title}</h3>
                                        <p className={styles.itemVariant}>
                                            {line.merchandise.title !== 'Default Title' ? line.merchandise.title : ''}
                                        </p>
                                        <p className={styles.itemPrice}>
                                            {line.cost.totalAmount.amount} {line.cost.totalAmount.currencyCode}
                                        </p>
                                    </div>
                                    <div className={styles.itemControls}>
                                        <div className={styles.quantityControls}>
                                            <button
                                                className={styles.qtyBtn}
                                                onClick={() => updateQuantity(line.id, line.quantity - 1)}
                                                disabled={line.quantity <= 1}
                                            >-</button>
                                            <span className={styles.quantity}>{line.quantity}</span>
                                            <button
                                                className={styles.qtyBtn}
                                                onClick={() => updateQuantity(line.id, line.quantity + 1)}
                                            >+</button>
                                        </div>
                                        <button
                                            className={styles.removeBtn}
                                            onClick={() => removeFromCart(line.id)}
                                        >Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.lines.edges.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.total}>
                            <span>Subtotal</span>
                            <span>{cart.cost.subtotalAmount.amount} {cart.cost.subtotalAmount.currencyCode}</span>
                        </div>
                        <a href={cart.checkoutUrl} className={styles.checkoutBtn}>
                            Proceed to Checkout
                        </a>
                    </div>
                )}
            </div>
        </>
    );
}
