import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const ComparisonContext = createContext();

export const ComparisonProvider = ({ children }) => {
  const [comparisonItems, setComparisonItems] = useState(() => {
    const saved = localStorage.getItem('comparison_units');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('comparison_units', JSON.stringify(comparisonItems));
  }, [comparisonItems]);

  const addToComparison = (product) => {
    const productId = product._id || product.id;
    if (comparisonItems.find(item => (item._id || item.id) === productId)) {
      setComparisonItems(prev => prev.filter(item => (item._id || item.id) !== productId));
      toast.success('Unit de-linked from comparison');
      return;
    }
    
    if (comparisonItems.length >= 4) {
      toast.error('Maximum neural link capacity (4 units)');
      return;
    }

    setComparisonItems(prev => [...prev, product]);
    toast.success('Unit linked to comparison chamber');
  };

  const removeFromComparison = (productId) => {
    setComparisonItems(prev => prev.filter(item => (item._id || item.id) !== productId));
  };

  const clearComparison = () => {
    setComparisonItems([]);
  };

  return (
    <ComparisonContext.Provider value={{ 
      comparisonItems, 
      addToComparison, 
      removeFromComparison, 
      clearComparison,
      isInComparison: (id) => !!comparisonItems.find(item => (item._id || item.id) === id)
    }}>
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => useContext(ComparisonContext);
