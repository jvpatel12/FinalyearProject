import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from './home/Hero';
import ProductCard from './ProductCard';
import CategoryCard from './home/CategoryCard';
import OfferBanner from './home/OfferBanner';
import Button from '../common/Button';
import storageService from '../services/storageService';
import { useCart } from '../cart/CartContext';
import { Truck, ShieldCheck, Clock, RefreshCw } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products] = React.useState(() => storageService.getProducts() || []);

  // Mock Categories with images (replace with real data/images later)
  const categories = [
    {
      id: 1,
      name: "Smartphones",
      slug: "smartphones",
      count: 120,
      image: "https://images.unsplash.com/photo-1592286927505-1def25115558?w=500&q=80"
    },
    {
      id: 2,
      name: "Laptops",
      slug: "laptops",
      count: 85,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80"
    },
    {
      id: 3,
      name: "Headphones",
      slug: "headphones",
      count: 45,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
    },
    {
      id: 4,
      name: "Accessories",
      slug: "accessories",
      count: 200,
      image: "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=500&q=80"
    }
  ];

  // Product Sections
  const featuredProducts = products.slice(0, 4);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const newArrivals = products
    .filter(p => new Date(p.createdAt || Date.now()) > oneWeekAgo)
    .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-white">
      <Hero />

      {/* Categories Section - Engineered Excellence */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="mb-12 space-y-2 relative z-10 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Engineered Excellence</h2>
          <p className="text-slate-400 text-lg">Find your next perfect device.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Featured Products - The Next Frontier */}
      <section className="bg-slate-900/50 py-32 border-y border-slate-800/50 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none transform -translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 space-y-4 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Featured Products</h2>
            <p className="text-slate-400 text-lg font-light leading-relaxed">
              Discover the latest breakthroughs in high-end consumer technology, designed for creators, thinkers, and explorers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onAddToCart={addToCart}
              />
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-sm font-semibold border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800/50 text-white rounded-full transition-all group"
              onClick={() => navigate('/shop')}
            >
              Shop All Products <span className="inline-block ml-2 transition-transform group-hover:translate-x-1 text-cyan-500">→</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Ecosystem Banner Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="relative rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.15)] group h-[400px]">
          {/* Background Tech Image */}
          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80"
            alt="Circuit Board"
            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 opacity-60 mix-blend-luminosity"
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-cyan-900/40 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=')] opacity-50"></div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center p-8 md:p-16">
            <div className="max-w-xl space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Beyond Hardware. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400">It's an Ecosystem.</span>
              </h2>
              <p className="text-lg text-slate-300 font-light leading-relaxed">
                Sync all your devices seamlessly. Term-X1 is designed for absolute integration between phone, laptop, and native accessories.
              </p>
              <br />
              <Button
                variant="primary"
                className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold rounded-lg border-none shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                onClick={() => navigate('/about')}
              >
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Enhanced Dark Glass */}
      <section className="py-24 bg-slate-900 border-t border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Fast Delivery", text: "Safe & reliable delivery" },
              { icon: ShieldCheck, title: "Secure Payments", text: "Safe payment processing" },
              { icon: RefreshCw, title: "Easy Returns", text: "30-Day money back guarantee" },
              { icon: Clock, title: "24/7 Customer Support", text: "Help whenever you need it" }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center p-8 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/80 hover:border-cyan-500/30 transition-all duration-300 group backdrop-blur-sm shadow-xl">
                <div className="w-16 h-16 mb-6 bg-slate-900 rounded-2xl flex items-center justify-center text-cyan-500 border border-slate-700 group-hover:scale-110 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-300">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 tracking-wide group-hover:text-cyan-400 transition-colors">{item.title}</h3>
                <p className="text-slate-400 font-light text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
