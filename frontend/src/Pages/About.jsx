import React from 'react';
import { Shield, Target, Users, Zap } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Active Users', value: '50K+' },
    { label: 'Products Delivered', value: '1M+' },
    { label: 'Seller Partners', value: '500+' },
    { label: 'Customer Rating', value: '4.8/5' },
  ];

  const values = [
    {
      icon: Zap,
      title: 'Innovation First',
      description: 'We leverage the latest technology to provide a seamless, futuristic shopping experience.',
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Your data and transactions are protected by industry-leading encryption and security protocols.',
    },
    {
      icon: Target,
      title: 'Customer Centric',
      description: 'Our focus is on delivering what you need, when you need it, with absolute precision.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'We empower thousands of sellers to grow their businesses and connect with millions of customers.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative pb-20 pt-32">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Redefining the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Digital Market</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            We are building more than just a marketplace. We are crafting a digital ecosystem where technology meets commerce in a premium, high-performance environment.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-2xl text-center hover:border-cyan-500/30 transition-all group">
              <div className="text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform">{stat.value}</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest font-bold font-mono">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Our Values Section */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 tracking-tight uppercase">Our Core Values</h2>
            <div className="w-20 h-1.5 bg-cyan-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="flex gap-6 p-8 bg-slate-900/30 border border-slate-800 rounded-3xl hover:bg-slate-800/50 transition-all group">
                  <div className="flex-shrink-0 w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <Icon size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">{value.title}</h3>
                    <p className="text-slate-400 leading-relaxed font-light">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold tracking-tight">From a Vision to a <span className="text-cyan-400 font-mono">Platform</span></h2>
            <p className="text-lg text-slate-400 font-light leading-relaxed">
              Founded in 2024, our platform began with a simple observation: the digital marketplace was too noisy, cluttered, and lacked the premium feel that modern technology deserves.
            </p>
            <p className="text-lg text-slate-400 font-light leading-relaxed">
              We decided to strip away the distractions and focus on what truly matters: a high-speed, secure, and aesthetically pleasing experience for both sellers and buyers. Today, we stand as a testament to that vision—serving thousands of satisfied customers every day.
            </p>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 rounded-3xl blur-3xl opacity-50"></div>
             <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-1 overflow-hidden aspect-video flex items-center justify-center">
                 <div className="text-6xl font-black text-slate-800 font-mono opacity-20">EST. 2024</div>
                 <div className="absolute inset-0 border-[20px] border-slate-950/20 pointer-events-none rounded-[20px]"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
