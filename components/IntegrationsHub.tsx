
import React, { useState, useEffect } from 'react';

// --- ICONS ---
const CloudIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.407 9.75 9.75 0 00-15.873 0A3.75 3.75 0 002.25 15z" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>;
const ExclamationCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" /></svg>;
const RefreshIcon = ({ spin }: { spin?: boolean }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 ${spin ? 'animate-spin' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691v4.992h4.992m-4.993 0l3.181-3.183a8.25 8.25 0 00-11.667 0l3.181 3.183" /></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>;

interface Integration {
    id: string;
    name: string;
    category: 'Marketing Cloud' | 'CRM & Sales' | 'Infrastructure';
    status: 'connected' | 'disconnected' | 'syncing' | 'error';
    latency: string;
    lastSync: string;
    description: string;
}

const INITIAL_INTEGRATIONS: Integration[] = [
    { id: 'gads', name: 'Google Ads', category: 'Marketing Cloud', status: 'connected', latency: '45ms', lastSync: 'Just now', description: 'Real-time bid management & conversion tracking.' },
    { id: 'ga4', name: 'Google Analytics 4', category: 'Marketing Cloud', status: 'connected', latency: '22ms', lastSync: 'Streaming', description: 'User behavior event streaming to BigQuery.' },
    { id: 'dv360', name: 'Display & Video 360', category: 'Marketing Cloud', status: 'disconnected', latency: '-', lastSync: '-', description: 'Programmatic ad buying and creative management.' },
    { id: 'bq', name: 'BigQuery Warehouse', category: 'Infrastructure', status: 'connected', latency: '12ms', lastSync: 'Real-time', description: 'Central data lake for all marketing telemetry.' },
    { id: 'vertex', name: 'Vertex AI', category: 'Infrastructure', status: 'connected', latency: '85ms', lastSync: 'On Demand', description: 'ML model training and prediction endpoint.' },
    { id: 'salesforce', name: 'Salesforce CRM', category: 'CRM & Sales', status: 'disconnected', latency: '-', lastSync: '-', description: 'Customer data synchronization and lead scoring.' },
    { id: 'hubspot', name: 'HubSpot', category: 'CRM & Sales', status: 'disconnected', latency: '-', lastSync: '-', description: 'Inbound marketing automation and email logging.' },
];

export const IntegrationsHub: React.FC<{ isEmbedded?: boolean }> = ({ isEmbedded }) => {
    const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);
    const [connectingId, setConnectingId] = useState<string | null>(null);

    const toggleConnection = (id: string) => {
        const integration = integrations.find(i => i.id === id);
        if (!integration) return;

        if (integration.status === 'connected') {
            setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: 'disconnected', latency: '-', lastSync: '-' } : i));
        } else {
            setConnectingId(id);
            setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: 'syncing' } : i));
            
            // Simulate connection process
            setTimeout(() => {
                setIntegrations(prev => prev.map(i => i.id === id ? { 
                    ...i, 
                    status: 'connected', 
                    latency: `${Math.floor(Math.random() * 80 + 20)}ms`, 
                    lastSync: 'Just now' 
                } : i));
                setConnectingId(null);
            }, 2000);
        }
    };

    const categories = Array.from(new Set(integrations.map(i => i.category)));

    return (
        <div className={`bg-[#0A0A0A] h-full flex flex-col text-white ${isEmbedded ? '' : 'p-6 rounded-lg border border-[#333]'}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#111]">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-3">
                        <CloudIcon /> Data Pipes
                    </h2>
                    <p className="text-xs text-gray-500 mt-1 font-mono">GLOBAL_DATA_INGESTION_LAYER // V3.0</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-green-500">GATEWAY: ONLINE</span>
                    </div>
                    <div className="text-gray-500">
                        THROUGHPUT: 1.4 GB/s
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {categories.map(cat => (
                    <div key={cat}>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 pl-1 border-l-2 border-purple-500">{cat}</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {integrations.filter(i => i.category === cat).map(integration => (
                                <div 
                                    key={integration.id} 
                                    className={`group relative p-4 rounded-lg border transition-all duration-300 ${integration.status === 'connected' ? 'bg-[#0f0f0f] border-green-900/30 hover:border-green-500/50' : 'bg-[#050505] border-white/5 hover:border-white/20'}`}
                                >
                                    {/* Connecting Overlay */}
                                    {connectingId === integration.id && (
                                        <div className="absolute inset-0 bg-black/80 z-10 flex items-center justify-center backdrop-blur-sm rounded-lg">
                                            <div className="text-center">
                                                <RefreshIcon spin />
                                                <p className="text-xs text-green-400 mt-2 font-mono">HANDSHAKE_INIT...</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-md flex items-center justify-center border ${integration.status === 'connected' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                                                <LinkIcon />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-200">{integration.name}</h4>
                                                <p className="text-[10px] text-gray-500">{integration.id.toUpperCase()}</p>
                                            </div>
                                        </div>
                                        
                                        <button 
                                            onClick={() => toggleConnection(integration.id)}
                                            className={`text-xs px-3 py-1 rounded-full border transition-colors ${integration.status === 'connected' ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20' : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'}`}
                                        >
                                            {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                                        </button>
                                    </div>

                                    <p className="text-xs text-gray-500 mb-4 h-8 leading-relaxed">{integration.description}</p>

                                    <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[10px] font-mono">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-gray-600">LATENCY:</span>
                                                <span className={integration.status === 'connected' ? 'text-green-400' : 'text-gray-600'}>{integration.latency}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-gray-600">SYNC:</span>
                                                <span className={integration.status === 'connected' ? 'text-blue-400' : 'text-gray-600'}>{integration.lastSync}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {integration.status === 'connected' ? <CheckCircleIcon /> : integration.status === 'error' ? <ExclamationCircleIcon /> : <div className="w-2 h-2 rounded-full bg-gray-700"></div>}
                                            <span className={`uppercase ${integration.status === 'connected' ? 'text-green-500' : 'text-gray-600'}`}>{integration.status}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Data Flow Animation Line */}
                                    {integration.status === 'connected' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50 animate-pulse"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
