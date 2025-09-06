import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Sparkles, Copy, Check, Download, Play, TestTube, BarChart3 } from 'lucide-react';
import { generateTestsWithAI } from '../services/aiService.js';

const TestGenerator = ({ sourceCode, generatedTests, setGeneratedTests, isLoading, setIsLoading }) => {
  const [copied, setCopied] = useState(false);
  const [testFramework, setTestFramework] = useState('jest');
  const [coverage, setCoverage] = useState('high');

  const handleGenerateTests = async () => {
    if (!sourceCode.trim()) {
      alert('Please enter some source code first!');
      return;
    }

    setIsLoading(true);
    try {
      const tests = await generateTestsWithAI(sourceCode, testFramework, coverage);
      setGeneratedTests(tests);
    } catch (error) {
      console.error('Error generating tests:', error);
      alert('Failed to generate tests. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedTests);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedTests], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tests.${testFramework === 'jest' ? 'js' : 'js'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTestFrameworkLanguage = () => {
    switch (testFramework) {
      case 'jest':
        return 'javascript';
      case 'mocha':
        return 'javascript';
      case 'jasmine':
        return 'javascript';
      default:
        return 'javascript';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="card hover-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <TestTube className="text-purple-400" size={20} />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-100">AI Test Generator</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <select
              value={testFramework}
              onChange={(e) => setTestFramework(e.target.value)}
              className="input-field text-sm w-full sm:w-auto"
            >
              <option value="jest">Jest</option>
              <option value="mocha">Mocha</option>
              <option value="jasmine">Jasmine</option>
            </select>
            
            <select
              value={coverage}
              onChange={(e) => setCoverage(e.target.value)}
              className="input-field text-sm w-full sm:w-auto"
            >
              <option value="basic">Basic Coverage</option>
              <option value="medium">Medium Coverage</option>
              <option value="high">High Coverage</option>
              <option value="comprehensive">Comprehensive</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <button
            onClick={handleGenerateTests}
            disabled={!sourceCode.trim() || isLoading}
            className="btn-primary btn-hover-effect flex items-center space-x-2 text-sm"
          >
            <Sparkles size={16} />
            <span>{isLoading ? 'Generating...' : 'Generate Tests'}</span>
          </button>
          
          {generatedTests && (
            <>
              <button
                onClick={handleCopy}
                className="btn-secondary btn-hover-effect flex items-center space-x-2 text-sm"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    <span className="hidden sm:inline">Copied!</span>
                    <span className="sm:hidden">✓</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>Copy</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleDownload}
                className="btn-secondary btn-hover-effect flex items-center space-x-2 text-sm"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Download</span>
                <span className="sm:hidden">Save</span>
              </button>
            </>
          )}
        </div>

        {!sourceCode.trim() && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <Play size={24} className="text-yellow-400" />
              <p className="text-yellow-300">
                Please add some source code in the Code Editor tab first, then come back to generate tests.
              </p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              <span className="text-gray-300 text-lg">AI is generating comprehensive tests<span className="loading-dots"></span></span>
            </div>
          </div>
        )}

        {generatedTests && !isLoading && (
          <div className="border border-gray-600/50 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-gray-800/50 px-4 sm:px-6 py-3 border-b border-gray-600/50">
              <h3 className="text-sm font-medium text-gray-300">
                Generated Tests ({testFramework.toUpperCase()})
              </h3>
            </div>
            <Editor
              height="300px"
              language={getTestFrameworkLanguage()}
              value={generatedTests}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 12,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'on',
                fontFamily: 'Fira Code, monospace',
              }}
            />
          </div>
        )}
      </div>

      {generatedTests && (
        <div className="card hover-card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <BarChart3 className="text-green-400" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-100">Test Statistics</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <div className="text-center p-3 sm:p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <div className="text-2xl sm:text-3xl font-bold text-blue-400">
                {generatedTests.split('test(').length - 1 + generatedTests.split('it(').length - 1}
              </div>
              <div className="text-gray-400 text-xs sm:text-sm mt-1">Test Cases</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-green-500/10 rounded-xl border border-green-500/20">
              <div className="text-2xl sm:text-3xl font-bold text-green-400">
                {generatedTests.split('describe(').length - 1}
              </div>
              <div className="text-gray-400 text-xs sm:text-sm mt-1">Test Suites</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <div className="text-2xl sm:text-3xl font-bold text-yellow-400">
                {generatedTests.split('\n').length}
              </div>
              <div className="text-gray-400 text-xs sm:text-sm mt-1">Lines of Tests</div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <div className="text-2xl sm:text-3xl font-bold text-purple-400">
                {Math.round(generatedTests.length / 1024 * 100) / 100}
              </div>
              <div className="text-gray-400 text-xs sm:text-sm mt-1">KB</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestGenerator;
