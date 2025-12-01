'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { client, cartCreateMutation, cartLinesAddMutation, cartLinesRemoveMutation, cartLinesUpdateMutation, cartQuery } from '@/lib/shopify';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Initialize Cart
    useEffect(() => {
        const initializeCart = async () => {
            const localCartId = localStorage.getItem('shopifyCartId');

            if (localCartId) {
                try {
                    const { data } = await client.request(cartQuery, { variables: { cartId: localCartId } });
                    if (data.cart) {
                        setCart(data.cart);
                    } else {
                        // Cart expired or invalid
                        createNewCart();
                    }
                } catch (e) {
                    console.error('Error fetching cart:', e);
                    createNewCart();
                }
            } else {
                createNewCart();
            }
        };

        initializeCart();
    }, []);

    const createNewCart = async () => {
        try {
            const { data } = await client.request(cartCreateMutation);
            setCart(data.cartCreate.cart);
            localStorage.setItem('shopifyCartId', data.cartCreate.cart.id);
        } catch (e) {
            console.error('Error creating cart:', e);
        }
    };

    const addToCart = async (variantId, quantity = 1) => {
        setIsLoading(true);
        setIsCartOpen(true); // Open drawer when adding

        try {
            if (!cart?.id) await createNewCart();

            const { data } = await client.request(cartLinesAddMutation, {
                variables: {
                    cartId: cart.id,
                    lines: [{ merchandiseId: variantId, quantity }]
                }
            });

            setCart(data.cartLinesAdd.cart);
        } catch (e) {
            console.error('Error adding to cart:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromCart = async (lineId) => {
        setIsLoading(true);
        try {
            const { data } = await client.request(cartLinesRemoveMutation, {
                variables: {
                    cartId: cart.id,
                    lineIds: [lineId]
                }
            });
            setCart(data.cartLinesRemove.cart);
        } catch (e) {
            console.error('Error removing from cart:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const updateQuantity = async (lineId, quantity) => {
        setIsLoading(true);
        try {
            const { data } = await client.request(cartLinesUpdateMutation, {
                variables: {
                    cartId: cart.id,
                    lines: [{ id: lineId, quantity }]
                }
            });
            setCart(data.cartLinesUpdate.cart);
        } catch (e) {
            console.error('Error updating cart:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleCart = () => setIsCartOpen(!isCartOpen);

    return (
        <CartContext.Provider value={{
            cart,
            isCartOpen,
            toggleCart,
            addToCart,
            removeFromCart,
            updateQuantity,
            isLoading
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
