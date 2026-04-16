
import React, { useState } from 'react';

interface ApiKeyModalProps {
  onSave: (key: string) => void;
  onClose?: () => void;
  existingKey?: string;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave, onClose, existingKey }) => {
  const [value, setValue] = useState(existingKey || '');
  const [show, setShow] = useState(false);

  const handleSave = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSave(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-panel rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl border border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">API Key</h2>
            <p className="text-xs text-slate-400">Required to generate images</p>
          </div>
        </div>

        <p className="text-sm text-slate-400 mb-5">
          Enter your API key below. It will be saved locally in your browser and never sent anywhere except the image generation API.
        </p>

        <div className="relative mb-6">
          <input
            type={show ? 'text' : 'password'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="Enter your API key..."
            className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-4 py-3 pr-12 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 font-mono text-sm"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            title={show ? 'Hide key' : 'Show key'}
          >
            {show ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!value.trim()}
            className="flex-1 py-3 rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save Key
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-2xl font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
