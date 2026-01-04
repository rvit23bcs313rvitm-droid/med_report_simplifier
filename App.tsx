import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { LanguageSelector } from './components/LanguageSelector';
import { ResultsDisplay } from './components/ResultsDisplay';
import { analyzeReport } from './services/geminiService';
import { AppState, FileData, Language, AnalysisResult } from './types';
import { Loader2 } from 'lucide-react';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [currentFile, setCurrentFile] = useState<FileData | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileSelect = useCallback((fileData: FileData) => {
    setCurrentFile(fileData);
    setAppState(AppState.LANGUAGE_SELECT);
  }, []);

  const handleLanguageSelect = useCallback(async (lang: Language) => {
    if (!currentFile) return;
    setSelectedLanguage(lang);
    setAppState(AppState.PROCESSING);
    setErrorMessage(null);

    try {
      const analysis = await analyzeReport(
        currentFile.base64,
        currentFile.mimeType,
        lang.name // Pass full name like "Hindi"
      );
      
      setResult({
        ...analysis,
        originalFileName: currentFile.file.name,
        targetLanguage: lang.name
      });
      setAppState(AppState.RESULTS);

    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "An unexpected error occurred during analysis.");
      setAppState(AppState.ERROR);
    }
  }, [currentFile]);

  const resetApp = () => {
    setAppState(AppState.UPLOAD);
    setCurrentFile(null);
    setSelectedLanguage(null);
    setResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        
        {appState === AppState.UPLOAD && (
          <div className="animate-in fade-in zoom-in duration-500 w-full">
            <FileUpload onFileSelect={handleFileSelect} />
          </div>
        )}

        {appState === AppState.LANGUAGE_SELECT && (
          <div className="animate-in slide-in-from-right duration-500 w-full">
            <LanguageSelector 
              onSelect={handleLanguageSelect} 
              onBack={() => setAppState(AppState.UPLOAD)}
            />
          </div>
        )}

        {appState === AppState.PROCESSING && (
          <div className="text-center animate-pulse flex flex-col items-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 rounded-full bg-teal-200 blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-white p-6 rounded-full shadow-xl">
                 <Loader2 className="h-12 w-12 text-teal-600 animate-spin" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyzing Report</h2>
            <p className="text-slate-500 max-w-md">
              Translating to {selectedLanguage?.name} and generating medical insights...
            </p>
          </div>
        )}

        {appState === AppState.RESULTS && result && (
          <div className="w-full animate-in slide-in-from-bottom duration-700">
            <ResultsDisplay result={result} onReset={resetApp} />
          </div>
        )}

        {appState === AppState.ERROR && (
          <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg border border-red-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Analysis Failed</h2>
            <p className="text-slate-500 mb-6">{errorMessage}</p>
            <button 
                onClick={resetApp}
                className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
                Try Again
            </button>
          </div>
        )}

      </main>
      
      <footer className="py-6 text-center text-slate-400 text-sm no-print">
        &copy; {new Date().getFullYear()} MediTranslate AI. Secure & Private.
      </footer>
    </div>
  );
}

export default App;