
import React, { useState, useEffect } from 'react';
import { Link, CheckCircle, XCircle, Zap, Globe, Cpu, Terminal, AlertCircle } from 'lucide-react';
import { PATTERNS } from '../constants';
import { Platform } from '../types';

interface UrlInputProps {
  onUrlChange: (url: string, isValid: boolean) => void;
  disabled?: boolean;
  isDarkMode?: boolean;
  externalValue?: string;
}

const UrlInput: React.FC<UrlInputProps> = ({ onUrlChange, disabled, isDarkMode = true, externalValue = '' }) => {
  const [url, setUrl] = useState(externalValue);
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [platform, setPlatform] = useState<Platform | null>(null);

  useEffect(() => {
    if (externalValue !== undefined && externalValue !== url) {
      setUrl(externalValue);
    }
  }, [externalValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      validate(url);
    }, 300); 

    return () => clearTimeout(timer);
  }, [url]);

  const validate = (inputUrl: string) => {
    if (!inputUrl.trim()) {
      setStatus('idle');
      setPlatform(null);
      onUrlChange(inputUrl, false);
      return;
    }

    let detectedPlatform: Platform | null = null;
    let isValid = false;

    if (PATTERNS.LEETCODE.test(inputUrl)) detectedPlatform = Platform.LEETCODE;
    else if (PATTERNS.CODEFORCES.test(inputUrl)) detectedPlatform = Platform.CODEFORCES;
    else if (PATTERNS.CODECHEF.test(inputUrl)) detectedPlatform = Platform.CODECHEF;

    if (detectedPlatform) {
      isValid = true;
      setStatus('valid');
      setPlatform(detectedPlatform);
    } else {
      setStatus('invalid');
      setPlatform(null);
    }

    onUrlChange(inputUrl, isValid);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between mb-1">
        <label className={`block text-sm font-semibold transition-colors ${
          status === 'valid' ? 'text-indigo-400' : (isDarkMode ? 'text-slate-400' : 'text-slate-500')
        }`}>
          Paste Problem URL
        </label>
        {status === 'valid' && (
          <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">
            < Zap className="h-3 w-3 fill-emerald-500" /> System Active
          </span>
        )}
      </div>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
          <Link className={`h-5 w-5 transition-all duration-300 ${
            status === 'valid' 
              ? 'text-indigo-400 scale-110 rotate-12' 
              : (isDarkMode ? 'text-slate-500 group-focus-within:text-indigo-400' : 'text-slate-300 group-focus-within:text-indigo-600')
          }`} />
        </div>
        
        {/* Energetic Background Glow for Valid URL */}
        <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-emerald-400 to-indigo-500 opacity-0 transition-opacity duration-500 blur-md ${
          status === 'valid' ? 'opacity-30' : ''
        }`} />

        <input
          type="text"
          className={`block w-full pl-12 pr-12 py-4 rounded-2xl border-2 transition-all duration-500 font-medium relative z-10
            ${isDarkMode 
              ? 'bg-slate-800/80 text-slate-100 placeholder-slate-500' 
              : 'bg-slate-50 text-slate-900 placeholder-slate-400'
            }
            ${status === 'invalid' 
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' 
              : status === 'valid'
                ? 'border-emerald-500/80 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] scale-[1.01]'
                : isDarkMode 
                  ? 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 focus:ring-4'
                  : 'border-slate-200 focus:border-indigo-600 focus:ring-indigo-600/10 focus:ring-4'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          placeholder="https://leetcode.com/problems/..."
          value={url}
          onChange={handleChange}
          disabled={disabled}
        />
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
          {status === 'valid' && (
            <CheckCircle className="h-6 w-6 text-emerald-500 drop-shadow-sm animate-[bounce_0.5s_ease-in-out_infinite] scale-110" />
          )}
          {status === 'invalid' && <XCircle className="h-5 w-5 text-red-500 opacity-60" />}
        </div>
      </div>
      
      {/* Dynamic Status Overlay / Error Container */}
      <div className="relative min-h-[40px]">
        {status === 'invalid' ? (
          <div className={`animate-in fade-in slide-in-from-top-2 duration-500 p-6 rounded-[1.5rem] border transition-all ${
            isDarkMode ? 'bg-slate-900/60 border-red-500/20 shadow-2xl' : 'bg-red-50/50 border-red-200 shadow-lg'
          }`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 bg-red-500/10 rounded-xl">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="flex-1">
                <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Unsupported Platform</h4>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  The URL provided doesn't match a supported competitive programming host. 
                  AlgoWhisperer currently syncs with:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:scale-[1.02] ${
                isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-100'
              }`}>
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Terminal className="h-4 w-4 text-orange-500" />
                </div>
                <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>LeetCode</span>
              </div>

              <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:scale-[1.02] ${
                isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-100'
              }`}>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Globe className="h-4 w-4 text-blue-500" />
                </div>
                <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Codeforces</span>
              </div>

              <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:scale-[1.02] ${
                isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-100'
              }`}>
                <div className="p-2 bg-amber-600/10 rounded-lg">
                  <Cpu className="h-4 w-4 text-amber-600" />
                </div>
                <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>CodeChef</span>
              </div>
            </div>
          </div>
        ) : platform ? (
          <div className="flex justify-end pt-2">
            <span className={`text-[11px] font-black px-4 py-1.5 rounded-full border transition-all duration-500 uppercase tracking-widest shadow-lg
              ${isDarkMode 
                ? 'text-white bg-indigo-600 border-indigo-400 shadow-indigo-500/20' 
                : 'text-white bg-indigo-600 border-indigo-500 shadow-indigo-600/30'
              }
              animate-[in_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)] scale-110
            `}>
              {platform} detected
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default UrlInput;
