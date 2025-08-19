import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Download, Upload, Copy, Check, Code2, BarChart3 } from 'lucide-react';

const CodeEditor = ({ sourceCode, setSourceCode }) => {
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState('javascript');

  const sampleCode = `// Sample JavaScript function
function calculateSum(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both arguments must be numbers');
  }
  return a + b;
}

// Sample class
class Calculator {
  constructor() {
    this.history = [];
  }
  
  add(a, b) {
    const result = calculateSum(a, b);
    this.history.push({ operation: 'add', a, b, result });
    return result;
  }
  
  getHistory() {
    return this.history;
  }
}

module.exports = { calculateSum, Calculator };`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sourceCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSourceCode(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([sourceCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'source-code.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSampleCode = () => {
    setSourceCode(sampleCode);
  };

  return (
    <div className="space-y-6">
      <div className="card hover-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Code2 className="text-blue-400" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-100">Code Editor</h2>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="input-field text-sm"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-3 mb-6">
          <button
            onClick={loadSampleCode}
            className="btn-secondary btn-hover-effect flex items-center space-x-2"
          >
            <Code2 size={16} />
            <span>Load Sample Code</span>
          </button>
          
          <label className="btn-secondary btn-hover-effect cursor-pointer flex items-center space-x-2">
            <Upload size={16} />
            <span>Upload File</span>
            <input
              type="file"
              accept=".js,.ts,.py,.java,.cpp,.c,.cs"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          
          <button
            onClick={handleDownload}
            className="btn-secondary btn-hover-effect flex items-center space-x-2"
            disabled={!sourceCode}
          >
            <Download size={16} />
            <span>Download</span>
          </button>
          
          <button
            onClick={handleCopy}
            className="btn-secondary btn-hover-effect flex items-center space-x-2"
            disabled={!sourceCode}
          >
            {copied ? (
              <>
                <Check size={16} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="border border-gray-600/50 rounded-xl overflow-hidden shadow-2xl">
          <Editor
            height="500px"
            language={language}
            value={sourceCode}
            onChange={setSourceCode}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
              fontFamily: 'Fira Code, monospace',
            }}
          />
        </div>
      </div>

      {sourceCode && (
        <div className="card hover-card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <BarChart3 className="text-purple-400" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-100">Code Statistics</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <div className="text-3xl font-bold text-blue-400">
                {sourceCode.split('\n').length}
              </div>
              <div className="text-gray-400 text-sm mt-1">Lines of Code</div>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
              <div className="text-3xl font-bold text-green-400">
                {sourceCode.split('function').length - 1 + sourceCode.split('class').length - 1}
              </div>
              <div className="text-gray-400 text-sm mt-1">Functions/Classes</div>
            </div>
            <div className="text-center p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <div className="text-3xl font-bold text-yellow-400">
                {sourceCode.length}
              </div>
              <div className="text-gray-400 text-sm mt-1">Characters</div>
            </div>
            <div className="text-center p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <div className="text-3xl font-bold text-purple-400">
                {Math.round(sourceCode.length / 1024 * 100) / 100}
              </div>
              <div className="text-gray-400 text-sm mt-1">KB</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
