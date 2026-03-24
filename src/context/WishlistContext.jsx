import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
    return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState([]);

    // Load wishlist from local storage or API on mount/user change
    useEffect(() => {
        if (user) {
            const storedWishlist = localStorage.getItem(`wishlist_${user.id}`);
            if (storedWishlist) {
                setWishlist(JSON.parse(storedWishlist));
            } else {
                setWishlist([]);
            }
        } else {
            setWishlist([]);
        }
    }, [user]);

    // Save wishlist to local storage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlist));
        }
    }, [wishlist, user]);

    const addToWishlist = (product) => {
        if (!user) {
            alert("Please login to add to wishlist");
            return;
        }
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

    const clearWishlist = () => {
        setWishlist([]);
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            clearWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
