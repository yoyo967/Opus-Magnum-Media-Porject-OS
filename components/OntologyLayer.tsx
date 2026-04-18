
import React from 'react';

const OntologyLayer: React.FC = () => {
  return (
    <section className="py-32 bg-[#050505] relative overflow-hidden border-t border-white/5">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.03),transparent_70%)] pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-6">
                The Architecture of Reality.
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
                If the room is a digital world, then Project OS is the translator. <br/>
                We synchronize your <span className="text-white">human intent</span> with the <span className="text-purple-400">algorithmic logic</span> of the market.
            </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
            {/* Connection Line through all layers */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500 to-transparent -translate-x-1/2 z-0 opacity-50"></div>

            {/* LAYER 1: THE REAL WORLD (HUMAN) */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24 group">
                <div className="text-right pr-12 md:border-r md:border-white/10 md:py-8">
                    <h3 className="text-2xl font-bold text-white mb-2">The Real World</h3>
                    <p className="text-sm text-gray-400 font-mono uppercase tracking-widest mb-4">The Origin (Source)</p>
                    <p className="text-gray-500 leading-relaxed">
                        Here exists you. Your company. Your **ideas**, **desires**, and **goals**.
                        This is the only layer that possesses true creativity and empathy.
                    </p>
                </div>
                <div className="pl-12 relative">
                    <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-4 border-black shadow-[0_0_20px_rgba(255,255,255,0.8)] z-20"></div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-bold">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                            </div>
                            <span className="text-lg font-semibold text-white">The Human (Interim Manager)</span>
                        </div>
                        <div className="space-y-2">
                            <div className="h-2 w-3/4 bg-white/20 rounded-full"></div>
                            <div className="h-2 w-1/2 bg-white/10 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LAYER 2: THE INTERMEDIARY (OS) */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24 group">
                <div className="order-2 md:order-1 pr-12 relative">
                     <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-purple-500 rounded-full border-4 border-black shadow-[0_0_20px_rgba(168,85,247,0.8)] z-20 animate-pulse"></div>
                     <div className="bg-purple-900/10 border border-purple-500/30 p-6 rounded-xl backdrop-blur-sm hover:bg-purple-900/20 transition-colors text-right">
                        <div className="flex items-center gap-4 mb-4 justify-end">
                            <span className="text-lg font-semibold text-purple-200">AI & Algorithms</span>
                            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456-2.456zM18.259 15.715L18 14.75l-.259 1.035a3.375 3.375 0 00-2.455 2.456L14.25 18l1.036.259a3.375 3.375 0 002.455 2.456L18 21.75l.259-1.035a3.375 3.375 0 00-2.456-2.456z" /></svg>
                            </div>
                        </div>
                        <div className="space-y-2 flex flex-col items-end">
                            <div className="h-2 w-full bg-purple-500/40 rounded-full"></div>
                            <div className="h-2 w-2/3 bg-purple-500/20 rounded-full"></div>
                        </div>
                    </div>
                </div>
                <div className="order-1 md:order-2 pl-12 md:border-l md:border-white/10 md:py-8">
                    <h3 className="text-2xl font-bold text-purple-400 mb-2">The Intermediary World</h3>
                    <p className="text-sm text-gray-500 font-mono uppercase tracking-widest mb-4">The Translator (Processing)</p>
                    <p className="text-gray-400 leading-relaxed">
                        The **Project OS**. Here, human desires are transformed into machine-readable commands.
                        **Tools** like Strategist and Visionary are the interface that translates intention into code.
                    </p>
                </div>
            </div>

            {/* LAYER 3: THE DIGITAL WORLD (MARKET) */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center group">
                <div className="text-right pr-12 md:border-r md:border-white/10 md:py-8">
                    <h3 className="text-2xl font-bold text-blue-400 mb-2">The Digital World</h3>
                    <p className="text-sm text-gray-500 font-mono uppercase tracking-widest mb-4">The Space (Target)</p>
                    <p className="text-gray-500 leading-relaxed">
                        The Internet. The Market. Here live the **segments**, data, and target audiences.
                        It is a matrix of **Online Marketing Signals** that we precisely target through the OS.
                    </p>
                </div>
                <div className="pl-12 relative">
                    <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-black shadow-[0_0_20px_rgba(59,130,246,0.8)] z-20"></div>
                    <div className="grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-blue-900/5 border border-blue-500/20 p-3 rounded-lg flex items-center justify-center">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                                <span className="text-xs text-blue-300 font-mono">SEGMENT_0{i}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};

export default OntologyLayer;
