
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { AnalysisResult, ResultType } from '../types';
// Fixed: Added Skull to the import list from lucide-react
import { Copy, ExternalLink, CheckCircle2, Terminal, Cpu, ShieldAlert, Code2, Sparkles, AlertTriangle, BookOpen, Skull } from 'lucide-react';
import Lottie from 'lottie-react';
import { BORED_HAND_LOTTIE } from '../loadingAnimation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface ResultDisplayProps {
  result: AnalysisResult | null;
  loading: boolean;
  isDarkMode?: boolean;
}

const loadingMessages = [
  "Infiltrating Problem Domain...",
  "Analyzing Time Constraints...",
  "Synthesizing Logic Gates...",
  "Optimizing Memory Map...",
  "Detecting Edge Case Volatility...",
  "Calibrating Algorithmic Pathways...",
  "Finalizing Solution Matrix...",
  "Rendering Insights..."
];

const PreBlock = ({ children, ...props }: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement>) => {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  
  // Extract language from children if possible
  const lang = React.Children.toArray(children).find((child: any) => child.props?.className?.includes('language-')) as any;
  const languageName = lang?.props?.className?.split('-')[1] || 'code';

  const handleCopy = () => {
    if (!preRef.current) return;
    const text = preRef.current.textContent || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-8">
      <div className="absolute -top-4 left-6 z-20 flex items-center gap-2 px-4 py-1.5 bg-indigo-600 rounded-full shadow-lg shadow-indigo-900/40 border border-indigo-400/30">
        <Code2 className="h-3.5 w-3.5 text-white" />
        <span className="text-[11px] font-extrabold tracking-widest text-white uppercase">{languageName}</span>
      </div>
      
      <button
        onClick={handleCopy}
        className={`absolute top-4 right-4 p-2.5 rounded-xl transition-all z-20 backdrop-blur-md border shadow-2xl ${
          copied 
          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
          : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white hover:bg-indigo-600'
        }`}
        title="Copy Code"
      >
        {copied ? <CheckCircle2 className="h-4.5 w-4.5" /> : <Copy className="h-4.5 w-4.5" />}
      </button>

      <pre ref={preRef} {...props} className="relative overflow-x-auto selection:bg-indigo-500/30">
        {children}
      </pre>
    </div>
  );
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, loading, isDarkMode = true }) => {
  const [copied, setCopied] = React.useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Generate interactive particles
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speed: 0.2 + Math.random() * 0.5,
      opacity: 0.1 + Math.random() * 0.3
    }));
  }, []);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setMsgIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    
    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  if (loading) {
    const rotateX = (mousePos.y - 300) / 60; 
    const rotateY = (mousePos.x - 450) / -70;

    return (
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className={`w-full max-w-4xl mx-auto mt-12 overflow-hidden rounded-[3rem] border backdrop-blur-3xl shadow-2xl relative transition-all duration-700 group ${
          isDarkMode ? 'bg-slate-950/90 border-slate-800/50' : 'bg-white/90 border-slate-200'
        }`}
        style={{ perspective: '2000px' }}
      >
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {particles.map((p) => {
            const containerWidth = containerRef.current?.clientWidth || 900;
            const containerHeight = containerRef.current?.clientHeight || 600;
            const px = (p.x / 100) * containerWidth;
            const py = (p.y / 100) * containerHeight;
            const dx = mousePos.x - px;
            const dy = mousePos.y - py;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const force = Math.max(0, 180 - distance) / 180;
            const moveX = -dx * force * 0.5;
            const moveY = -dy * force * 0.5;

            return (
              <div
                key={p.id}
                className={`absolute rounded-full transition-transform duration-300 ease-out ${
                  isDarkMode ? 'bg-indigo-400' : 'bg-indigo-600'
                }`}
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  opacity: p.opacity,
                  transform: `translate(${moveX}px, ${moveY}px)`,
                  boxShadow: force > 0.1 ? `0 0 12px rgba(99, 102, 241, ${force * 0.6})` : 'none'
                }}
              />
            );
          })}
        </div>

        <div className="p-16 flex flex-col items-center relative z-10">
          <div 
            className="w-80 h-80 mb-10 transition-transform duration-500 ease-out flex items-center justify-center relative"
            style={{ 
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(80px)`,
              transformStyle: 'preserve-3d'
            }}
          >
            <div className={`w-full h-full relative z-10 rounded-full flex items-center justify-center ${
              isDarkMode ? 'drop-shadow-[0_0_30px_rgba(99,102,241,0.4)]' : 'drop-shadow-[0_0_30px_rgba(99,102,241,0.2)]'
            }`}>
              <Lottie 
                animationData={BORED_HAND_LOTTIE} 
                loop={true} 
                autoplay={true} 
                style={{ width: 360, height: 360 }}
              />
            </div>
            <div className="absolute inset-0 border-2 border-dashed border-indigo-500/20 rounded-full animate-[spin_30s_linear_infinite]"></div>
            <div className="absolute inset-4 border border-indigo-500/10 rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>
          </div>

          <div className="space-y-8 text-center max-w-lg w-full">
            <h3 className={`text-3xl font-black tracking-tighter flex items-center justify-center gap-5 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              <span className="inline-block w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,1)] animate-pulse" />
              NEURAL SYNTHESIS
            </h3>
            <div className={`font-mono text-base p-5 rounded-2xl border w-full min-h-[4rem] flex items-center justify-center gap-4 transition-all duration-500 ${
              isDarkMode ? 'bg-slate-900/80 border-slate-700/50 text-indigo-300 shadow-xl' : 'bg-slate-50 border-slate-200 text-indigo-600 shadow-lg'
            }`} key={msgIndex}>
              <span className="opacity-40 font-black animate-pulse">&gt;</span>
              <span className="animate-in fade-in slide-in-from-bottom-2 duration-500 font-bold">{loadingMessages[msgIndex]}</span>
            </div>
            <div className="relative pt-4 px-4">
              <div className={`w-full h-2 rounded-full overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
                <div 
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-500 transition-all duration-1000 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                  style={{ width: `${15 + (msgIndex * 11)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const isELI5 = result.type === ResultType.ELI5;
  const isSolution = result.type === ResultType.SOLUTION;
  const isNasty = result.type === ResultType.TEST_CASES;

  const getResultStyle = () => {
    if (isSolution) return 'monokai-theme';
    if (isNasty) return isDarkMode ? 'bg-red-950/20 border-red-500/30 shadow-red-900/10' : 'bg-red-50/80 border-red-200 shadow-red-200/50';
    if (isELI5) return isDarkMode ? 'bg-amber-950/10 border-amber-500/20 shadow-amber-900/5' : 'bg-amber-50/50 border-amber-200 shadow-amber-100/30';
    return isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200';
  };

  const getIcon = () => {
    if (isELI5) return <BookOpen className="h-6 w-6 text-amber-500" />;
    if (isSolution) return <Cpu className="h-6 w-6 text-indigo-400" />;
    if (isNasty) return <AlertTriangle className="h-6 w-6 text-red-500" />;
    return <Terminal className="h-6 w-6" />;
  };

  const copyToClipboard = () => {
    // Strip markdown code blocks for cleaner code copying if it's a solution
    const cleanContent = isSolution ? result.content.replace(/```[a-z]*\n([\s\S]*?)\n```/g, '$1') : result.content;
    navigator.clipboard.writeText(cleanContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 cubic-bezier(0.16, 1, 0.3, 1)">
      <div className={`rounded-[2.5rem] border overflow-hidden transition-all duration-500 backdrop-blur-xl ${getResultStyle()}`}>
        
        {/* Decorative background accents */}
        {isELI5 && <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Sparkles className="h-32 w-32 text-amber-500" /></div>}
        {isNasty && <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Skull className="h-32 w-32 text-red-500" /></div>}

        {/* Header Section */}
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between px-10 py-8 border-b gap-6 ${
          isSolution ? 'monokai-header' : isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50/80 border-slate-200'
        }`}>
          <div className="flex items-center gap-6">
            <div className={`p-4 rounded-[1.25rem] shadow-xl ${
              isSolution ? 'bg-indigo-500/20 border border-indigo-500/30' : 
              isNasty ? 'bg-red-500/20 border border-red-500/30' : 
              isELI5 ? 'bg-amber-500/20 border border-amber-500/30' : 
              'bg-slate-800/80'
            }`}>
              {getIcon()}
            </div>
            
            <div>
              <h2 className={`text-[10px] font-black tracking-[0.3em] uppercase mb-1 ${
                isSolution ? 'text-indigo-400' : 
                isNasty ? 'text-red-400' : 
                isELI5 ? 'text-amber-500' : 
                'text-slate-500'
              }`}>
                Analysis Outcome
              </h2>
              <p className={`text-2xl font-extrabold tracking-tight ${
                isSolution ? 'text-white' : isDarkMode ? 'text-slate-100' : 'text-slate-900'
              }`}>
                {isNasty ? 'Nasty Edge Cases' : isELI5 ? 'Explained Simply' : result.type}
              </p>
            </div>
          </div>
          
          <button 
            onClick={copyToClipboard}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-300 text-sm font-black shadow-2xl group active:scale-95
              ${isSolution 
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/40' 
                : isNasty
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30'
                  : isDarkMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 shadow-black/50'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/40'
              }`}
          >
            {copied ? <CheckCircle2 className="h-5 w-5 animate-in zoom-in" /> : <Copy className="h-5 w-5 group-hover:rotate-12 transition-transform" />}
            {copied ? 'Copied Successfully' : isSolution ? 'Copy Source Code' : 'Copy All Text'}
          </button>
        </div>

        {/* Content Section */}
        <div className={`p-10 sm:p-14 overflow-x-auto min-h-[400px] relative z-10 ${isSolution ? 'monokai-content' : ''}`}>
          <div className={`prose-custom transition-colors ${
            isSolution ? 'prose-monokai' : ''
            }`}>
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

        {/* Sources Section */}
        {result.sources && result.sources.length > 0 && (
          <div className={`px-10 py-8 border-t transition-colors ${
            isSolution ? 'monokai-header' : isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-100/50 border-slate-200'
          }`}>
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className={`h-4 w-4 ${isSolution ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Grounding Context & References</p>
            </div>
            <div className="flex flex-wrap gap-4">
              {result.sources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 text-xs font-extrabold px-6 py-3.5 rounded-2xl transition-all duration-300 border shadow-lg group
                    ${isSolution 
                      ? 'bg-[#12121a] border-[#2f334d] text-indigo-300 hover:border-indigo-500 hover:bg-indigo-500/10' 
                      : isDarkMode
                        ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50'
                        : 'bg-white border-slate-200 text-indigo-600 hover:border-indigo-600 hover:scale-[1.02]'
                    }`}
                >
                  <span className="max-w-[240px] truncate">{source.title}</span>
                  <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
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
