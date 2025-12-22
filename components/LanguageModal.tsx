import React from 'react';
import { LANGUAGES } from '../constants';
import { SupportedLanguage } from '../types';
import { Code2, X } from 'lucide-react';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (lang: SupportedLanguage) => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl transform transition-all scale-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Code2 className="h-6 w-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Select Language</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => onSelect(lang)}
              className="flex items-center justify-center px-4 py-3 rounded-xl bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-white transition-all duration-200 font-medium group"
            >
              {lang}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageModal;