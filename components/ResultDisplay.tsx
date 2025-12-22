import React, { useRef, useState } from 'react';
import { AnalysisResult, ResultType } from '../types';
import { Copy, ExternalLink, RefreshCw, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface ResultDisplayProps {
  result: AnalysisResult | null;
  loading: boolean;
}

// Custom PreBlock component to handle code blocks with copy functionality
const PreBlock = ({ children, ...props }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>) => {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!preRef.current) return;
    const text = preRef.current.textContent || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4">
      {/* Top Copy Button */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-700/50 hover:bg-slate-600 text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10 backdrop-blur-sm border border-slate-600/30"
        title="Copy Code"
      >
        {copied ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
      </button>

      <pre ref={preRef} {...props} className="relative overflow-x-auto">
        {children}
      </pre>

      {/* Bottom Copy Button - visible after scrolling to bottom */}
      <button
        onClick={handleCopy}
        className="absolute bottom-2 right-2 p-1.5 rounded-md bg-slate-700/50 hover:bg-slate-600 text-slate-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 z-10 backdrop-blur-sm border border-slate-600/30"
        title="Copy Code"
      >
        {copied ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, loading }) => {
  const [copied, setCopied] = React.useState(false);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-12 text-center p-16 bg-slate-800/30 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse"></div>
          <RefreshCw className="h-14 w-14 text-indigo-500 mx-auto animate-spin relative z-10" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Analyzing Problem...</h3>
        <p className="text-slate-400 max-w-sm mx-auto">Connecting to the algorithm engine to generate your insights.</p>
      </div>
    );
  }

  if (!result) return null;

  const isSolution = result.type === ResultType.SOLUTION;
  const themeClass = isSolution ? 'monokai-theme' : 'bg-slate-800 border-slate-700';

  const copyToClipboard = () => {
    // Strip markdown code blocks if present for cleaner code copy
    const cleanContent = result.content.replace(/```[a-z]*\n([\s\S]*?)\n```/g, '$1');
    navigator.clipboard.writeText(cleanContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
      <div className={`rounded-2xl border shadow-2xl overflow-hidden transition-all duration-300 ${themeClass}`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isSolution ? 'monokai-header' : 'bg-slate-900/50 border-slate-700'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full animate-pulse ${
              result.type === ResultType.ELI5 ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]' :
              result.type === ResultType.SOLUTION ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]' :
              'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]'
            }`} />
            <h2 className={`text-sm font-bold tracking-widest uppercase ${isSolution ? 'text-[#a6e22e]' : 'text-slate-100'}`}>
              {result.type === ResultType.TEST_CASES ? 'NASTY TEST CASES' : result.type}
            </h2>
          </div>
          <button 
            onClick={copyToClipboard}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs font-semibold
              ${isSolution 
                ? 'bg-[#49483e] hover:bg-[#75715e] text-[#f8f8f2]' 
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white'
              }`}
            title="Copy entire content"
          >
            {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy All'}
          </button>
        </div>

        {/* Content Area */}
        <div className="p-8 overflow-x-auto min-h-[300px]">
          <div className={`prose-custom font-sans ${isSolution ? 'prose-monokai' : ''}`}>
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeHighlight]}
              components={{
                code: ({node, ...props}) => <code className="font-mono" {...props} />,
                pre: PreBlock
              }}
            >
              {result.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Footer / Sources */}
        {result.sources && result.sources.length > 0 && (
          <div className={`px-6 py-4 border-t ${isSolution ? 'monokai-header' : 'bg-slate-900/80 border-slate-700'}`}>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Context Sources</p>
            <div className="flex flex-wrap gap-2">
              {result.sources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full transition-all duration-200 border
                    ${isSolution 
                      ? 'bg-[#272822] border-[#49483e] text-[#66d9ef] hover:bg-[#49483e]' 
                      : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20'
                    }`}
                >
                  <span className="max-w-[180px] truncate">{source.title}</span>
                  <ExternalLink className="h-3 w-3 flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;