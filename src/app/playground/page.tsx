'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { executeCode, CODE_TEMPLATES, LANGUAGE_NAMES } from '@/lib/judge0/service';
import { Judge0SubmissionResponse } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Play,
  Copy,
  Download,
  Trash2,
  Code2,
  Terminal,
  Check,
  Cpu,
  Clock,
  FileInput,
  AlertOctagon,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function CodingPlaygroundPage() {
  const { activeCode, activeLanguage, setActiveCode, setActiveLanguage } = useAppStore();
  const [stdin, setStdin] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [output, setOutput] = useState<Judge0SubmissionResponse | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleLanguageChange = (lang: string) => {
    setActiveLanguage(lang);
    if (!activeCode || activeCode.includes('Template')) {
      setActiveCode(CODE_TEMPLATES[lang] || CODE_TEMPLATES['python']);
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const res = await executeCode(activeCode, activeLanguage, stdin);
      setOutput(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extMap: Record<string, string> = {
      python: 'py',
      java: 'java',
      c: 'c',
      cpp: 'cpp',
      javascript: 'js',
    };
    const blob = new Blob([activeCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solution.${extMap[activeLanguage] || 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 flex flex-col pb-12">
      {/* Playground Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#151518] p-4 rounded-2xl border border-white/10 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-[#C9A227]/20 text-[#C9A227]">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Monaco Coding Playground</h1>
            <p className="text-xs text-zinc-400">Interactive execution engine with Standard Input (stdin) support</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Language Selector */}
          <select
            value={activeLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-[#111113] border border-white/10 text-white text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-[#C9A227]"
          >
            {Object.keys(LANGUAGE_NAMES).map((lang) => (
              <option key={lang} value={lang}>
                {LANGUAGE_NAMES[lang]}
              </option>
            ))}
          </select>

          <Button variant="glass" size="sm" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="hidden md:inline">Copy</span>
          </Button>

          <Button variant="glass" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Download</span>
          </Button>

          <Button variant="gold" size="sm" onClick={handleRunCode} isLoading={isRunning}>
            {isRunning ? (
              <span className="flex items-center gap-1">
                <Loader2 className="w-4 h-4 animate-spin text-black" /> Running...
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Play className="w-4 h-4 fill-black" /> Run Code
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Editor & Input Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monaco Editor Container (Spans 2 columns) */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 overflow-hidden bg-[#1e1e1e] flex flex-col min-h-[450px]">
          <div className="px-4 py-2 bg-[#181818] border-b border-white/5 flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-[#C9A227]" /> Monaco Code Editor ({LANGUAGE_NAMES[activeLanguage] || activeLanguage})
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">VS Dark Theme</span>
          </div>
          <div className="flex-1 min-h-[420px]">
            <Editor
              height="100%"
              language={activeLanguage === 'cpp' ? 'cpp' : activeLanguage}
              theme="vs-dark"
              value={activeCode}
              onChange={(value) => setActiveCode(value || '')}
              options={{
                fontSize: 14,
                fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                padding: { top: 12 },
              }}
            />
          </div>
        </div>

        {/* Right Side: Standard Input Panel */}
        <Card className="flex flex-col p-4 bg-[#111113] border border-white/10 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-zinc-400">
            <span className="flex items-center gap-2 font-bold text-white text-xs">
              <FileInput className="w-4 h-4 text-[#C9A227]" /> Standard Input (stdin)
            </span>
            {stdin && (
              <button
                onClick={() => setStdin('')}
                className="text-zinc-500 hover:text-zinc-300 text-[11px] hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
            Pass multiple lines of user input to interactive programs (<code className="text-[#C9A227]">input()</code>, <code className="text-[#C9A227]">Scanner</code>, <code className="text-[#C9A227]">scanf</code>, <code className="text-[#C9A227]">cin</code>).
          </p>

          <textarea
            rows={12}
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="Enter your program input here..."
            className="w-full bg-[#151518] border border-white/10 rounded-xl p-3 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-[#C9A227] leading-relaxed resize-none flex-1"
          />

          <Button variant="gold" className="w-full mt-2" onClick={handleRunCode} isLoading={isRunning}>
            {isRunning ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-black" /> Executing Code...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Play className="w-4 h-4 fill-black" /> Run Code
              </span>
            )}
          </Button>
        </Card>
      </div>

      {/* Program Output Panel (Terminal Style) */}
      <Card className="p-4 bg-[#111113] border border-white/10 font-mono text-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 text-zinc-400">
          <span className="flex items-center gap-2 font-bold text-white text-sm">
            <Terminal className="w-5 h-5 text-[#C9A227]" /> Program Output Console
          </span>

          <div className="flex items-center space-x-3">
            {output && (
              <>
                <div className="flex items-center space-x-3 text-[11px] text-zinc-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#C9A227]" /> {output.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-[#C9A227]" /> {output.memory} KB
                  </span>
                </div>

                <button
                  onClick={() => setOutput(null)}
                  className="text-zinc-500 hover:text-zinc-300 p-1 rounded hover:bg-white/5"
                  title="Clear Console"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {isRunning ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3 text-zinc-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#C9A227]" />
            <p className="text-xs font-mono">Compiling and executing via Judge0 engine...</p>
          </div>
        ) : !output ? (
          <div className="py-10 text-center text-zinc-600 space-y-2 font-sans">
            <Terminal className="w-8 h-8 opacity-40 text-[#C9A227] mx-auto" />
            <p className="text-xs text-zinc-400">Click &quot;Run Code&quot; above to execute your solution with standard input.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Status Header Badge */}
            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 rounded-lg text-xs font-bold font-mono ${
                  output.status?.id === 3
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {output.status?.description || 'Executed'}
              </span>
            </div>

            {/* Standard Output Panel */}
            {output.stdout && (
              <div className="p-4 rounded-xl bg-[#151518] border border-white/10 space-y-2">
                <p className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5 font-sans">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Standard Output
                </p>
                <pre className="text-emerald-300 whitespace-pre-wrap leading-relaxed font-mono overflow-x-auto">
                  {output.stdout}
                </pre>
              </div>
            )}

            {/* Compiler Errors Panel (Red Terminal Style Box) */}
            {output.compile_output && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-600/40 space-y-2 shadow-inner">
                <p className="text-[11px] uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5 font-sans">
                  <AlertOctagon className="w-4 h-4 text-rose-500" /> Compiler Error
                </p>
                <pre className="text-rose-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto bg-black/40 p-3 rounded-lg border border-rose-500/20">
                  {output.compile_output}
                </pre>
              </div>
            )}

            {/* Runtime Errors Panel (Red Terminal Style Box) */}
            {output.stderr && (
              <div className="p-4 rounded-xl bg-amber-950/40 border border-rose-500/40 space-y-2 shadow-inner">
                <p className="text-[11px] uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5 font-sans">
                  <AlertTriangle className="w-4 h-4 text-rose-400" /> Runtime Error (stderr)
                </p>
                <pre className="text-rose-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto bg-black/40 p-3 rounded-lg border border-rose-500/20">
                  {output.stderr}
                </pre>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
