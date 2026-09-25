import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeStyle = (statusStr) => {
    switch (statusStr) {
      case 'PENDING':
        return 'bg-amber-50 text-amber-900 border-amber-200/80';
      case 'ASSIGNED':
        return 'bg-sky-50 text-sky-900 border-sky-200/80';
      case 'ACCEPTED':
        return 'bg-teal-50 text-teal-900 border-teal-200/80';
      case 'PICKED_UP':
        return 'bg-indigo-50 text-indigo-900 border-indigo-200/80';
      case 'VERIFIED':
        return 'bg-emerald-50 text-emerald-900 border-emerald-300';
      case 'SENT_TO_RECYCLER':
        return 'bg-purple-50 text-purple-900 border-purple-200/80';
      case 'PROCESSING':
        return 'bg-orange-50 text-orange-950 border-orange-300 animate-pulse';
      case 'RECYCLED':
      case 'COMPLETED':
      case 'APPROVED':
      case 'FULFILLED':
        return 'bg-[#edf6f0] text-[#1b4332] border-[#b8dfc4]';
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-rose-50 text-rose-900 border-rose-200/80';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const getDotColor = (statusStr) => {
    switch (statusStr) {
      case 'PENDING':
        return 'bg-amber-500';
      case 'ASSIGNED':
        return 'bg-sky-500';
      case 'ACCEPTED':
        return 'bg-teal-600';
      case 'PICKED_UP':
        return 'bg-indigo-600';
      case 'VERIFIED':
        return 'bg-emerald-600';
      case 'SENT_TO_RECYCLER':
        return 'bg-purple-600';
      case 'PROCESSING':
        return 'bg-orange-500';
      case 'RECYCLED':
      case 'COMPLETED':
      case 'APPROVED':
      case 'FULFILLED':
        return 'bg-[#1b4332]';
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-rose-500';
      default:
        return 'bg-stone-400';
    }
  };

  const formatText = (str) => {
    if (!str) return 'N/A';
    return str.replace(/_/g, ' ');
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider border uppercase transition-colors ${getBadgeStyle(
        status
      )}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getDotColor(status)}`}></span>
      {formatText(status)}
    </span>
  );
};

export default StatusBadge;
