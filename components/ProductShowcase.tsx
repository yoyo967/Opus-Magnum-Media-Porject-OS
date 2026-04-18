
import React, { useState } from 'react';

type Tab = 'strategy' | 'creation' | 'orchestration';

const ProductShowcase: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('strategy');

    const TabButton: React.FC<{ tabId: Tab, title: string, subtitle: string }> = ({ tabId, title, subtitle }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`text-left p-6 rounded-xl transition-all duration-300 w-full border ${activeTab === tabId ? 'bg-white/10 border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.5)]' : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'}`}
        >
            <h4 className={`font-bold text-lg ${activeTab === tabId ? 'text-white' : 'text-gray-400'}`}>{title}</h4>
            <p className={`text-sm mt-2 font-light ${activeTab === tabId ? 'text-gray-300' : 'text-gray-500'}`}>{subtitle}</p>
        </button>
    );
    
    // Mock UI components for animations
    const MockUI: React.FC<{ activeTab: Tab }> = ({ activeTab }) => (
      <div className="w-full h-full bg-[#050505] rounded-xl p-1 border border-white/10 relative overflow-hidden shadow-2xl">
        {/* Window Frame */}
        <div className="bg-[#111] h-8 w-full flex items-center px-4 border-b border-white/5 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
            <div className="ml-auto text-[10px] font-mono text-gray-600">OPUS_OS_KERNEL_V3.0</div>
        </div>

        <div className="p-6 h-[calc(100%-32px)] bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.03),transparent_70%)] relative">
            <style>{`
            @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            @keyframes grow { from { height: 0; } to { height: 100%; } }
            .mock-item { animation: slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}</style>
            
            {activeTab === 'strategy' && (
            <div className="space-y-4 h-full flex flex-col">
                <div className="flex gap-4 mb-4">
                    <div className="w-1/3 h-24 bg-purple-900/10 border border-purple-500/20 rounded-lg p-3 mock-item" style={{ animationDelay: '0.1s' }}>
                        <div className="w-8 h-8 bg-purple-500/20 rounded-full mb-2"></div>
                        <div className="h-2 w-12 bg-purple-500/20 rounded"></div>
                    </div>
                    <div className="w-1/3 h-24 bg-blue-900/10 border border-blue-500/20 rounded-lg p-3 mock-item" style={{ animationDelay: '0.2s' }}>
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full mb-2"></div>
                        <div className="h-2 w-12 bg-blue-500/20 rounded"></div>
                    </div>
                    <div className="w-1/3 h-24 bg-green-900/10 border border-green-500/20 rounded-lg p-3 mock-item" style={{ animationDelay: '0.3s' }}>
                        <div className="w-8 h-8 bg-green-500/20 rounded-full mb-2"></div>
                        <div className="h-2 w-12 bg-green-500/20 rounded"></div>
                    </div>
                </div>
                <div className="flex-1 bg-gray-900/30 border border-white/5 rounded-lg p-4 mock-item" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-end gap-2 h-full pb-2 border-b border-white/10">
                        {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                            <div key={i} className="flex-1 bg-white/10 rounded-t-sm relative group" style={{ height: `${h}%` }}>
                                <div className="absolute inset-0 bg-purple-500/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-sm"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            )}

            {activeTab === 'creation' && (
            <div className="flex gap-6 h-full">
                <div className="w-1/2 h-full flex flex-col gap-4">
                    <div className="mock-item opacity-0 h-2/3 bg-gray-900/50 border border-white/10 rounded-lg relative overflow-hidden group" style={{ animationDelay: '0.1s' }}>
                        <div className="absolute inset-0 flex items-center justify-center text-gray-700 font-mono text-xs">IMAGE_GENERATING...</div>
                        <div className="absolute bottom-0 left-0 h-1 bg-purple-500 animate-[grow_2s_ease-out_forwards] w-full"></div>
                    </div>
                    <div className="mock-item opacity-0 h-1/3 bg-gray-900/50 border border-white/10 rounded-lg p-3 space-y-2" style={{ animationDelay: '0.2s' }}>
                        <div className="h-2 w-full bg-white/10 rounded"></div>
                        <div className="h-2 w-2/3 bg-white/10 rounded"></div>
                    </div>
                </div>
                <div className="w-1/2 h-full flex flex-col gap-3">
                    {[1,2,3].map((i) => (
                        <div key={i} className="mock-item opacity-0 h-24 bg-gray-800/30 border border-white/5 rounded-lg p-3 flex gap-3 items-center" style={{ animationDelay: `${0.2 + i*0.1}s` }}>
                            <div className="w-12 h-12 bg-white/5 rounded"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-2 w-3/4 bg-white/10 rounded"></div>
                                <div className="h-2 w-1/2 bg-white/10 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            )}

            {activeTab === 'orchestration' && (
            <div className="h-full flex flex-col gap-4">
                 <div className="flex justify-between items-center mock-item" style={{ animationDelay: '0.1s' }}>
                     <div className="h-8 w-32 bg-white/10 rounded"></div>
                     <div className="h-8 w-8 bg-green-500/20 rounded-full"></div>
                 </div>
                 <div className="flex-1 grid grid-cols-3 gap-4">
                    <div className="bg-gray-900/30 border border-white/5 rounded-lg p-3 space-y-3 mock-item" style={{ animationDelay: '0.2s' }}>
                        <div className="text-[10px] font-mono text-gray-500 uppercase">To Do</div>
                        <div className="h-16 bg-white/5 rounded border border-white/5"></div>
                        <div className="h-16 bg-white/5 rounded border border-white/5"></div>
                    </div>
                    <div className="bg-gray-900/30 border border-white/5 rounded-lg p-3 space-y-3 mock-item" style={{ animationDelay: '0.3s' }}>
                        <div className="text-[10px] font-mono text-gray-500 uppercase">In Progress</div>
                        <div className="h-24 bg-purple-900/20 border border-purple-500/20 rounded relative overflow-hidden">
                            <div className="absolute top-0 left-0 h-1 bg-purple-500 w-1/2"></div>
                        </div>
                    </div>
                    <div className="bg-gray-900/30 border border-white/5 rounded-lg p-3 space-y-3 mock-item" style={{ animationDelay: '0.4s' }}>
                        <div className="text-[10px] font-mono text-gray-500 uppercase">Done</div>
                        <div className="h-16 bg-green-900/10 border border-green-500/10 rounded opacity-50"></div>
                        <div className="h-16 bg-green-900/10 border border-green-500/10 rounded opacity-50"></div>
                        <div className="h-16 bg-green-900/10 border border-green-500/10 rounded opacity-50"></div>
                    </div>
                 </div>
            </div>
            )}
        </div>
      </div>
    );


    return (
        <section className="py-32 bg-[#030303] relative">
             <div className="container mx-auto px-6">
                 <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-5xl font-bold text-white tracking-tight mb-6">Central Command.</h2>
                    <p className="text-xl text-gray-400 font-light">The chaos of 20 tabs, 5 tools, and 3 spreadsheets is over. Welcome to the operating system.</p>
                </div>
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-4 space-y-4">
                        <TabButton tabId="strategy" title="Strategy & Analysis" subtitle="From data point to directive in seconds."/>
                        <TabButton tabId="creation" title="Creation & Assets" subtitle="AI-generated visuals, texts, and videos."/>
                        <TabButton tabId="orchestration" title="Orchestration" subtitle="Kanban, calendar, and auto-publishing."/>
                    </div>
                    <div className="lg:col-span-8 h-[500px]">
                        <MockUI activeTab={activeTab} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductShowcase;
