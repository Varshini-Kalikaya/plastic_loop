import React from 'react';
import { RefreshCw } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = false, message = 'Loading PlasticLoop...' }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <RefreshCw className="w-7 h-7 text-emerald-400 absolute animate-pulse" />
        </div>
        <p className="mt-4 text-sm font-medium text-emerald-400 tracking-wide">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-10 h-10 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      <p className="mt-3 text-xs text-slate-400 font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
