import { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DEFAULT_TEX = `\\documentclass{article}
\\begin{document}
Hello World! This is ResumeForge AI.
\\end{document}
`;

export default function Editor() {
  const [texContent, setTexContent] = useState(DEFAULT_TEX);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileError, setCompileError] = useState<string | null>(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Debounce compilation
  useEffect(() => {
    const timer = setTimeout(() => {
      compileLatex(texContent);
    }, 1500);

    return () => clearTimeout(timer);
  }, [texContent]);

  const compileLatex = async (content: string) => {
    setIsCompiling(true);
    setCompileError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/latex/compile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ texContent: content }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.log || errData.error || 'Compilation failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err: any) {
      setCompileError(err.message);
      console.error(err);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleAskAI = async () => {
    setIsAnalyzing(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/ai/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ texContent }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Analysis failed');
      }

      const data = await response.json();
      setAiAnalysis(data);
    } catch (err: any) {
      console.error(err);
      alert(`Failed to analyze resume: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTailor = async () => {
    const jobDescription = prompt("Paste the job description or role:");
    if (!jobDescription) return;

    setIsAnalyzing(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/ai/tailor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ texContent, jobDescription }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Tailoring failed');
      }

      const data = await response.json();
      if (data.tailoredTex) {
        setTexContent(data.tailoredTex);
        alert(`Tailoring complete! Match Score: ${data.matchScore}\nGap Report: ${data.gapReport}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Failed to tailor resume: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 dark:bg-zinc-900 flex flex-col">
      <header className="h-14 bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            &larr; Back
          </button>
          <h1 className="font-semibold text-gray-900 dark:text-white">Resume Editor</h1>
        </div>
        <div className="flex items-center gap-4">
          {isCompiling && <span className="text-sm text-gray-500 animate-pulse">Compiling...</span>}
          <button 
            onClick={handleAskAI}
            disabled={isAnalyzing}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded text-sm font-medium transition-colors"
          >
            {isAnalyzing ? 'Analyzing...' : 'Ask AI'}
          </button>
          <button 
            onClick={handleTailor}
            disabled={isAnalyzing}
            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded text-sm font-medium transition-colors"
          >
            Tailor to Job
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 grid grid-cols-2">
          <div className="h-full w-full">
            <MonacoEditor
              height="100%"
              language="latex"
              theme="vs-dark"
              value={texContent}
              onChange={(value) => setTexContent(value || '')}
              options={{
                minimap: { enabled: false },
                wordWrap: 'on',
                fontSize: 14,
              }}
            />
          </div>
          
          <div className="h-full w-full bg-gray-200 dark:bg-zinc-900 relative border-l border-gray-200 dark:border-zinc-700">
            {compileError ? (
              <div className="p-4 h-full overflow-auto text-red-500 font-mono text-sm bg-gray-900 text-red-400">
                <h3 className="text-lg font-bold text-red-500 mb-2">Compilation Error</h3>
                <pre className="whitespace-pre-wrap">{compileError}</pre>
              </div>
            ) : pdfUrl ? (
              <iframe
                src={pdfUrl + '#toolbar=0'}
                className="w-full h-full border-0"
                title="PDF Preview"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                Waiting for compilation...
              </div>
            )}
          </div>
        </div>
        
        {/* AI Analysis Sidebar */}
        {aiAnalysis && (
          <div className="w-80 bg-white dark:bg-zinc-800 border-l border-gray-200 dark:border-zinc-700 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Feedback</h2>
              <button onClick={() => setAiAnalysis(null)} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>
            
            <div className="mb-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{aiAnalysis.score}/100</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{aiAnalysis.summary}</p>
            </div>

            <div className="space-y-4">
              {aiAnalysis.sections?.map((sec: any, idx: number) => (
                <div key={idx} className="bg-gray-50 dark:bg-zinc-900 p-3 rounded border border-gray-100 dark:border-zinc-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">{sec.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{sec.feedback}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
