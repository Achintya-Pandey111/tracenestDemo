import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Playground from './components/Playground';
import CodeExamples from './components/CodeExamples';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-zinc-100 selection:bg-brand-primary/30 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Playground />
        <Features />
        <CodeExamples />
      </main>
      <Footer />
    </div>
  );
}
