
import React, { useState } from 'react';
import { Toast } from '../components/Toast';

const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>;

const ColorCard: React.FC<{ name: string, hex: string, usage: string, dark?: boolean }> = ({ name, hex, usage, dark }) => {
    const [toast, setToast] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(hex);
        setToast(true);
        setTimeout(() => setToast(false), 2000);
    };
    return (
        <div className="group relative">
            {toast && <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] px-2 py-1 rounded font-bold animate-bounce z-20">COPIED</div>}
            <div 
                onClick={copy}
                className={`h-40 rounded-xl border border-white/10 mb-3 cursor-pointer transition-transform hover:scale-[1.02] active:scale-95 shadow-2xl relative overflow-hidden`}
                style={{ backgroundColor: hex }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all text-black/50"><CopyIcon /></div>
            </div>
            <h4 className="text-white font-bold text-sm flex items-center justify-between">
                {name} 
                <span className="font-mono text-[10px] text-gray-500">{hex}</span>
            </h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{usage}</p>
        </div>
    );
};

const BrandingKit: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
  return (
    <div className="bg-[#030303] text-white min-h-screen pb-32">
      {/* 1. THE AWAKENING: HEADER */}
      <section className="relative pt-20 pb-32 overflow-hidden border-b border-white/5">
        <div className="retro-grid opacity-20"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
            <div className="inline-block px-4 py-1 rounded-full border border-purple-500/30 bg-purple-900/10 mb-8 animate-pulse">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.4em]">Identity Protocol v3.0.4</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6">
                OPUS MAGNUM<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 via-white to-gray-500">BRANDING KIT.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                Die visuelle und tonale Verfassung unseres digitalen Ökosystems. <br/>
                Hier trifft <span className="text-white font-medium">strategische Präzision</span> auf <span className="text-purple-400 font-medium">algorithmische Ästhetik</span>.
            </p>
        </div>
      </section>

      <div className="container mx-auto px-6 mt-24 space-y-32">
        
        {/* 2. THE CHROMATIC MATRIX */}
        <section>
            <div className="flex items-baseline gap-4 mb-12 border-b border-white/10 pb-6">
                <h2 className="text-3xl font-bold tracking-tighter uppercase font-mono text-white">01. Die Farb-Matrix</h2>
                <span className="text-xs text-gray-600 font-mono tracking-widest">CHROMATIC_CORE</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <ColorCard name="Magnum Black" hex="#030303" usage="Die fundamentale Basis. Stabilität, Tiefe und Autorität." />
                <ColorCard name="Neural White" hex="#F5F5F5" usage="Präzision und Klarheit. Wird für Typografie und Akzente genutzt." />
                <ColorCard name="Aurora Purple" hex="#A855F7" usage="Die Farbe der Intelligenz. Markiert aktive KI-Prozesse." />
                <ColorCard name="Strategy Blue" hex="#3B82F6" usage="Logik und Analyse. Markiert Daten-Aktivierungen." />
            </div>
        </section>

        {/* 3. THE TYPOGRAPHY ENGINE */}
        <section className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
                <div className="flex items-baseline gap-4 mb-8 border-b border-white/10 pb-6">
                    <h2 className="text-3xl font-bold tracking-tighter uppercase font-mono text-white">02. Typografie</h2>
                    <span className="text-xs text-gray-600 font-mono tracking-widest">TYPE_ARCH</span>
                </div>
                <div className="space-y-8">
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                        <h4 className="text-[10px] text-gray-500 uppercase tracking-widest mb-4 font-mono">Primary: Inter</h4>
                        <p className="text-5xl font-bold tracking-tighter text-white">Aa Bb Cc Dd</p>
                        <p className="text-sm text-gray-400 mt-4 leading-relaxed font-light">
                            Inter wurde für maximale Lesbarkeit auf Bildschirmen entwickelt. Sie vermittelt Modernität und Zuverlässigkeit. Wird für alle Headlines und UI-Elemente verwendet.
                        </p>
                    </div>
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 font-mono">
                        <h4 className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Secondary: JetBrains Mono</h4>
                        <p className="text-3xl text-green-400">const system = 'online';</p>
                        <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                            Die Schrift der Erschaffer. Wird für technische Daten, Logs und System-Statusmeldungen verwendet, um den "Engine"-Charakter zu unterstreichen.
                        </p>
                    </div>
                </div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-12 h-full">
                <h3 className="text-xl font-bold mb-8 font-mono opacity-50">Scale & Hierarchy</h3>
                <div className="space-y-10">
                    <div>
                        <span className="text-[10px] text-purple-500 font-mono mb-2 block">Display L</span>
                        <h1 className="text-6xl font-bold tracking-tighter">System Ready.</h1>
                    </div>
                    <div>
                        <span className="text-[10px] text-purple-500 font-mono mb-2 block">Heading M</span>
                        <h2 className="text-3xl font-bold tracking-tight">The Neural Architecture.</h2>
                    </div>
                    <div>
                        <span className="text-[10px] text-purple-500 font-mono mb-2 block">Body Regular</span>
                        <p className="text-base text-gray-400 leading-relaxed font-light">
                            Die Demokratisierung von C-Level Strategie durch KI-Agenten ermöglicht exponentielles Wachstum für Interim Manager und Brands.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* 4. THE VOICE OF MAGNUM */}
        <section>
            <div className="flex items-baseline gap-4 mb-12 border-b border-white/10 pb-6">
                <h2 className="text-3xl font-bold tracking-tighter uppercase font-mono text-white">03. Brand Voice</h2>
                <span className="text-xs text-gray-600 font-mono tracking-widest">TONAL_DNA</span>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="p-8 bg-[#0A0A0A] border border-white/10 rounded-2xl">
                    <h4 className="font-bold text-white mb-4 text-xl">Autoritär</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">Wir sprechen nicht über Möglichkeiten, sondern über Resultate. Unsere Sprache ist direkt, präzise und frei von Marketing-Floskeln.</p>
                </div>
                <div className="p-8 bg-[#0A0A0A] border border-white/10 rounded-2xl">
                    <h4 className="font-bold text-white mb-4 text-xl">Inspirierend</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">Wir zeigen die Zukunft auf. Wir nutzen Metaphern aus der Architektur und der Quantenphysik, um Komplexität greifbar zu machen.</p>
                </div>
                <div className="p-8 bg-[#0A0A0A] border border-white/10 rounded-2xl">
                    <h4 className="font-bold text-white mb-4 text-xl">Technisch-Elegant</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">Wir verbergen unsere Herkunft nicht. Die Verbindung aus Code und Kunst spiegelt sich in jeder Botschaft wider.</p>
                </div>
            </div>
        </section>

        {/* 5. AI IMAGERY & PROMPTING */}
        <section className="bg-gradient-to-br from-purple-900/20 to-blue-900/10 rounded-3xl p-12 border border-purple-500/20">
             <div className="flex items-baseline gap-4 mb-12 border-b border-white/10 pb-6">
                <h2 className="text-3xl font-bold tracking-tighter uppercase font-mono text-white">04. Visual Synthesis</h2>
                <span className="text-xs text-purple-400 font-mono tracking-widest">IMAGEN_4_GUIDE</span>
            </div>
            <div className="grid lg:grid-cols-2 gap-16">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-6">Wie wir die KI sehen lassen.</h3>
                    <p className="text-gray-400 leading-relaxed mb-8">
                        Bilder sind bei OPUS MAGNUM keine Stockfotos, sondern visuelle Manifestationen von Datenströmen. Wir nutzen die **Imagen 4 Engine**, um High-End-Assets zu kreieren, die unsere Marken-DNA atmen.
                    </p>
                    <div className="space-y-4">
                        <div className="bg-black/50 p-4 rounded-xl border border-white/5 font-mono text-xs">
                            <span className="text-purple-400 block mb-2">// THE MASTER PROMPT</span>
                            <p className="text-gray-300">
                                "Cinematic high-contrast shot, futuristic workspace, neon purple lighting accents, minimalist architecture, hyper-detailed glass textures, 8k resolution, global illumination, sleek technical aesthetic..."
                            </p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-square bg-gray-800 rounded-2xl border border-white/10 overflow-hidden relative group">
                        <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-100 transition-opacity font-mono text-[10px] text-center p-4">[VISUAL_EXAMPLE_01]<br/>Minimalsm & Logic</div>
                    </div>
                    <div className="aspect-square bg-gray-800 rounded-2xl border border-white/10 overflow-hidden relative group">
                        <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-100 transition-opacity font-mono text-[10px] text-center p-4">[VISUAL_EXAMPLE_02]<br/>Neural Flow & Energy</div>
                    </div>
                </div>
            </div>
        </section>

        {/* FINAL CTA */}
        <section className="text-center py-20">
             <h2 className="text-3xl font-bold mb-8">Bereit für die Transformation?</h2>
             <button 
                onClick={() => navigateTo('einreichung')}
                className="bg-white text-black px-12 py-5 rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
             >
                 System Initialisieren
             </button>
        </section>
      </div>
    </div>
  );
};

export default BrandingKit;
