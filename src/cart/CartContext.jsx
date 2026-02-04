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
  const { user } = useContext(AuthContext);

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

  // Calculate derived values
  const totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Action creators
  const addToCart = (item) => {
    if (!user) {
      alert("Please login to add items to cart.");
      // Ideally we would redirect here, but we are outside the router context usually.
      // Or we could return false to the caller.
      // For now, simple alert is sufficient as per "Strict Auth" request.
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

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    items: state.items,
    totalQuantity,
    totalPrice,
    addToCart,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
  }), [state.items, totalQuantity, totalPrice, user]); // Added user dependency

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
