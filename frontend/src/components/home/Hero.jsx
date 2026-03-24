import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/Button';

const Hero = ({ image }) => {
    const navigate = useNavigate();

    return (
        <div className="relative bg-background text-white overflow-hidden min-h-[700px] flex items-center pt-20">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                {/* Hero Glow */}
                <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            </div>

            {/* Content gap-12 -> gap-4 for closer image grouping, using explicit padding */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-12 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
                    {/* Text Column - takes up 3 cols */}
                    <div className="lg:col-span-3 text-center lg:text-left space-y-6 animate-fade-in-up">
                        <div className="inline-block px-4 py-1.5 bg-slate-800/80 border border-slate-700 rounded-full">
                            <span className="text-cyan-400 font-bold tracking-widest uppercase text-xs">
                                New Arrival | Term-X1
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white mb-2">
                            Evolution of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-400 text-glow">
                                Precision.
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                            Redefining portable power with 3D-engineered
                            architecture and liquid-cooled processors.
                            Experience the future of personal computing.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                            <Button
                                variant="primary"
                                size="lg"
                                className="px-8 py-4 text-base font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all border-none"
                                onClick={() => navigate('/shop')}
                            >
                                Pre-order Now <span className="ml-2">→</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="px-8 py-4 text-base font-semibold border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800/50 text-white rounded-lg transition-all"
                                onClick={() => navigate('/shop?sort=new')}
                            >
                                Watch the Keynote
                            </Button>
                        </div>
                    </div>

                    {/* Hero Visuals - takes up 2 cols */}
                    <div className="lg:col-span-2 relative hidden md:block w-full h-[500px]">
                        {/* Floating elements container */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {/* Background generic dark square */}
                            <div className="absolute right-0 top-10 w-64 h-64 bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl transform rotate-12 animate-float opacity-80 z-0 backdrop-blur-sm shadow-cyan-900/20"></div>

                            {/* Device image 1 */}
                            <img
                                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80"
                                alt="Laptop"
                                className="absolute left-0 bottom-20 w-72 rounded-xl shadow-2xl transform -rotate-12 animate-float-delayed z-10 border border-white/10"
                                style={{
                                    clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)'
                                }}
                            />

                            {/* Device image 2 */}
                            <img
                                src="https://images.unsplash.com/photo-1592286927505-1def25115558?w=300&q=80"
                                alt="Phone"
                                className="absolute right-10 top-20 w-48 rounded-[2rem] shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-slate-700 transform rotate-6 animate-float z-20"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
