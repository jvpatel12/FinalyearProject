import React from 'react';
import { Package, Truck, CheckCircle, Clock, ShieldCheck } from 'lucide-react';

const OrderStatusTracker = ({ status }) => {
    const steps = [
        { id: 'Processing', icon: Clock, label: 'Initializing' },
        { id: 'Ordered', icon: Package, label: 'Unit Locked' },
        { id: 'Shipped', icon: Truck, label: 'In Transit' },
        { id: 'Delivered', icon: CheckCircle, label: 'Deployed' },
    ];

    const currentStepIndex = steps.findIndex(step => 
        step.id.toLowerCase() === status?.toLowerCase()
    );

    return (
        <div className="w-full py-8">
            <div className="relative flex justify-between">
                {/* Connection Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>
                <div 
                    className="absolute top-1/2 left-0 h-0.5 bg-cyan-500 -translate-y-1/2 z-0 transition-all duration-1000"
                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}% shadow-[0_0_15px_rgba(6,182,212,0.5)]` }}
                ></div>

                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                                isActive 
                                    ? 'bg-slate-900 border-cyan-500 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                                    : 'bg-slate-950 border-slate-800 text-slate-600'
                            }`}>
                                <Icon size={18} className={isCurrent ? 'animate-pulse' : ''} />
                            </div>
                            <span className={`mt-3 text-[10px] font-black uppercase tracking-widest ${
                                isActive ? 'text-cyan-400' : 'text-slate-600'
                            }`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderStatusTracker;
