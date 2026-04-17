import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    if (pathnames.length === 0) return null;

    return (
        <nav className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
            <Link to="/" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                <Home size={14} />
                <span>Home</span>
            </Link>

            {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;

                return (
                    <React.Fragment key={name}>
                        <ChevronRight size={14} className="text-slate-700 flex-shrink-0" />
                        {isLast ? (
                            <span className="text-white font-bold">{decodeURIComponent(name).replace(/-/g, ' ')}</span>
                        ) : (
                            <Link to={routeTo} className="hover:text-cyan-400 transition-colors">
                                {decodeURIComponent(name).replace(/-/g, ' ')}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumbs;
