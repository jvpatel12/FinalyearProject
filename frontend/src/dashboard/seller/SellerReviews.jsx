import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { apiService } from '../../services/apiService';
import { MessageCircle, Star, Reply } from 'lucide-react';

const SellerReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState('');
    const [activeReplyId, setActiveReplyId] = useState(null);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const data = await apiService.reviews.getSellerReviews();
            setReviews(data);
        } catch (error) {
            toast.error('Failed to fetch reviews');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchReviews();
    }, []);

    const handleReplySubmit = async (id) => {
        try {
            await apiService.reviews.replyToReview(id, replyText);
            toast.success('Reply posted successfully');
            setReplyText('');
            setActiveReplyId(null);
            fetchReviews(); // Refresh
        } catch (error) {
            toast.error('Failed to post reply');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-purple-600" />
                Customer Reviews
            </h1>

            <div className="grid gap-6">
                {loading ? (
                    <div className="text-center py-10">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No reviews found.</div>
                ) : reviews.map(review => (
                    <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    {review.product?.name || 'Deleted Product'}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300"} />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        by {review.name || review.user?.name || 'Anonymous'} on {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-700 mb-4">{review.comment}</p>

                        {review.reply ? (
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 ml-8">
                                <p className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                                    <Reply className="w-4 h-4" />
                                    Your Reply
                                </p>
                                <p className="text-gray-600 text-sm">{review.reply}</p>
                            </div>
                        ) : (
                            <div>
                                {activeReplyId === review.id ? (
                                    <div className="mt-4">
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Write your response..."
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-2"
                                            rows="3"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleReplySubmit(review.id)}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                                            >
                                                Post Reply
                                            </button>
                                            <button
                                                onClick={() => setActiveReplyId(null)}
                                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setActiveReplyId(review.id)}
                                        className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
                                    >
                                        <Reply className="w-4 h-4" />
                                        Reply to Review
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SellerReviews;
