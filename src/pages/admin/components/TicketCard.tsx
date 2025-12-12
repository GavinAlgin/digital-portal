// components/TicketCard.tsx
import React from 'react';

interface TicketCardProps {
  title: string;
  count: number | string;
  percentage?: string;
  description: string;
  trend?: 'up' | 'down';
  trendColor?: string;
}

const TicketCard: React.FC<TicketCardProps> = ({ title, count, percentage, description, trend = 'up', trendColor = 'text-emerald-500' }) => {
  const trendIcon =
    trend === 'up' ? (
      <svg className="hi-mini hi-arrow-small-up inline-block size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 15a.75.75 0 01-.75-.75V7.612L7.29 9.77a.75.75 0 01-1.08-1.04l3.25-3.5a.75.75 0 011.08 0l3.25 3.5a.75.75 0 11-1.08 1.04l-1.96-2.158v6.638A.75.75 0 0110 15z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="hi-mini hi-arrow-down inline-block size-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
      </svg>
    );

  return (
    <a href="javascript:void(0)" className="flex flex-col rounded-lg border border-neutral-200 bg-white hover:border-neutral-300 active:border-neutral-200">
      <div className="flex grow items-center justify-between p-5">
        <dl>
          <dt className="text-2xl font-bold">{count}</dt>
          <dd className="text-sm font-medium text-neutral-500">{title}</dd>
        </dl>
        <div className={`flex items-center text-sm font-medium ${trendColor}`}>
          {trendIcon}
          {percentage && <span>{percentage}</span>}
        </div>
      </div>
      <div className="border-t border-neutral-100 px-5 py-3 text-xs font-medium text-neutral-500">{description}</div>
    </a>
  );
};

export default TicketCard;
