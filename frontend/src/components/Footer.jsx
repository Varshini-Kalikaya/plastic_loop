import React from 'react';
import { RefreshCw, Leaf } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#f7f9f6] border-t border-[#e2e8df] py-8 px-6 text-xs text-[#627367]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#1b4332] flex items-center justify-center text-white">
            <RefreshCw className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-[#14231b]">PlasticLoop — Circular Plastic Waste Ecosystem</span>
        </div>
        <p className="flex items-center gap-1.5 text-center">
          <Leaf className="w-3.5 h-3.5 text-[#2d6a4f]" />
          <span>Technology helping communities create a cleaner circular economy</span>
        </p>
        <p>© 2026 PlasticLoop. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
