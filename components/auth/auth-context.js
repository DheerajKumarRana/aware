'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check for token on mount
        const token = localStorage.getItem('shopifyCustomerAccessToken');
        if (token) {
            setIsLoggedIn(true);
            // In a real app, you'd fetch user details here
            setUser({ token });
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('shopifyCustomerAccessToken', token);
        setIsLoggedIn(true);
        setUser({ token });
        setIsLoginModalOpen(false);
    };

    const logout = () => {
        localStorage.removeItem('shopifyCustomerAccessToken');
        setIsLoggedIn(false);
        setUser(null);
        router.push('/');
    };

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            user,
            login,
            logout,
            isLoginModalOpen,
            openLoginModal,
            closeLoginModal
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
