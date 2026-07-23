'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { executeCode, CODE_TEMPLATES, LANGUAGE_NAMES } from '@/lib/judge0/service';
import { Judge0SubmissionResponse } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Copy, Download, Trash2, Code2, Terminal, Check, Cpu, Clock } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function CodingPlaygroundPage() {
  const { activeCode, activeLanguage, setActiveCode, setActiveLanguage } = useAppStore();
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<Judge0SubmissionResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const handleLanguageChange = (lang: string) => {
    setActiveLanguage(lang);
    if (!activeCode || activeCode.includes('Template')) {
      setActiveCode(CODE_TEMPLATES[lang] || CODE_TEMPLATES['python']);
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const res = await executeCode(activeCode, activeLanguage);
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
    const extMap: Record<string, string> = { python: 'py', java: 'java', c: 'c', cpp: 'cpp', javascript: 'js' };
    const blob = new Blob([activeCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solution.${extMap[activeLanguage] || 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      {/* Playground Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#151518] p-4 rounded-2xl border border-white/10 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-[#C9A227]/20 text-[#C9A227]">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Monaco Coding Playground</h1>
            <p className="text-xs text-zinc-400">Live execution powered by Judge0 REST Engine</p>
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
            <Play className="w-4 h-4 mr-1 fill-black" /> Run Code
          </Button>
        </div>
      </div>

      {/* Editor & Console Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Monaco Editor Container */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 overflow-hidden bg-[#1e1e1e] flex flex-col">
          <div className="px-4 py-2 bg-[#181818] border-b border-white/5 flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>VS Code Dark Theme</span>
            <span>Auto Save Enabled</span>
          </div>
          <div className="flex-1 min-h-[350px]">
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

        {/* Output Console Panel */}
        <Card className="flex flex-col p-4 bg-[#111113] border border-white/10 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 text-zinc-400">
            <span className="flex items-center gap-2 font-bold text-white">
              <Terminal className="w-4 h-4 text-[#C9A227]" /> Output Console
            </span>
            {output && (
              <button
                onClick={() => setOutput(null)}
                className="text-zinc-500 hover:text-zinc-300 p-1"
                title="Clear console"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {!output ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 text-center py-12 space-y-2 font-sans">
                <Terminal className="w-8 h-8 opacity-40 text-[#C9A227]" />
                <p>Click &quot;Run Code&quot; to execute your solution via Judge0 API.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Execution Status Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                      output.status?.id === 3
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {output.status?.description || 'Executed'}
                  </span>

                  <div className="flex items-center space-x-3 text-[11px] text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#C9A227]" /> {output.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-[#C9A227]" /> {output.memory} KB
                    </span>
                  </div>
                </div>

                {/* Standard Output */}
                {output.stdout && (
                  <div className="p-3 rounded-xl bg-[#151518] border border-white/5 space-y-1">
                    <p className="text-[10px] uppercase text-zinc-500 font-bold">Standard Output</p>
                    <pre className="text-emerald-300 whitespace-pre-wrap leading-relaxed">{output.stdout}</pre>
                  </div>
                )}

                {/* Standard Error or Compile Output */}
                {(output.stderr || output.compile_output) && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                    <p className="text-[10px] uppercase text-rose-400 font-bold">Execution Error</p>
                    <pre className="text-rose-300 whitespace-pre-wrap leading-relaxed">
                      {output.stderr || output.compile_output}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
