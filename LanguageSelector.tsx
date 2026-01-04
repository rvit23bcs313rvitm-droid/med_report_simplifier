import React from 'react';
import { Languages } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../constants';
import { Language } from '../types';

interface LanguageSelectorProps {
  onSelect: (lang: Language) => void;
  onBack: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelect, onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Select Language</h2>
        <p className="text-slate-500">Choose the Indian language for your report translation.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onSelect(lang)}
            className="group flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-xl hover:border-teal-500 hover:shadow-md transition-all duration-200"
          >
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
              {lang.nativeName.charAt(0)}
            </span>
            <span className="font-medium text-slate-900">{lang.name}</span>
            <span className="text-xs text-slate-500 mt-1">{lang.nativeName}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button 
            onClick={onBack}
            className="text-slate-500 hover:text-slate-800 text-sm font-medium underline underline-offset-4"
        >
            Cancel and upload a different file
        </button>
      </div>
    </div>
  );
};