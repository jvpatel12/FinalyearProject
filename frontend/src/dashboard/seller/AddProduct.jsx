import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../auth/useAuth';
import { PRODUCT_CATEGORIES } from '../../utils/constants';

/**
 * Seller Add/Edit Product Page Component
 * Add new products or edit existing ones
 */
const AddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: PRODUCT_CATEGORIES[0] || 'Electronics',
    brand: '',
    stock: '',
    image: '',
    originalPrice: '',
    discount: ''
  });
  const [existingImages, setExistingImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const product = await apiService.products.getById(id);
      if (product) {
        // Ensure seller owns this product
        if (product.seller?._id !== user?.id && product.seller !== user?.id) {
           // Basic check, might need refine based on user object structure
        }
        setFormData({
          name: product.name,
          description: product.description || '',
          price: product.price,
          category: product.category,
          brand: product.brand || '',
          stock: product.stock_quantity || product.stock,
          originalPrice: product.originalPrice || '',
          discount: product.discount || ''
        });
        
        if (product.images && Array.isArray(product.images)) {
          setExistingImages(product.images);
        } else if (product.image) {
          setExistingImages([product.image]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const selectedFiles = Array.from(files);
      if (selectedFiles.length > 0) {
        const availableSlots = 5 - existingImages.length;
        const filesToAdd = selectedFiles.slice(0, availableSlots);
        
        const newFiles = [...imageFiles, ...filesToAdd].slice(0, 5 - existingImages.length);
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

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
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
      form.append('stock_quantity', parseInt(formData.stock));
      form.append('originalPrice', parsedOriginalPrice);
      form.append('discount', parsedDiscount);
      form.append('sellerId', user?.id);
      form.append('status', parseInt(formData.stock) > 0 ? 'active' : 'out_of_stock');

      // Add existing images
      existingImages.forEach(img => {
        form.append('images', img);
      });

      // Add new files
      imageFiles.forEach(file => {
        form.append('images', file);
      });

      if (id) {
        await apiService.products.update(id, form);
        alert('Product updated successfully!');
      } else {
        await apiService.products.create(form);
        alert('Product added successfully!');
      }

      navigate('/seller/products');
    } catch (error) {
      console.error("Failed to save product:", error.response?.data || error.message || error);
      const backendMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Please try again.';
      alert(`Failed to save product: ${backendMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{id ? 'Edit Product' : 'Add New Product'}</h2>
        <p className="text-gray-600">{id ? 'Update your product listing' : 'Create a new product listing'}</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {PRODUCT_CATEGORIES.map((category) => (
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                {/* Existing Images */}
                {existingImages.map((img, index) => (
                  <div key={`existing-${index}`} className="relative h-32 w-32 border border-gray-200 rounded-lg overflow-hidden group">
                    <img src={img} alt={`Existing ${index}`} className="h-full w-full object-contain" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-emerald-600 text-white text-[10px] py-0.5 text-center">Existing</div>
                  </div>
                ))}
                
                {/* New Image Previews */}
                {imagePreviews.map((preview, index) => (
                  <div key={`new-${index}`} className="relative h-32 w-32 border border-gray-200 rounded-lg overflow-hidden group">
                    <img src={preview} alt={`New ${index}`} className="h-full w-full object-contain" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-[10px] py-0.5 text-center">New</div>
                  </div>
                ))}
                
                {(existingImages.length + imagePreviews.length) < 5 && (
                  <label className="flex-shrink-0 h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                    <Save className="w-6 h-6 text-emerald-400 mb-1" />
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
              </div>
              <p className="text-xs text-gray-500 italic">
                Total: {existingImages.length + imageFiles.length} images. You can have up to 5 images per product.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-4 border-t pt-4">
            <button
              type="button"
              onClick={() => navigate('/seller/products')}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {id ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;