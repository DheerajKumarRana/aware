'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-context';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([]);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('wishlist');
        if (saved) {
            setWishlist(JSON.parse(saved));
        }
    }, []);

    // Save to localStorage whenever wishlist changes
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const { isLoggedIn } = useAuth();

    // Clear wishlist on logout
    useEffect(() => {
        if (!isLoggedIn) {
            setWishlist([]);
            localStorage.removeItem('wishlist');
        }
    }, [isLoggedIn]);

    const addToWishlist = (product) => {
        if (!wishlist.some(item => item.id === product.id)) {
            setWishlist([...wishlist, product]);
        }
    };

    const removeFromWishlist = (productId) => {
        setWishlist(wishlist.filter(item => item.id !== productId));
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    const toggleWishlist = (product) => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}
