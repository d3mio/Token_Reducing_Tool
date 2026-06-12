'use client';

import { useState, useCallback, useMemo } from 'react';

type CompressionStrategy = 'gentle' | 'moderate' | 'aggressive';

interface CompressionMetrics {
  originalTokens: number;
  compressedTokens: number;
  percentSaved: number;
}

// Estimate token count (roughly 1 token per 4 characters)
const estimateTokenCount = (text: string): number => {
  if (!text.trim()) return 0;
  return Math.ceil(text.trim().split(/\s+/).length * 1.3);
};

const STRATEGIES: CompressionStrategy[] = ['gentle', 'moderate', 'aggressive'];

export default function PromptCompressor() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [strategy, setStrategy] = useState<CompressionStrategy>('moderate');
  const [copied, setCopied] = useState(false);
  const [timeTaken, setTimeTaken] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // Support Modal State
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [isSendingSupport, setIsSendingSupport] = useState(false);
  const [supportStatus, setSupportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const metrics = useMemo<CompressionMetrics>(() => {
    const originalTokens = estimateTokenCount(input);
    const compressedTokens = output ? estimateTokenCount(output) : 0;
    const percentSaved = originalTokens > 0 
      ? Math.max(0, Math.round(((originalTokens - compressedTokens) / originalTokens) * 100))
      : 0;

    return { originalTokens, compressedTokens, percentSaved };
  }, [input, output]);

  const handleCompress = useCallback(async () => {
    if (!input.trim()) return;
    
    setIsCompressing(true);
    const t0 = performance.now();
    
    try {
      const res = await fetch('/api/compress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, strategy })
      });
      
      if (!res.ok) {
        throw new Error(`Compression failed with status: ${res.status}`);
      }
      
      const data = await res.json();
      setOutput(data.compressed || 'No content generated.');
    } catch (err) {
      console.error(err);
      setOutput('Error: Failed to compress prompt using the AI Agent. Please check your API key and connection.');
    } finally {
      const ms = performance.now() - t0;
      setTimeTaken(`${ms < 1 ? '<1' : ms.toFixed(0)}ms`);
      setIsCompressing(false);
    }
  }, [input, strategy]);

  const handleSupportSubmit = async () => {
    if (!supportMessage.trim()) return;
    setIsSendingSupport(true);
    setSupportStatus('idle');
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: supportMessage })
      });
      if (res.ok) {
        setSupportStatus('success');
        setTimeout(() => {
          setIsSupportOpen(false);
          setSupportMessage('');
          setSupportStatus('idle');
        }, 2000);
      } else {
        setSupportStatus('error');
      }
    } catch (err) {
      console.error(err);
      setSupportStatus('error');
    } finally {
      setIsSendingSupport(false);
    }
  };

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleReset = useCallback(() => {
    setInput('');
    setOutput('');
    setTimeTaken(null);
  }, []);

  const statusLine = output && timeTaken
    ? `${metrics.originalTokens} → ${metrics.compressedTokens} tokens · ${metrics.percentSaved > 0 ? '-' : '+'}${Math.abs(metrics.percentSaved)}% · ${timeTaken}`
    : input.trim()
      ? `${estimateTokenCount(input)} tokens · ready to compress`
      : null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-10 font-sans relative">
      <div className="w-full max-w-4xl flex flex-col gap-10">

        {/* Header */}
        <header className="flex items-center justify-between border-b border-zinc-800 pb-5">
          <span className="font-mono text-[13px] text-white tracking-wider">
            prompt<span className="text-zinc-600">/</span>compress
          </span>
          <nav className="flex items-center gap-6">
            <button className="text-[12px] tracking-wide transition-colors text-white">
              compress
            </button>
            <button 
              onClick={() => setIsSupportOpen(true)}
              className="text-[12px] tracking-wide transition-colors text-zinc-600 hover:text-zinc-300"
            >
              support
            </button>
          </nav>
        </header>

        {/* Editors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Input */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-500">
                input
              </label>
              {input.trim() && (
                <span className="text-[10px] font-mono text-zinc-600">
                  {estimateTokenCount(input)} tok
                </span>
              )}
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your prompt…"
              spellCheck={false}
              className="
                h-72 w-full rounded bg-zinc-950 border border-zinc-800
                font-mono text-[13px] leading-relaxed text-zinc-100
                placeholder:text-zinc-700
                p-4 resize-none
                focus:outline-none focus:border-zinc-600
                transition-colors duration-150
              "
            />
          </div>

          {/* Output */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-500">
                output
              </label>
              {output && (
                <span className="text-[10px] font-mono text-zinc-600">
                  {metrics.compressedTokens} tok
                </span>
              )}
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="Compressed output appears here."
              spellCheck={false}
              className={`
                h-72 w-full rounded bg-zinc-950 border border-zinc-800
                font-mono text-[13px] leading-relaxed text-zinc-100
                placeholder:text-zinc-700
                p-4 resize-none
                focus:outline-none
                transition-opacity duration-200
                ${isCompressing ? 'opacity-40 animate-pulse' : 'opacity-100'}
              `}
            />
          </div>

        </div>

        {/* Status + Controls */}
        <div className="flex flex-col gap-4 border-t border-zinc-800 pt-5">

          {/* Inline status line */}
          <div className="h-4">
            {statusLine && (
              <p className={`font-mono text-[12px] ${isCompressing ? 'text-zinc-300 animate-pulse' : 'text-zinc-500'} tabular-nums`}>
                {isCompressing ? 'AI Agent is compressing prompt...' : statusLine}
              </p>
            )}
          </div>

          {/* Controls row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

            {/* Strategy toggles */}
            <div className="flex items-center gap-1 font-mono text-[12px]">
              <span className="text-zinc-600 mr-2">strategy</span>
              {STRATEGIES.map((s, i) => (
                <span key={s} className="flex items-center gap-1">
                  {i > 0 && <span className="text-zinc-800 select-none">/</span>}
                  <button
                    onClick={() => setStrategy(s)}
                    disabled={isCompressing}
                    className={`transition-colors duration-100 ${strategy === s
                      ? 'text-white'
                      : 'text-zinc-600 hover:text-zinc-400'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {s}
                  </button>
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                disabled={isCompressing}
                className="text-[12px] font-mono text-zinc-600 hover:text-zinc-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                reset
              </button>
              <div className="w-px h-3 bg-zinc-800" />
              <button
                onClick={handleCopy}
                disabled={!output || isCompressing}
                className="
                  text-[12px] font-mono text-zinc-400 border border-zinc-800 rounded
                  px-3 py-1.5 hover:border-zinc-600 hover:text-zinc-200
                  disabled:opacity-25 disabled:cursor-not-allowed
                  transition-colors duration-100
                "
              >
                {copied ? 'copied ✓' : 'copy'}
              </button>
              <button
                onClick={handleCompress}
                disabled={!input.trim() || isCompressing}
                className="
                  text-[12px] font-mono font-medium
                  bg-white text-black rounded px-3 py-1.5
                  hover:bg-zinc-200
                  disabled:opacity-25 disabled:cursor-not-allowed
                  transition-all duration-100
                  flex items-center gap-2
                "
              >
                {isCompressing ? (
                  <>
                    <svg className="animate-spin h-3 w-3 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    compressing...
                  </>
                ) : 'compress →'}
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Support Modal */}
      {isSupportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-lg p-6 w-full max-w-md flex flex-col gap-4 shadow-2xl">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-white font-mono text-[13px] tracking-wide">Contact Support</h3>
              <button 
                onClick={() => setIsSupportOpen(false)} 
                className="text-zinc-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <textarea
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              placeholder="How can we help you?"
              className="w-full h-32 bg-black border border-zinc-800 rounded p-3 text-[13px] font-mono text-zinc-200 placeholder:text-zinc-700 resize-none focus:outline-none focus:border-zinc-600 transition-colors"
            />
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-[11px] font-mono">
                {supportStatus === 'success' && <span className="text-green-500">Message sent successfully ✓</span>}
                {supportStatus === 'error' && <span className="text-red-500">Failed to send message ✕</span>}
              </span>
              <button
                onClick={handleSupportSubmit}
                disabled={isSendingSupport || !supportMessage.trim()}
                className="text-[12px] font-mono font-medium bg-white text-black px-4 py-1.5 rounded hover:bg-zinc-200 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
              >
                {isSendingSupport ? 'sending...' : 'send →'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}