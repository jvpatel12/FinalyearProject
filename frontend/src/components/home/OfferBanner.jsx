import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/Button';

const OfferBanner = ({ title, subtitle, discount, image, bgColor, reverse }) => {
    const navigate = useNavigate();

    return (
        <div className={`relative overflow-hidden rounded-3xl ${bgColor} p-8 md:p-12 mb-16`}>
            <div className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${reverse ? 'md:flex-row-reverse' : ''}`}>

                {/* Content Side */}
                <div className="flex-1 text-center md:text-left z-10">
                    {discount && (
                        <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-bold mb-4">
                            {discount}
                        </span>
                    )}
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                        {title}
                    </h2>
                    <p className="text-white/90 text-lg mb-8 max-w-xl">
                        {subtitle}
                    </p>
                    <div className="flex gap-4 justify-center md:justify-start">
                        <Button
                            variant="primary" // Assuming you have a 'white' variant or similar in your Button component, otherwise fallback to primary/custom class
                            className="bg-black text-white-900 border-transparent hover:bg-black"
                            onClick={() => navigate('/deals')}
                        >
                            Shop Deals
                        </Button>
                        {/* Countdown or other element can go here */}
                    </div>
                </div>

                {/* Image Side */}
                <div className="flex-1 w-full max-w-md md:max-w-none">
                    <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
            </div>
        </div>
    );
};

export default OfferBanner;
