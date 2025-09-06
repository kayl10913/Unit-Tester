import React from 'react';
import { Zap, Github, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="glass-dark border-b border-gray-700/50 shadow-2xl">
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg glow-blue animate-pulse-slow">
                <Zap className="text-white" size={24} />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gradient-primary truncate">Unit Testing Generator</h1>
              <p className="text-gray-400 text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2">
                <Sparkles size={12} className="text-purple-400 flex-shrink-0" />
                <span className="truncate">AI-powered testing with vulnerability detection</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
            <a
              href="https://github.com/kayl10913/Unit-Tester"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 sm:space-x-2 text-gray-400 hover:text-gray-200 transition-all duration-300 transform hover:scale-105 hover:glow-purple px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-700/30"
            >
              <Github size={18} className="sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-medium hidden sm:inline">GitHub</span>
            </a>
            
            <div className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-green-400 font-medium hidden sm:inline">AI Ready</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
