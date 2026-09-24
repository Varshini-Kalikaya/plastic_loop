import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeStyle = (statusStr) => {
    switch (statusStr) {
      case 'PENDING':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'ASSIGNED':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'ACCEPTED':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'PICKED_UP':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'VERIFIED':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
      case 'SENT_TO_RECYCLER':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'PROCESSING':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30 animate-pulse';
      case 'RECYCLED':
      case 'COMPLETED':
      case 'APPROVED':
      case 'FULFILLED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const formatText = (str) => {
    if (!str) return 'N/A';
    return str.replace(/_/g, ' ');
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border uppercase ${getBadgeStyle(
        status
      )}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></span>
      {formatText(status)}
    </span>
  );
};

export default StatusBadge;
