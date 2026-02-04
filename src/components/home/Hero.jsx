import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/Button';
import image from '../../../image/iphone.jpg';
const Hero = ({ image }) => {
    const navigate = useNavigate();

    return (
        <div className="relative bg-gray-900 text-white overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={image}
                    alt="Shopping"
                    className="w-full h-full object-cover opacity-40"
                />
            </div>

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-48">
                <div className="max-w-xl">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Discover the Best <br />
                        <span className="text-blue-400">Tech & Gadgets</span>
                    </h1>
                    <p className="text-lg text-gray-300 mb-8">
                        Shop the latest electronics, accessories, and more.
                        Experience premium quality and fast shipping.
                    </p>
                    <div className="flex gap-4">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => navigate('/shop')}
                        >
                            Shop Now
                        </Button>
                        <Button
                            variant="outline-white"
                            size="lg"
                            onClick={() => navigate('/new')}
                        >
                            New Arrivals
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
