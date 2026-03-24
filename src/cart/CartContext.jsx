import React, { useReducer, useMemo, useEffect, useContext, createContext } from 'react';
import { initialState, cartReducer } from './cartReducer';
import { AuthContext } from '../auth/AuthContext';

// Create the Cart Context
export const CartContext = createContext();

/**
 * Cart Provider Component
 * Provides cart state and actions to the component tree
 */
export function CartProvider({ children }) {
  const { user, loading } = useContext(AuthContext);

  // Load initial state from localStorage
  const getInitialState = () => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? { items: JSON.parse(savedCart) } : initialState;
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return initialState;
    }
  };

  const [state, dispatch] = useReducer(cartReducer, getInitialState());

  // Save to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(state.items));
      // Dispatch custom event to notify other components (like navbar)
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state.items]);

  // Clear cart if user logs out
  useEffect(() => {
    if (!loading && !user) {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [user, loading]);

  // Calculate derived values
  const totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Standardized logic: Tax 10%, Shipping ₹100, Free shipping over ₹1000
  const tax = subtotal * 0.10;
  const shipping = subtotal > 1000 ? 0 : (subtotal > 0 ? 100 : 0);
  const grandTotal = subtotal + tax + shipping;

  // Action creators
  const addToCart = (item) => {
    if (!user) {
      alert("Please login to add items to cart.");
      window.location.href = '/login';
      return;
    }
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const increaseQty = (id) => {
    dispatch({ type: 'INCREASE_QTY', payload: { id } });
  };

  const decreaseQty = (id) => {
    dispatch({ type: 'DECREASE_QTY', payload: { id } });
  };

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Memoize context value
  const contextValue = useMemo(() => ({
    items: state.items,
    totalQuantity,
    subtotal,
    tax,
    shipping,
    grandTotal,
    addToCart,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
  }), [state.items, totalQuantity, subtotal, tax, shipping, grandTotal, user]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * App wrapper component that provides cart context to the entire application
 */
export const CartContextProvider = ({ children }) => {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartContextProvider');
  }
  return context;
};

export default CartProvider;
