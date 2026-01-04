import React from 'react';
import { FileHeart } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 no-print">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="mr-4 flex items-center gap-2 font-bold text-teal-600">
          <FileHeart className="h-6 w-6" />
          <span className="text-xl tracking-tight">MediTranslate AI</span>
        </div>
        <nav className="flex flex-1 items-center justify-end space-x-4">
          <div className="text-sm font-medium text-slate-500 hidden sm:block">
            Medical Report Analysis & Translation
          </div>
        </nav>
      </div>
    </header>
  );
};