import React, { useState } from 'react';
import { useTasks } from '../contexts/AppContext';

interface AuthProps {
    navigateTo: (page: string) => void;
}

const Auth: React.FC<AuthProps> = ({ navigateTo }) => {
    const { login, register, authError } = useTasks();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (email && password) {
                if (isLogin) {
                    await login(email, password);
                } else {
                    await register(email, password);
                }
                navigateTo('settings'); // Right after auth, go to settings to check/set API KEY
            }
        } catch (error) {
            // Error is handled in contexts
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-900/20 blur-[100px] rounded-full"></div>
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-900/20 blur-[100px] rounded-full"></div>

                <div className="relative z-10 text-center mb-8">
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                        {isLogin ? "System Access" : "Initialize Tenant"}
                    </h2>
                    <p className="text-gray-400 text-sm font-mono">
                        OPUS MAGNUM MEDIA® INFRASTRUCTURE
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                    {authError && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
                            {authError}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Email Identity</label>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="operator@opus-magnum.local"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Security Token (Password)</label>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-white text-black font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        {isLogin ? "Authenticate" : "Register Tenant"}
                    </button>
                </form>

                <div className="relative z-10 mt-6 text-center">
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-gray-500 hover:text-white transition-colors"
                    >
                        {isLogin ? "Create a new tenant system" : "Access existing system"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Auth;
