import React from 'react';
import { RefreshCw } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = false, message = 'Loading PlasticLoop...' }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fbfbf9]/90 backdrop-blur-md">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#cfe2d4] border-t-[#1b4332] rounded-full animate-spin"></div>
          <RefreshCw className="w-7 h-7 text-[#1b4332] absolute animate-pulse" />
        </div>
        <p className="mt-4 text-sm font-bold text-[#1b4332] tracking-wide">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-10">
      <div className="w-10 h-10 border-3 border-[#cfe2d4] border-t-[#1b4332] rounded-full animate-spin"></div>
      <p className="mt-3.5 text-xs text-[#526458] font-semibold">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
