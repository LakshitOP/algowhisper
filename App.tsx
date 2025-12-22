import React, { useState } from 'react';
import { Baby, Code, Skull, BrainCircuit } from 'lucide-react';
import UrlInput from './components/UrlInput';
import LanguageModal from './components/LanguageModal';
import ResultDisplay from './components/ResultDisplay';
import { generateAnalysis } from './services/geminiService';
import { AnalysisResult, ResultType, SupportedLanguage } from './types';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUrlChange = (newUrl: string, valid: boolean) => {
    setUrl(newUrl);
    setIsValidUrl(valid);
    if (!valid && newUrl.length > 0) {
        setResult(null);
    }
  };

  const handleAction = async (type: ResultType, language?: string) => {
    if (!isValidUrl) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await generateAnalysis(url, type, language);
      setResult({
        type,
        content: response.text,
        sources: response.groundingSources
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onLanguageSelected = (lang: SupportedLanguage) => {
    setIsLanguageModalOpen(false);
    handleAction(ResultType.SOLUTION, lang);
  };

  return (
    <div className="min-h-screen bg-[#020617] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 flex flex-col text-slate-100 selection:bg-indigo-500/30">
      {/* Navbar Decoration */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30"></div>

      {/* Header */}
      <header className="pt-16 pb-12 px-4 text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-slate-900 p-3 rounded-2xl border border-slate-700/50 shadow-xl">
                  <BrainCircuit className="h-10 w-10 text-indigo-400" />
              </div>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white drop-shadow-sm">
                Algo<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">Whisperer</span>
            </h1>
        </div>
        <p className="text-slate-400 max-w-lg mx-auto text-lg font-medium leading-relaxed">
          Master competitive programming with AI-powered clarity, clean solutions, and edge-case detection.
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 pb-20">
        <div className="bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-slate-800 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
            
            {/* Input Section */}
            <UrlInput onUrlChange={handleUrlChange} disabled={loading} />

            {/* Error Message */}
            {error && (
                <div className="max-w-2xl mx-auto mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-300 text-sm font-medium flex items-center justify-center gap-2 animate-in slide-in-from-top-2">
                    <Skull className="h-4 w-4" />
                    {error}
                </div>
            )}

            {/* Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
                <button
                    onClick={() => handleAction(ResultType.ELI5)}
                    disabled={!isValidUrl || loading}
                    className="group relative flex flex-col items-center justify-center p-8 rounded-3xl bg-slate-800/50 border border-slate-700/50 hover:border-yellow-500/40 hover:bg-slate-800 transition-all duration-300 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                    <div className="p-4 bg-yellow-500/10 rounded-2xl mb-5 group-hover:scale-110 transition-transform duration-500">
                      <Baby className="h-10 w-10 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Explain like I am 5</h3>
                    <p className="text-sm text-slate-500 text-center font-medium">Simplified logic with friendly analogies.</p>
                </button>

                <button
                    onClick={() => setIsLanguageModalOpen(true)}
                    disabled={!isValidUrl || loading}
                    className="group relative flex flex-col items-center justify-center p-8 rounded-3xl bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/40 hover:bg-slate-800 transition-all duration-300 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                    <div className="p-4 bg-indigo-500/10 rounded-2xl mb-5 group-hover:scale-110 transition-transform duration-500">
                      <Code className="h-10 w-10 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Generate Solution</h3>
                    <p className="text-sm text-slate-500 text-center font-medium">Optimized code in Monokai theme.</p>
                </button>

                <button
                    onClick={() => handleAction(ResultType.TEST_CASES)}
                    disabled={!isValidUrl || loading}
                    className="group relative flex flex-col items-center justify-center p-8 rounded-3xl bg-slate-800/50 border border-slate-700/50 hover:border-red-500/40 hover:bg-slate-800 transition-all duration-300 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                    <div className="p-4 bg-red-500/10 rounded-2xl mb-5 group-hover:scale-110 transition-transform duration-500">
                      <Skull className="h-10 w-10 text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Generate Nasty</h3>
                    <p className="text-sm text-slate-500 text-center font-medium">Crucial edge cases to break your code.</p>
                </button>
            </div>

            {/* Results */}
            <ResultDisplay result={result} loading={loading} />
        </div>
      </main>

      <footer className="py-8 text-center text-slate-600 text-sm border-t border-slate-900">
        <p>© {new Date().getFullYear()} AlgoWhisperer • Powered by Google Gemini 3</p>
      </footer>

      <LanguageModal 
        isOpen={isLanguageModalOpen} 
        onClose={() => setIsLanguageModalOpen(false)} 
        onSelect={onLanguageSelected} 
      />
    </div>
  );
};

export default App;