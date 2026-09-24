import React from 'react';
import { RefreshCw, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-slate-300">PlasticLoop — Smart Plastic Waste Platform</span>
        </div>
        <p className="flex items-center gap-1">
          Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for B.Tech IT Final Year Project
        </p>
        <p>© 2026 PlasticLoop. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
