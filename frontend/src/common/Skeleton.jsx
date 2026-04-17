import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const ProductSkeleton = () => {
    return (
        <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50">
            <Skeleton height={200} baseColor="#1e293b" highlightColor="#334155" className="rounded-xl mb-4" />
            <Skeleton width="60%" height={24} baseColor="#1e293b" highlightColor="#334155" className="mb-2" />
            <Skeleton width="40%" height={16} baseColor="#1e293b" highlightColor="#334155" className="mb-4" />
            <div className="flex justify-between items-center">
                <Skeleton width={80} height={32} baseColor="#1e293b" highlightColor="#334155" />
                <Skeleton width={100} height={40} baseColor="#1e293b" highlightColor="#334155" className="rounded-xl" />
            </div>
        </div>
    );
};

export const DetailSkeleton = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 py-10">
            <Skeleton height={500} baseColor="#1e293b" highlightColor="#334155" className="rounded-3xl" />
            <div className="space-y-6">
                <Skeleton width="30%" height={20} baseColor="#1e293b" highlightColor="#334155" />
                <Skeleton width="90%" height={60} baseColor="#1e293b" highlightColor="#334155" />
                <Skeleton width="40%" height={30} baseColor="#1e293b" highlightColor="#334155" />
                <Skeleton width="100%" height={100} baseColor="#1e293b" highlightColor="#334155" />
                <div className="flex gap-4">
                    <Skeleton width={150} height={56} baseColor="#1e293b" highlightColor="#334155" className="rounded-xl" />
                    <Skeleton width={200} height={56} baseColor="#1e293b" highlightColor="#334155" className="rounded-xl" />
                </div>
            </div>
        </div>
    );
};

export const OrderSkeleton = () => {
    return (
        <div className="bg-slate-800/40 rounded-3xl p-6 border border-slate-700/50 mb-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4 items-center">
                    <Skeleton circle width={48} height={48} baseColor="#1e293b" highlightColor="#334155" />
                    <div className="space-y-2">
                        <Skeleton width={120} height={20} baseColor="#1e293b" highlightColor="#334155" />
                        <Skeleton width={80} height={14} baseColor="#1e293b" highlightColor="#334155" />
                    </div>
                </div>
                <div className="text-right space-y-2">
                    <Skeleton width={100} height={28} baseColor="#1e293b" highlightColor="#334155" />
                    <Skeleton width={60} height={16} baseColor="#1e293b" highlightColor="#334155" />
                </div>
            </div>
            <Skeleton width="100%" height={2} baseColor="#1e293b" highlightColor="#334155" className="mb-6" />
            <div className="flex justify-between items-center">
                <Skeleton width={140} height={20} baseColor="#1e293b" highlightColor="#334155" />
                <Skeleton width={100} height={36} baseColor="#1e293b" highlightColor="#334155" className="rounded-xl" />
            </div>
        </div>
    );
};
