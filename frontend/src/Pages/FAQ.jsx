import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, MessageCircleQuestion } from 'lucide-react';

const FAQData = [
  {
    category: 'Ordering',
    questions: [
      {
        q: 'How do I place an order?',
        a: 'Simply browse our shop, add items to your cart, and proceed to checkout. You will need to create an account or sign in to complete your purchase.',
      },
      {
        q: 'Can I cancel my order?',
        a: 'Orders can be cancelled within 1 hour of placement from your dashboard. After that, they enter the processing stage and cannot be cancelled directly.',
      },
      {
        q: "What if an item is 'Price on Demand'?",
        a: "Some premium or custom items show as 'Price on Demand'. For these, click the 'Inquire on WhatsApp' button on the product page to discuss pricing and lead times directly with our team.",
      },
    ],
  },
  {
    category: 'Shipping',
    questions: [
      {
        q: 'How long does shipping take?',
        a: 'Standard shipping takes 3-5 business days. Express shipping is available for select items and takes 1-2 business days.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Currently, we only ship within the domestic region. International shipping is in our roadmap for later this year.',
      },
    ],
  },
  {
    category: 'Payments',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit/debit cards, UPI, and net banking via our secure Razorpay integration.',
      },
      {
        q: 'Is my payment secure?',
        a: 'Absolutely. We use industry-standard encryption and do not store your sensitive payment details on our servers.',
      },
    ],
  },
];

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (category, index) => {
    const key = `${category}-${index}`;
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const filteredData = FAQData.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.a.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((cat) => cat.questions.length > 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-32 pt-32">
       <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[150px] pointer-events-none"></div>
       
       <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
                <MessageCircleQuestion size={16} />
                Help Center
             </div>
             <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Frequently Asked Questions</h1>
             <p className="text-slate-400 text-lg font-light">Find answers to common questions about our platform and services.</p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-16">
             <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500">
                <Search size={22} />
             </div>
             <input 
                type="text" 
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-16 pl-16 pr-8 bg-slate-900/50 border border-slate-800 rounded-3xl outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-lg font-light"
             />
          </div>

          {/* FAQ Accordions */}
          <div className="space-y-12">
             {filteredData.length > 0 ? filteredData.map((cat, catIdx) => (
                <div key={catIdx}>
                   <h2 className="text-xs uppercase tracking-[0.3em] font-black text-cyan-500 mb-6 flex items-center gap-4">
                      {cat.category}
                      <span className="flex-1 h-px bg-slate-800"></span>
                   </h2>
                   <div className="space-y-4">
                      {cat.questions.map((item, qIdx) => {
                         const isOpen = !!openItems[`${cat.category}-${qIdx}`];
                         return (
                            <div 
                               key={qIdx} 
                               className={`bg-slate-900/30 border rounded-2xl transition-all overflow-hidden ${isOpen ? 'border-cyan-500/40 bg-slate-900/60 shadow-[0_0_30px_rgba(6,182,212,0.1)]' : 'border-slate-800/80 hover:border-slate-700'}`}
                            >
                               <button 
                                  onClick={() => toggleItem(cat.category, qIdx)}
                                  className="w-full px-8 py-6 flex items-center justify-between text-left group"
                               >
                                  <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                                     {item.q}
                                  </span>
                                  <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-400' : 'text-slate-600'}`}>
                                     <ChevronDown size={24} />
                                  </span>
                               </button>
                               <div className={`px-8 transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                                  <p className="text-slate-400 font-light leading-relaxed border-t border-slate-800/50 pt-4">
                                     {item.a}
                                  </p>
                               </div>
                            </div>
                         );
                      })}
                   </div>
                </div>
             )) : (
                <div className="text-center py-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
                   <p className="text-slate-500 font-mono italic">[ No matching data found in the records ]</p>
                </div>
             )}
          </div>

          {/* Still have questions? */}
          <div className="mt-24 p-10 bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-800 rounded-[32px] text-center">
             <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
             <p className="text-slate-400 mb-8 font-light">Can't find what you're looking for? Reach out to our support team.</p>
             <button className="px-8 py-4 bg-white text-slate-950 rounded-xl font-bold hover:bg-cyan-400 transition-all hover:scale-105">
                Contact Support
             </button>
          </div>
       </div>
    </div>
  );
};

export default FAQ;
