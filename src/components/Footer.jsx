import React, { useState } from 'react';
import { CONFIG } from '../config';
import { Layers, ExternalLink, Github, Heart, Info, X } from 'lucide-react';

export default function Footer() {
  const [showGithubModal, setShowGithubModal] = useState(false);

  const handleGithubClick = (e) => {
    if (!CONFIG.githubUrl || CONFIG.githubUrl.includes('placeholder-user') || CONFIG.githubUrl === '') {
      e.preventDefault();
      setShowGithubModal(true);
    }
  };

  return (
    <>
      <footer className="border-t border-white/5 bg-dark-950 text-zinc-400 font-sans text-xs pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/5">
            
            {/* Col 1: Brand & Desc */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent p-0.5">
                  <div className="w-full h-full bg-dark-950 rounded-[6px] flex items-center justify-center">
                    <Layers className="w-4 h-4 text-brand-primary" />
                  </div>
                </div>
                <span className="font-bold text-base text-white font-mono tracking-tight">
                  TraceNest
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                  v{CONFIG.version}
                </span>
              </div>

              <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
                Lightweight, zero-dependency async execution tracing, nested operation monitoring, and performance analysis library for Node.js developers.
              </p>

              <div className="pt-2 text-[11px] text-zinc-400 font-mono">
                Engine requirement: Node.js {CONFIG.nodeVersion}
              </div>
            </div>

            {/* Col 2: Package & Links */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] font-mono">
                Package Resources
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a
                    href={CONFIG.npmUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center space-x-1"
                  >
                    <span>npm: {CONFIG.packageName}</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </a>
                </li>
                <li>
                  <a
                    href={CONFIG.githubUrl || CONFIG.githubPlaceholder}
                    onClick={handleGithubClick}
                    className="hover:text-white transition-colors flex items-center space-x-1"
                  >
                    <span>GitHub Repository</span>
                    <Github className="w-3 h-3 text-zinc-500" />
                  </a>
                </li>
                <li>
                  <a
                    href={CONFIG.author.npmProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Maintainer Profile
                  </a>
                </li>
                <li>
                  <a
                    href="https://nodejs.org/api/async_context.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center space-x-1"
                  >
                    <span>Node.js AsyncLocalStorage Docs</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Navigation */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] font-mono">
                Navigation
              </h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#overview" className="hover:text-white transition-colors">Overview</a></li>
                <li><a href="#playground" className="hover:text-white transition-colors">Interactive Playground</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features & Architecture</a></li>
                <li><a href="#docs" className="hover:text-white transition-colors">Code Examples & DX</a></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
            <div>
              © 2026 {CONFIG.author.name}. Released under the <span className="text-zinc-300 font-medium">{CONFIG.license} License</span>.
            </div>

            <div className="flex items-center space-x-4">
              <span>Production-ready demo website</span>
              <span>•</span>
              <span className="font-mono text-zinc-400">Vercel Serverless Ready</span>
            </div>
          </div>

        </div>
      </footer>

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
                <h3 className="text-base font-semibold text-white">Configurable GitHub Repository</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Centralized in <code className="text-indigo-300">src/config.js</code>.
                </p>
              </div>
            </div>
            <div className="bg-dark-950 p-3 rounded-lg border border-zinc-800 font-mono text-xs text-zinc-300 mb-4">
              <span className="text-zinc-500">// File:</span> src/config.js<br />
              <span className="text-indigo-400">githubUrl</span>: <span className="text-emerald-300">'https://github.com/your-username/tracenest-demo'</span>
            </div>
            <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
              When ready, push this codebase to your GitHub repository and set the URL in <code className="text-indigo-300">src/config.js</code>.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowGithubModal(false)}
                className="px-4 py-2 text-xs font-medium bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
