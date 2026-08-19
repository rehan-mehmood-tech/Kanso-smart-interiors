import React from 'react';
import { Users, Building2, Image as ImageIcon, Briefcase } from 'lucide-react';

export interface PlatformMetric {
  title: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
  icon: React.ElementType;
}

const METRICS: PlatformMetric[] = [
  { title: 'Total Registered Users', value: '2,481', trend: '+12% this month', trendUp: true, icon: Users },
  { title: 'Verified Partner Studios', value: '45', trend: '+3 this week', trendUp: true, icon: Building2 },
  { title: 'AI Concepts Generated', value: '14,290', trend: '98.5% success rate', trendUp: true, icon: ImageIcon },
  { title: 'Specialist Match Rate', value: '18.4%', trend: 'Avg. 3 days to book', trendUp: true, icon: Briefcase }
];

export function AdminMetricsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {METRICS.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <div key={idx} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col justify-between min-h-[140px]">
            <div className="flex justify-between items-start mb-4">
              <span className="font-label-sm text-[10px] uppercase tracking-widest text-secondary">{metric.title}</span>
              <Icon className="w-5 h-5 text-primary opacity-80" />
            </div>
            <div>
              <div className="font-display-xl text-4xl text-primary tracking-tight leading-none mb-2">{metric.value}</div>
              <span className={`font-label-sm text-[10px] uppercase tracking-widest ${metric.trendUp ? 'text-green-700' : 'text-secondary'}`}>
                {metric.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
