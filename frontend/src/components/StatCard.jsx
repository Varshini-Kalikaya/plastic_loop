import React from 'react';

const StatCard = ({ title, value, icon: Icon, description, color = 'emerald', trend }) => {
  const colorMap = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    teal: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
  };

  return (
    <div className="glass-card glass-card-hover p-5 rounded-2xl relative overflow-hidden group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-emerald-300 transition-colors">
            {value}
          </h3>
          {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl border ${colorMap[color] || colorMap.emerald}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
