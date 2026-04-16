
import React from 'react';

interface SettingsCardProps {
  title: string;
  children: React.ReactNode;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({ title, children }) => {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  );
};

interface ToggleOptionProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

export const ToggleOption: React.FC<ToggleOptionProps> = ({ active, onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
        active
          ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20'
          : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
      }`}
    >
      {label}
    </button>
  );
};
