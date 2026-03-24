import React from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../cart/CartContext'; // Assuming CartContext is in cart folder
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleAddToCart = (product) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            sellerId: product.sellerId
        });
        removeFromWishlist(product.id);
    };

    if (wishlist.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <Heart className="mx-auto h-12 w-12 text-gray-300" />
                    <h2 className="mt-2 text-lg font-medium text-gray-900">Your wishlist is empty</h2>
                    <p className="mt-1 text-sm text-gray-500">Start exploring and save items you love!</p>
                    <div className="mt-6">
                        <Link
                            to="/shop" // Assuming /shop is the products listing page
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist ({wishlist.length})</h1>

                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {wishlist.map((product) => (
                        <div key={product.id} className="group relative bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="aspect-w-1 aspect-h-1 bg-gray-200 group-hover:opacity-75 h-64 overflow-hidden relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-center object-cover"
                                />
                                <button
                                    onClick={() => removeFromWishlist(product.id)}
                                    className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white text-red-500 hover:text-red-600 shadow-sm transition-colors"
                                    title="Remove from Wishlist"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-1 p-4 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        <Link to={`/product/${product.id}`}>
                                            <span aria-hidden="true" className="absolute inset-0" />
                                            {product.name}
                                        </Link>
                                    </h3>
                                    <p className="mt-1 text-xl font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent navigation to product detail
                                            handleAddToCart(product);
                                        }}
                                        className="w-full relative z-10 flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        Move to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;
