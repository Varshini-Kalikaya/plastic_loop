import React from 'react';
import { PackageOpen } from 'lucide-react';

const EmptyState = ({ title = 'No records found', description = 'There are no items to display right now.', icon: Icon = PackageOpen, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center glass-card rounded-2xl border border-slate-800/80 my-4">
      <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-white">{title}</h3>
      <p className="text-xs text-slate-400 mt-1 max-w-sm">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
