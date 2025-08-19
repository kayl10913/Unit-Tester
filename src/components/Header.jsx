import React from 'react';
import { Zap, Github, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="glass-dark border-b border-gray-700/50 shadow-2xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg glow-blue animate-pulse-slow">
                <Zap className="text-white" size={28} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient-primary">Unit Testing Generator</h1>
              <p className="text-gray-400 text-sm flex items-center space-x-2">
                <Sparkles size={14} className="text-purple-400" />
                <span>AI-powered testing with vulnerability detection</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-all duration-300 transform hover:scale-105 hover:glow-purple px-3 py-2 rounded-lg hover:bg-gray-700/30"
            >
              <Github size={20} />
              <span className="text-sm font-medium">GitHub</span>
            </a>
            
            <div className="flex items-center space-x-3 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400 font-medium">AI Ready</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
