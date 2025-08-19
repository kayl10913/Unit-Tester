import React, { useState } from 'react';
import Header from './components/Header.jsx';
import CodeEditor from './components/CodeEditor.jsx';
import TestGenerator from './components/TestGenerator.jsx';
import VulnerabilityChecker from './components/VulnerabilityChecker.jsx';
import TestRunner from './components/TestRunner.jsx';
import { Code, TestTube, Shield, Play } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('editor');
  const [sourceCode, setSourceCode] = useState('');
  const [generatedTests, setGeneratedTests] = useState('');
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: 'editor', label: 'Code Editor', icon: Code },
    { id: 'tests', label: 'Test Generator', icon: TestTube },
    { id: 'security', label: 'Vulnerability Checker', icon: Shield },
    { id: 'runner', label: 'Test Runner', icon: Play },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="glass-dark rounded-2xl p-2 mb-8 shadow-2xl">
          <div className="flex space-x-1">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 border border-blue-500/30 shadow-lg'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/30'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon size={20} className="animate-fade-in-up" />
                  <span className="animate-fade-in-up">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'editor' && (
            <div className="animate-fade-in-up">
              <CodeEditor
                sourceCode={sourceCode}
                setSourceCode={setSourceCode}
              />
            </div>
          )}
          
          {activeTab === 'tests' && (
            <div className="animate-fade-in-up">
              <TestGenerator
                sourceCode={sourceCode}
                generatedTests={generatedTests}
                setGeneratedTests={setGeneratedTests}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
          )}
          
          {activeTab === 'security' && (
            <div className="animate-fade-in-up">
              <VulnerabilityChecker
                sourceCode={sourceCode}
                vulnerabilities={vulnerabilities}
                setVulnerabilities={setVulnerabilities}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
          )}
          
          {activeTab === 'runner' && (
            <div className="animate-fade-in-up">
              <TestRunner
                sourceCode={sourceCode}
                generatedTests={generatedTests}
                testResults={testResults}
                setTestResults={setTestResults}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
