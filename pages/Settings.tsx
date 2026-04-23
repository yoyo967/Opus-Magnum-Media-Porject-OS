import React, { useState, useEffect } from 'react';
import { useTasks } from '../contexts/AppContext';

interface SettingsProps {
    navigateTo: (page: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ navigateTo }) => {
    const { geminiApiKey, setGeminiApiKey, userProfile, updateUserProfile } = useTasks();
    const [apiKey, setApiKeyInput] = useState(geminiApiKey || '');
    const [name, setName] = useState(userProfile?.name || '');
    const [role, setRole] = useState(userProfile?.role || 'Operator');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (geminiApiKey) setApiKeyInput(geminiApiKey);
    }, [geminiApiKey]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setGeminiApiKey(apiKey);
        updateUserProfile({
            ...userProfile,
            name: name || 'Operator',
            role: role || 'Operator',
            organization: userProfile?.organization || 'OPUS MAGNUM',
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="min-h-[80vh] p-6 lg:p-12">
            <div className="max-w-3xl mx-auto space-y-12">
                <header className="border-b border-white/10 pb-6">
                    <h1 className="text-4xl font-bold tracking-tight text-white">System Configuration</h1>
                    <p className="text-gray-400 mt-2">Manage your tenant infrastructure and API keys.</p>
                </header>

                <form onSubmit={handleSave} className="space-y-8">
                    {/* API Key Section */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-900/10 blur-[100px] rounded-full pointer-events-none"></div>
                        
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            Neural Uplink (BYOK)
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Gemini API Key</label>
                                <div className="flex gap-4">
                                    <input 
                                        type="password" 
                                        value={apiKey}
                                        onChange={(e) => setApiKeyInput(e.target.value)}
                                        className="flex-grow bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors font-mono text-sm"
                                        placeholder="AIza..."
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Your key is stored <strong>locally in your browser</strong> and is never sent to our servers. It is communicated directly to Google's API.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Section */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900/10 blur-[100px] rounded-full pointer-events-none"></div>
                        
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Operator Identity
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Display Name</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Role/Title</label>
                                <input 
                                    type="text" 
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-6">
                        {saved ? (
                            <span className="text-green-400 flex items-center gap-2 font-mono text-sm animate-[fadeIn_0.3s_ease-out]">
                                <span className="w-2 h-2 bg-green-400 rounded-full"></span> Configuration Saved
                            </span>
                        ) : (
                            <span></span>
                        )}
                        <button 
                            type="submit"
                            className="bg-white text-black font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Save Configuration
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Settings;
