import React, { useState } from 'react';
import { CONFIG } from '../config';
import { 
  Terminal, 
  ExternalLink, 
  Copy, 
  Check, 
  Github, 
  Menu, 
  X, 
  Layers, 
  Sparkles,
  Info
} from 'lucide-react';

export default function Navbar() {
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);

  const copyInstall = () => {
    navigator.clipboard.writeText(`npm install ${CONFIG.packageName}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGithubClick = (e) => {
    if (!CONFIG.githubUrl || CONFIG.githubUrl.includes('placeholder-user') || CONFIG.githubUrl === '') {
      e.preventDefault();
      setShowGithubModal(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 bg-dark-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Version */}
          <div className="flex items-center space-x-3">
            <a href="#" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent p-0.5 shadow-lg shadow-brand-primary/20 group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-dark-950 rounded-[7px] flex items-center justify-center">
                  <Layers className="w-5 h-5 text-brand-primary group-hover:text-brand-accent transition-colors duration-200" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg tracking-tight text-white font-mono">
                    TraceNest
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                    v{CONFIG.version}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 font-sans hidden sm:inline">
                  Node.js Async Observability
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-300">
            <a href="#overview" className="hover:text-white transition-colors">Overview</a>
            <a href="#playground" className="flex items-center space-x-1.5 text-brand-accent hover:text-cyan-300 transition-colors">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Demo</span>
            </a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#docs" className="hover:text-white transition-colors">Documentation</a>
          </nav>

          {/* Actions & Badges */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Quick Install Pill */}
            <button
              onClick={copyInstall}
              title="Click to copy npm install command"
              className="flex items-center space-x-2 px-3 py-1.5 text-xs font-mono bg-dark-850 hover:bg-dark-800 text-zinc-300 hover:text-white border border-white/10 rounded-md transition-all group"
            >
              <Terminal className="w-3.5 h-3.5 text-brand-primary" />
              <span>npm i {CONFIG.packageName}</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
              )}
            </button>

            {/* npm Badge Link */}
            <a
              href={CONFIG.npmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-md transition-all"
            >
              <span className="font-mono font-bold tracking-wider">npm</span>
              <span className="text-zinc-400">v{CONFIG.version}</span>
              <ExternalLink className="w-3 h-3 text-red-400/70" />
            </a>

            {/* GitHub Button */}
            <a
              href={CONFIG.githubUrl || CONFIG.githubPlaceholder}
              onClick={handleGithubClick}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 border border-zinc-700 rounded-md transition-all"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
              {(!CONFIG.githubUrl || CONFIG.githubUrl === '') && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Configurable in src/config.js" />
              )}
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-zinc-400 hover:text-white hover:bg-dark-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/5 bg-dark-900 px-4 pt-3 pb-5 space-y-3">
            <div className="space-y-1">
              <a
                href="#overview"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:text-white hover:bg-dark-800"
              >
                Overview
              </a>
              <a
                href="#playground"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-brand-accent hover:bg-dark-800"
              >
                Live Demo Playground
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:text-white hover:bg-dark-800"
              >
                Features
              </a>
              <a
                href="#docs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:text-white hover:bg-dark-800"
              >
                Documentation
              </a>
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col space-y-2">
              <button
                onClick={copyInstall}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-mono bg-dark-850 text-zinc-200 border border-white/10 rounded-md"
              >
                <span>npm i {CONFIG.packageName}</span>
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
              </button>

              <div className="flex space-x-2">
                <a
                  href={CONFIG.npmUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 rounded-md"
                >
                  <span>npm package</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={CONFIG.githubUrl || CONFIG.githubPlaceholder}
                  onClick={handleGithubClick}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-xs font-medium bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-md"
                >
                  <Github className="w-3.5 h-3.5 mr-1" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* GitHub URL Configuration Modal */}
      {showGithubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-dark-900 border border-zinc-700 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowGithubModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-start space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-brand-primary">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">GitHub URL Placeholder</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  You can set your public repository URL in a single configuration file.
                </p>
              </div>
            </div>
            <div className="bg-dark-950 p-3 rounded-lg border border-zinc-800 font-mono text-xs text-zinc-300 mb-4">
              <span className="text-zinc-500">// File:</span> src/config.js<br />
              <span className="text-indigo-400">githubUrl</span>: <span className="text-emerald-300">'https://github.com/your-username/tracenest-demo'</span>
            </div>
            <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
              Once you publish this repository to GitHub, simply update the <code className="text-indigo-300">githubUrl</code> field in <code className="text-indigo-300">src/config.js</code> and the button will automatically link directly to your repo.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowGithubModal(false)}
                className="px-4 py-2 text-xs font-medium bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
