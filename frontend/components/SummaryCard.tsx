import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'yellow' | 'red';
}

const colorClasses = {
  blue: {
    bg: 'bg-accent-blue/10 dark:bg-accent-blue/20',
    text: 'text-accent-blue',
  },
  green: {
    bg: 'bg-accent-green/10 dark:bg-accent-green/20',
    text: 'text-accent-green',
  },
  yellow: {
    bg: 'bg-accent-yellow/10 dark:bg-accent-yellow/20',
    text: 'text-accent-yellow',
  },
  red: {
    bg: 'bg-accent-red/10 dark:bg-accent-red/20',
    text: 'text-accent-red',
  },
};

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon: Icon, color }) => {
  const classes = colorClasses[color];

  return (
    <div className="bg-card-light dark:bg-card-dark p-6 rounded-2xl shadow-md border border-border-light dark:border-border-dark flex items-center gap-6 transition-shadow hover:shadow-lg">
      <div className={`p-4 rounded-full ${classes.bg}`}>
        <Icon className={`w-8 h-8 ${classes.text}`} />
      </div>
      <div>
        <h3 className="text-slate-500 dark:text-slate-400 font-semibold">{title}</h3>
        <p className="text-3xl font-bold mt-1 font-heading">{value}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
