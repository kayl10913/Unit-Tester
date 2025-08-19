import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, Clock, BarChart3, TestTube } from 'lucide-react';
import { runTests } from '../services/testRunnerService.js';

const TestRunner = ({ sourceCode, generatedTests, testResults, setTestResults, isLoading, setIsLoading }) => {
  const [testEnvironment, setTestEnvironment] = useState('node');

  const handleRunTests = async () => {
    if (!sourceCode.trim() || !generatedTests.trim()) {
      alert('Please generate tests first before running them!');
      return;
    }

    setIsLoading(true);
    try {
      const results = await runTests(sourceCode, generatedTests, testEnvironment);
      setTestResults(results);
    } catch (error) {
      console.error('Error running tests:', error);
      alert('Failed to run tests. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTestStatusIcon = (status) => {
    switch (status) {
      case 'passed':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'failed':
        return <XCircle size={16} className="text-red-400" />;
      case 'skipped':
        return <Clock size={16} className="text-yellow-400" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getTestStatusColor = (status) => {
    switch (status) {
      case 'passed':
        return 'bg-green-500/10 border-green-500/20 text-green-300';
      case 'failed':
        return 'bg-red-500/10 border-red-500/20 text-red-300';
      case 'skipped':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300';
      default:
        return 'bg-gray-500/10 border-gray-500/20 text-gray-300';
    }
  };

  const getCoveragePercentage = () => {
    if (!testResults) return 0;
    const total = testResults.totalTests || 0;
    const passed = testResults.passedTests || 0;
    return total > 0 ? Math.round((passed / total) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      <div className="card hover-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <TestTube className="text-green-400" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-100">Test Runner</h2>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={testEnvironment}
              onChange={(e) => setTestEnvironment(e.target.value)}
              className="input-field text-sm"
            >
              <option value="node">Node.js</option>
              <option value="browser">Browser</option>
              <option value="jest">Jest Environment</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-3 mb-6">
          <button
            onClick={handleRunTests}
            disabled={!sourceCode.trim() || !generatedTests.trim() || isLoading}
            className="btn-success btn-hover-effect flex items-center space-x-2"
          >
            <Play size={18} />
            <span>{isLoading ? 'Running Tests...' : 'Run Tests'}</span>
          </button>
        </div>

        {(!sourceCode.trim() || !generatedTests.trim()) && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <Clock size={24} className="text-yellow-400" />
              <p className="text-yellow-300">
                Please generate tests in the Test Generator tab first, then come back to run them.
              </p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <span className="text-gray-300 text-lg">Running tests in {testEnvironment} environment<span className="loading-dots"></span></span>
            </div>
          </div>
        )}
      </div>

      {testResults && !isLoading && (
        <>
          <div className="card hover-card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <BarChart3 className="text-blue-400" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-100">Test Results Overview</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-600/50">
                <div className="text-4xl font-bold text-gray-200">{testResults.totalTests || 0}</div>
                <div className="text-gray-400 text-sm mt-2">Total Tests</div>
              </div>
              <div className="text-center p-6 bg-green-500/10 rounded-xl border border-green-500/20">
                <div className="text-4xl font-bold text-green-400">{testResults.passedTests || 0}</div>
                <div className="text-gray-400 text-sm mt-2">Passed</div>
              </div>
              <div className="text-center p-6 bg-red-500/10 rounded-xl border border-red-500/20">
                <div className="text-4xl font-bold text-red-400">{testResults.failedTests || 0}</div>
                <div className="text-gray-400 text-sm mt-2">Failed</div>
              </div>
              <div className="text-center p-6 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <div className="text-4xl font-bold text-blue-400">{getCoveragePercentage()}%</div>
                <div className="text-gray-400 text-sm mt-2">Coverage</div>
              </div>
            </div>
          </div>

          <div className="card hover-card">
            <h3 className="text-lg font-semibold text-gray-100 mb-6">Test Execution Details</h3>
            
            {testResults.executionTime && (
              <div className="mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-600/50">
                <div className="flex items-center space-x-3">
                  <Clock size={20} className="text-gray-400" />
                  <span className="text-gray-300">
                    Execution Time: {testResults.executionTime}ms
                  </span>
                </div>
              </div>
            )}

            {testResults.testSuites && testResults.testSuites.length > 0 && (
              <div className="space-y-6">
                {testResults.testSuites.map((suite, suiteIndex) => (
                  <div key={suiteIndex} className="border border-gray-600/50 rounded-xl overflow-hidden">
                    <div className="bg-gray-800/50 px-6 py-4 border-b border-gray-600/50">
                      <h4 className="font-medium text-gray-200">{suite.name}</h4>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3">
                        {suite.tests.map((test, testIndex) => (
                          <div
                            key={testIndex}
                            className={`flex items-center justify-between p-4 rounded-xl border ${getTestStatusColor(test.status)} hover:scale-[1.02] transition-all duration-300`}
                          >
                            <div className="flex items-center space-x-4">
                              {getTestStatusIcon(test.status)}
                              <div>
                                <p className="font-medium">{test.name}</p>
                                {test.duration && (
                                  <p className="text-sm text-gray-400 mt-1">
                                    Duration: {test.duration}ms
                                  </p>
                                )}
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              test.status === 'passed'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : test.status === 'failed'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            }`}>
                              {test.status.toUpperCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {testResults.errors && testResults.errors.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-200 mb-4">Test Errors</h4>
                <div className="space-y-3">
                  {testResults.errors.map((error, index) => (
                    <div key={index} className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                      <p className="text-sm font-medium text-red-300">{error.test}</p>
                      <p className="text-sm text-red-400 mt-2">{error.message}</p>
                      {error.stack && (
                        <pre className="text-xs text-red-400 mt-3 bg-gray-800/50 p-3 rounded-lg overflow-x-auto border border-gray-600/50">
                          {error.stack}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="card hover-card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <BarChart3 className="text-purple-400" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-gray-100">Coverage Report</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <BarChart3 size={24} className="text-purple-400" />
                <span className="text-gray-300 font-medium">Code Coverage</span>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-4">
                <div
                  className="progress-bar h-4 rounded-full transition-all duration-500"
                  style={{ width: `${getCoveragePercentage()}%` }}
                ></div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                  <div className="text-2xl font-bold text-purple-400">{getCoveragePercentage()}%</div>
                  <div className="text-gray-400 text-sm mt-1">Overall Coverage</div>
                </div>
                <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                  <div className="text-2xl font-bold text-green-400">{testResults.linesCovered || 0}</div>
                  <div className="text-gray-400 text-sm mt-1">Lines Covered</div>
                </div>
                <div className="text-center p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                  <div className="text-2xl font-bold text-yellow-400">{testResults.linesTotal || 0}</div>
                  <div className="text-gray-400 text-sm mt-1">Total Lines</div>
                </div>
                <div className="text-center p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <div className="text-2xl font-bold text-blue-400">{testResults.branchesCovered || 0}</div>
                  <div className="text-gray-400 text-sm mt-1">Branches Covered</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TestRunner;
