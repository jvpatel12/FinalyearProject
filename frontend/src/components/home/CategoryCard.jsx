import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ category }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/shop?category=${category.slug}`)}
            className="group relative h-72 overflow-hidden rounded-2xl cursor-pointer bg-slate-800/50 border border-slate-700/50 shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-500 backdrop-blur-sm flex flex-col pt-4"
        >
            {/* Top Badge Overlay */}
            <div className="absolute top-4 left-4 z-20">
                <span className="text-[10px] uppercase tracking-widest text-cyan-500 font-bold bg-slate-900/80 px-2 py-1 rounded">
                    CATEGORY
                </span>
            </div>

            {/* Content (Top Aligned) */}
            <div className="relative z-10 px-6 pt-8 pb-4">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{category.name}</h3>
            </div>

            {/* Background Image (Lower Half, slight scale on hover) */}
            <div className="absolute inset-0 top-1/3 flex items-center justify-center p-4">
                <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl opacity-90 group-hover:opacity-100"
                />
            </div>

            {/* Dark Gradient Overlay to blend the image bottom */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-900/90 to-transparent pointer-events-none" />

            {/* Hover Action */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 z-20">
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold bg-slate-900/80 px-4 py-2 rounded-full border border-cyan-500/30">
                    <span>Explore</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default CategoryCard;
