import React from 'react';

const StatCard = ({ title, value, icon: Icon, description, color = 'emerald', trend }) => {
  const colorMap = {
    emerald: 'text-[#1b4332] bg-[#edf6f0] border-[#cbe3d3]',
    blue: 'text-[#0369a1] bg-[#f0f9ff] border-[#bae6fd]',
    amber: 'text-[#92400e] bg-[#fefce8] border-[#fde68a]',
    purple: 'text-[#6b21a8] bg-[#faf5ff] border-[#e9d5ff]',
    teal: 'text-[#0f766e] bg-[#f0fdfa] border-[#99f6e4]',
  };

  return (
    <div className="eco-card eco-card-hover p-5 sm:p-6 relative overflow-hidden group">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-[#627368] uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#14231b] tracking-tight">
            {value}
          </h3>
          {description && <p className="text-xs text-[#708076] pt-0.5">{description}</p>}
        </div>
        {Icon && (
          <div className={`p-2.5 sm:p-3 rounded-xl border shrink-0 ${colorMap[color] || colorMap.emerald}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3.5 flex items-center gap-1.5 text-xs font-semibold text-[#2d6a4f] pt-2 border-t border-[#edf2ec]">
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
