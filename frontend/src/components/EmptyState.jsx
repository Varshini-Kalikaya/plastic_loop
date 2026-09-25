import React from 'react';
import { PackageOpen } from 'lucide-react';

const EmptyState = ({
  title = 'No records found',
  description = 'There are no items to display right now.',
  icon: Icon = PackageOpen,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 sm:p-14 text-center bg-white rounded-3xl border border-dashed border-[#d5ded6] my-6 max-w-2xl mx-auto shadow-sm">
      <div className="p-4 rounded-2xl bg-[#f0f6f2] text-[#2d6a4f] border border-[#d6e7db] mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-[#14231b]">{title}</h3>
      <p className="text-xs sm:text-sm text-[#617367] mt-1.5 max-w-md leading-relaxed">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
