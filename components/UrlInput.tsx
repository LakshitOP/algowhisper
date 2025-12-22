import React, { useState, useEffect } from 'react';
import { Link, CheckCircle, XCircle } from 'lucide-react';
import { PATTERNS } from '../constants';
import { Platform } from '../types';

interface UrlInputProps {
  onUrlChange: (url: string, isValid: boolean) => void;
  disabled?: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ onUrlChange, disabled }) => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [platform, setPlatform] = useState<Platform | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      validate(url);
    }, 300); // Debounce validation

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="w-full max-w-2xl mx-auto space-y-2">
      <label className="block text-sm font-medium text-slate-400 mb-1">
        Paste Problem URL
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Link className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
        </div>
        <input
          type="text"
          className={`block w-full pl-10 pr-12 py-3 rounded-xl bg-slate-800 border-2 text-slate-100 placeholder-slate-500 focus:outline-none transition-all duration-300
            ${status === 'invalid' 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
              : status === 'valid'
                ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20 focus:ring-4'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          placeholder="https://leetcode.com/problems/..."
          value={url}
          onChange={handleChange}
          disabled={disabled}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {status === 'valid' && <CheckCircle className="h-5 w-5 text-green-500" />}
          {status === 'invalid' && <XCircle className="h-5 w-5 text-red-500" />}
        </div>
      </div>
      
      <div className="flex justify-between items-center px-1 h-6">
        <span className={`text-xs transition-opacity duration-300 ${status === 'invalid' ? 'text-red-400 opacity-100' : 'opacity-0'}`}>
          Invalid URL. Only LeetCode, Codeforces, or CodeChef supported.
        </span>
        {platform && (
          <span className="text-xs font-semibold text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            {platform} detected
          </span>
        )}
      </div>
    </div>
  );
};

export default UrlInput;