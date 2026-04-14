import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../auth/useAuth';

import { PRODUCT_CATEGORIES } from '../../utils/constants';

/**
 * Admin Add Product Page Component
 * Add new products in the admin dashboard
 */
const AdminAddProduct = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: PRODUCT_CATEGORIES[0],
    brand: '',
    stock: '',
    image: '',
    originalPrice: '',
    discount: ''
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const selectedFiles = Array.from(files);
      if (selectedFiles.length > 0) {
        // Limit to 5 images total
        const newFiles = [...imageFiles, ...selectedFiles].slice(0, 5);
        setImageFiles(newFiles);
        
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(newPreviews);
      }
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const parsedPrice = parseFloat(formData.price) || 0;
      let parsedOriginalPrice = formData.originalPrice ? parseFloat(formData.originalPrice) : parsedPrice;
      let parsedDiscount = formData.discount ? parseInt(formData.discount) : 0;

      if (parsedDiscount > 0 && parsedOriginalPrice === parsedPrice) {
        parsedOriginalPrice = Math.round(parsedPrice / (1 - parsedDiscount / 100));
      } else if (parsedOriginalPrice > parsedPrice && parsedDiscount === 0) {
        parsedDiscount = Math.round(((parsedOriginalPrice - parsedPrice) / parsedOriginalPrice) * 100);
      }

      const form = new FormData();
      form.append('name', formData.name);
      form.append('description', formData.description);
      form.append('price', parsedPrice);
      form.append('category', formData.category);
      form.append('brand', formData.brand);
      form.append('stock', parseInt(formData.stock));
      form.append('originalPrice', parsedOriginalPrice);
      form.append('discount', parsedDiscount);
      form.append('sellerId', user?.id || 1);
      form.append('status', parseInt(formData.stock) > 0 ? 'active' : 'out_of_stock');
      form.append('features', JSON.stringify([])); // Placeholder for features

      if (imageFiles.length > 0) {
        imageFiles.forEach(file => {
          form.append('images', file);
        });
      } else if (formData.image) {
        form.append('images', formData.image);
      }

      await apiService.products.create(form);

      alert('Product added successfully!');
      navigate('/admin/products');
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
        <p className="text-gray-600">Create a new product listing</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PRODUCT_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter brand name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Original Price (₹)
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00 (Optional, for deals)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0 (Optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Images * (Up to 5)
            </label>
            <div className="mt-2 space-y-4">
              <div className="flex flex-wrap gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative h-32 w-32 border border-gray-200 rounded-lg overflow-hidden group">
                    <img src={preview} alt={`Preview ${index}`} className="h-full w-full object-contain" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {imagePreviews.length < 5 && (
                  <label className="flex-shrink-0 h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                    <Save className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-gray-400 text-xs text-center px-2">Add Image</span>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      multiple
                      onChange={handleInputChange}
                      className="hidden"
                    />
                  </label>
                )}
                {imagePreviews.length === 0 && !formData.image && (
                  <div className="flex-shrink-0 h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    <span className="text-gray-400 text-xs text-center px-2">No images selected</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 italic">
                {imageFiles.length > 0 
                  ? `${imageFiles.length} images selected.` 
                  : "No files selected. A default placeholder will be used if none provided."}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-4 border-t pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddProduct;