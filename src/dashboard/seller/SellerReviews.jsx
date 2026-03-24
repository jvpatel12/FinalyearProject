import React, { useState } from 'react';
import { Star, MessageCircle, Reply } from 'lucide-react';

const SellerReviews = () => {
    // Mock reviews data
    const [reviews, setReviews] = useState([
        { id: 1, customer: 'Jeel Patel', rating: 5, date: '2024-02-10', comment: 'Great product, fast shipping!', product: 'Wireless Earbuds', reply: '' },
        { id: 2, customer: 'Patel', rating: 3, date: '2024-02-08', comment: 'Average quality, expected better.', product: 'Smart Watch', reply: '' },
        { id: 3, customer: 'Amit', rating: 4, date: '2024-02-05', comment: 'Good value for money.', product: 'Laptop Stand', reply: 'Thank you for your feedback!' },
    ]);

    const [replyText, setReplyText] = useState('');
    const [activeReplyId, setActiveReplyId] = useState(null);

    const handleReplySubmit = (id) => {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, reply: replyText } : r));
        setReplyText('');
        setActiveReplyId(null);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-purple-600" />
                Customer Reviews
            </h1>

            <div className="grid gap-6">
                {reviews.map(review => (
                    <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-semibold text-gray-900">{review.product}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300"} />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500">by {review.customer} on {review.date}</span>
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
