
import React, { useState } from 'react';
import { Baby, Code, Skull, BrainCircuit, Moon, Sun, Sparkles } from 'lucide-react';
import UrlInput from './components/UrlInput';
import ResultDisplay from './components/ResultDisplay';
import { generateAnalysis } from './services/geminiService';
import { AnalysisResult, ResultType, SupportedLanguage } from './types';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleUrlChange = (newUrl: string, valid: boolean) => {
    setUrl(newUrl);
    setIsValidUrl(valid);
    if (!valid && newUrl.length > 0) {
        setResult(null);
    }
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleAction = async (type: ResultType, language?: string) => {
    if (!isValidUrl) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const selectedLang = type === ResultType.SOLUTION ? (language || SupportedLanguage.CPP) : undefined;

    try {
      const response = await generateAnalysis(url, type, selectedLang);
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

  const loadExample = (exampleUrl: string) => {
    handleUrlChange(exampleUrl, true);
    // Force set the URL in the input via a state update that the component will pick up
    // Note: We'd ideally need a way to pass the URL back down to UrlInput's internal state
    // but the current UrlInput uses local state. Let's fix that or rely on re-renders.
  };

  const isInvalidState = url.length > 0 && !isValidUrl;

  return (
    <div className={`min-h-screen transition-colors duration-500 flex flex-col selection:bg-indigo-500/30 ${
      isDarkMode 
        ? 'bg-[#020617] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 text-slate-100' 
        : 'bg-slate-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-white to-white text-slate-900'
    }`}>
      {/* Navbar Decoration */}
      <div className={`h-1 w-full opacity-30 ${isDarkMode ? 'bg-gradient-to-r from-transparent via-indigo-500 to-transparent' : 'bg-gradient-to-r from-transparent via-indigo-600 to-transparent'}`}></div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-2xl border transition-all duration-300 shadow-xl flex items-center gap-2 group ${
            isDarkMode 
              ? 'bg-slate-900/80 border-slate-700 text-yellow-400 hover:bg-slate-800' 
              : 'bg-white/80 border-slate-200 text-indigo-600 hover:bg-slate-100'
          }`}
        >
          {isDarkMode ? <Sun className="h-5 w-5 animate-pulse" /> : <Moon className="h-5 w-5" />}
          <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
      </div>

      {/* Header */}
      <header className={`pt-16 pb-12 px-4 text-center transition-opacity duration-500 ${isInvalidState ? 'opacity-40' : 'opacity-100'}`}>
        <div className="flex flex-col items-center justify-center">
            <div className="relative group mb-6">
              <div className={`absolute -inset-4 rounded-3xl blur-xl opacity-20 group-hover:opacity-60 transition duration-1000 ${
                isValidUrl 
                  ? 'bg-gradient-to-r from-emerald-400 via-indigo-500 to-purple-600 opacity-80 animate-pulse' 
                  : (isDarkMode ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-gradient-to-r from-indigo-400 to-indigo-200')
              }`}></div>
              <div className={`relative p-5 rounded-3xl border shadow-xl overflow-hidden transition-all duration-500 ${
                isDarkMode ? 'bg-slate-900 border-slate-700/50' : 'bg-white border-slate-200'
              } ${isValidUrl ? 'scale-110 border-indigo-400 shadow-indigo-500/20' : ''}`}>
                  <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent`}></div>
                  <BrainCircuit className={`h-14 w-14 relative z-10 transition-all duration-500 ${
                    isValidUrl 
                      ? 'text-indigo-300 animate-[float_1.5s_easeInOutSine_infinite] drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]' 
                      : (isDarkMode ? 'text-indigo-400 animate-[float_4s_easeInOutSine_infinite]' : 'text-indigo-600 animate-[float_4s_easeInOutSine_infinite]')
                  }`} />
              </div>
            </div>
            
            <h1 className={`text-6xl font-black tracking-tighter relative select-none transition-all duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Algo<span className={`text-transparent bg-clip-text transition-all duration-500 ${
                  isValidUrl 
                    ? 'bg-gradient-to-r from-indigo-300 via-emerald-400 to-indigo-500' 
                    : (isDarkMode ? 'bg-gradient-to-r from-indigo-400 to-indigo-600' : 'bg-gradient-to-r from-indigo-600 to-indigo-800')
                }`}>Whisperer</span>
            </h1>
        </div>
        <p className={`max-w-lg mx-auto text-lg font-medium leading-relaxed mt-8 transition-all duration-500 ${
          isValidUrl ? 'text-indigo-400 scale-105' : (isDarkMode ? 'text-slate-400 opacity-80' : 'text-slate-500')
        }`}>
          {isValidUrl ? 'Problem link confirmed. Let\'s solve this!' : 'Master competitive programming with AI-powered clarity, clean solutions, and edge-case detection.'}
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 pb-20">
        <div className={`backdrop-blur-2xl rounded-[2.5rem] p-10 border transition-all duration-500 shadow-[0_0_50px_-12px_rgba(0,0,0,0.1)] ${
          isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white/60 border-slate-200'
        } ${isValidUrl ? 'ring-2 ring-indigo-500/20' : ''}`}>
            
            <UrlInput onUrlChange={handleUrlChange} disabled={loading} isDarkMode={isDarkMode} externalValue={url} />

            {/* Featured Examples */}
            {!isValidUrl && !loading && (
              <div className="max-w-2xl mx-auto mt-6 flex flex-wrap items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Try Example:</span>
                <button 
                  onClick={() => setUrl('https://codeforces.com/problemset/problem/1896/A')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold transition-all ${
                    isDarkMode 
                      ? 'bg-slate-800/50 border-slate-700 text-indigo-300 hover:border-indigo-500 hover:bg-indigo-500/10' 
                      : 'bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-100'
                  }`}
                >
                  <Sparkles className="h-3 w-3" />
                  Jagged Swaps (1896A)
                </button>
              </div>
            )}

            {error && (
                <div className="max-w-2xl mx-auto mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium flex items-center justify-center gap-2 animate-in slide-in-from-top-2">
                    <Skull className="h-4 w-4" />
                    {error}
                </div>
            )}

            {/* Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
                <button
                    onClick={() => handleAction(ResultType.ELI5)}
                    disabled={!isValidUrl || loading}
                    className={`group relative flex flex-col items-center justify-center p-8 rounded-3xl border transition-all duration-300 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed ${
                      isDarkMode 
                        ? 'bg-slate-800/50 border-slate-700/50 hover:border-yellow-500/40 hover:bg-slate-800' 
                        : 'bg-white border-slate-200 hover:border-yellow-400 hover:shadow-lg'
                    } ${isValidUrl ? 'scale-[1.02] shadow-xl' : ''}`}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                    <div className="p-4 bg-yellow-500/10 rounded-2xl mb-5 group-hover:scale-110 transition-transform duration-500">
                      <Baby className="h-10 w-10 text-yellow-500" />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Explain like I am 5</h3>
                    <p className="text-sm text-slate-500 text-center font-medium">Simplified logic with friendly analogies.</p>
                </button>

                <button
                    onClick={() => handleAction(ResultType.SOLUTION, SupportedLanguage.CPP)}
                    disabled={!isValidUrl || loading}
                    className={`group relative flex flex-col items-center justify-center p-8 rounded-3xl border transition-all duration-300 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed ${
                      isDarkMode 
                        ? 'bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/40 hover:bg-slate-800' 
                        : 'bg-white border-slate-200 hover:border-yellow-400 hover:shadow-lg'
                    } ${isValidUrl ? 'scale-[1.02] shadow-xl border-indigo-500/30' : ''}`}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                    <div className="p-4 bg-indigo-500/10 rounded-2xl mb-5 group-hover:scale-110 transition-transform duration-500">
                      <Code className="h-10 w-10 text-indigo-500" />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Generate Solution</h3>
                    <p className="text-sm text-slate-500 text-center font-medium">Optimized C++ code (Monokai theme).</p>
                </button>

                <button
                    onClick={() => handleAction(ResultType.TEST_CASES)}
                    disabled={!isValidUrl || loading}
                    className={`group relative flex flex-col items-center justify-center p-8 rounded-3xl border transition-all duration-300 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed ${
                      isDarkMode 
                        ? 'bg-slate-800/50 border-slate-700/50 hover:border-red-500/40 hover:bg-slate-800' 
                        : 'bg-white border-slate-200 hover:border-red-400 hover:shadow-lg'
                    } ${isValidUrl ? 'scale-[1.02] shadow-xl' : ''}`}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                    <div className="p-4 bg-red-500/10 rounded-2xl mb-5 group-hover:scale-110 transition-transform duration-500">
                      <Skull className="h-10 w-10 text-red-500" />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Generate Nasty</h3>
                    <p className="text-sm text-slate-500 text-center font-medium">Crucial edge cases to break your code.</p>
                </button>
            </div>

            <ResultDisplay result={result} loading={loading} isDarkMode={isDarkMode} />
        </div>
      </main>

      <footer className={`py-8 text-center text-sm border-t transition-colors ${isDarkMode ? 'text-slate-600 border-slate-900' : 'text-slate-400 border-slate-100'}`}>
        <p>© {new Date().getFullYear()} AlgoWhisperer • Powered by Google Gemini 3</p>
      </footer>
    </div>
  );
};

export default App;
