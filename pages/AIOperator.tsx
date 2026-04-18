
import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Architecture, 
  Network, 
  Terminal, 
  Target, 
  Activity, 
  Award,
  Box,
  Cpu,
  Zap
} from 'lucide-react';

interface EpochCardProps {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  icon: React.ReactNode;
  delay: number;
}

const EpochCard: React.FC<EpochCardProps> = ({ number, title, subtitle, description, tags, icon, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="group relative"
  >
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#A855F7]/30 to-blue-500/30 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
    <div className="relative bg-[#0D0D0D] border border-white/5 rounded-lg p-8 h-full flex flex-col items-start hover:border-[#A855F7]/50 transition-colors duration-500">
      <div className="flex justify-between items-start w-full mb-6">
        <div className="p-3 bg-[#A855F7]/10 rounded-lg text-[#A855F7]">
          {icon}
        </div>
        <span className="font-mono text-xs text-gray-500">{number}</span>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-[#A855F7] text-sm font-medium mb-4 italic tracking-tight">{subtitle}</p>
      <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">{description}</p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {tags.map((tag, i) => (
          <span key={i} className="text-[10px] uppercase tracking-widest px-2 py-1 bg-white/5 border border-white/10 text-gray-400 rounded">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);

const AIOperator: React.FC<{ navigateTo: (page: string) => void }> = ({ navigateTo }) => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] overflow-hidden relative">
      {/* Background Infrastructure */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#A855F722_0%,transparent_50%)]"></div>
        <div className="retro-grid"></div>
      </div>

      <div className="container mx-auto px-6 py-24 relative z-10">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-block px-3 py-1 mb-6 rounded-full border border-[#A855F7]/30 bg-[#A855F7]/10 text-[#A855F7] text-[10px] font-mono tracking-[0.3em] uppercase"
          >
            Digital Interim C-Level Architecture
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter"
          >
            Yahya Yildirim
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed max-w-3xl mx-auto"
          >
            Operator-Architekt mit drei Ebenen der Wirksamkeit: <br />
            <span className="text-white font-medium">Operation</span> · <span className="text-white font-medium">Extension</span> · <span className="text-white font-medium">Network</span>
          </motion.p>
        </div>

        {/* The Three Epochs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          <EpochCard 
            number="EPOCHE I"
            title="Proof of Operation"
            subtitle="The Foundations of Logic"
            description="Restrukturierung und Refinanzierung einer deutschen Logistik GmbH als Interim Manager mit voller Vollmacht und eigener Bonität in den 2000er Jahren. Operative Stabilisierung und Gründung weiterer Unternehmungen."
            tags={['OPC Overnight', 'Interim Management', 'Logistics', 'Refinancing']}
            icon={<Activity className="w-6 h-6" />}
            delay={0.6}
          />
          <EpochCard 
            number="EPOCHE II"
            title="Proof of Extension"
            subtitle="The Era of Directed Intelligence"
            description="Aufbau einer AI-nativen Architektur-Holding seit 2023. Entwicklung von OPUS MAGNUM als deployten Operating System für professionelle Exzellenz. Co-Creation mit modernsten LLM-Architekturen."
            tags={['Opus Magnum', 'AI-Native Architecture', 'Directed Intelligence', 'System OS']}
            icon={<Cpu className="w-6 h-6" />}
            delay={0.8}
          />
          <EpochCard 
            number="EPOCHE III"
            title="Proof of Network"
            subtitle="The Yildirim Operator Network"
            description="Architekt des Yildirim Operator Netzwerks. Ein synergetisches Ökosystem aus physischer Logistik (OPC) und digitalen Wachstums-Architekturen (LYGOX, MASTER-X) unter dem Banner der OMM-Logik."
            tags={['Yildirim Network', 'SaaS Architecture', 'Ecosystem Architect', 'Strategic Impulse']}
            icon={<Network className="w-6 h-6" />}
            delay={1.0}
          />
        </div>

        {/* Strategic Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-xs font-mono text-[#A855F7] tracking-[0.4em] uppercase mb-4">The Methodology</h2>
              <h3 className="text-3xl font-bold text-white mb-6">Der Start-Impuls</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Yahyas charakteristische Operator-Methode ist die gezielte Aktivierung von Menschen in seinem Umfeld — ein Start-Impuls, der nicht als Anleitung oder Vorgabe funktioniert, sondern als Öffnung.
              </p>
              <div className="p-6 bg-white/5 border border-white/10 rounded-lg italic text-gray-300">
                "Der Empfänger durchläuft den Weg selbst, und was zurückkommt, ist autonome Kompetenz, nicht Anleitungs-Ergebnis."
              </div>
            </div>

            <div>
              <h2 className="text-xs font-mono text-[#A855F7] tracking-[0.4em] uppercase mb-4">Positioning Principle</h2>
              <h3 className="text-3xl font-bold text-white mb-6">Anwerbung statt Bewerbung</h3>
              <div className="space-y-4">
                {[
                  { title: "Infrastruktur statt Lebenslauf", desc: "Systeme sprechen lauter als Listen." },
                  { title: "Dokumentation statt Selbstvermarktung", desc: "Die Architektur beweist die Kompetenz." },
                  { title: "Geduld statt Eile", desc: "Strategischer Zeithorizont bis 2030." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#A855F7]"></div>
                    <div>
                      <h4 className="text-white font-medium">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-10 rounded-2xl relative border-[#A855F7]/20"
          >
             <h2 className="text-xs font-mono text-[#A855F7] tracking-[0.4em] uppercase mb-8">Recruitment Matrix</h2>
             <div className="space-y-6">
               {[
                 { code: "A", title: "Rückkehr OPC-Gruppe", desc: "Geschäftsführender Gesellschafter / Holding-Architekt" },
                 { code: "B", title: "Interim Operator / CAIO", desc: "Mittelstand, 6-24 Monate Mandat" },
                 { code: "C", title: "Co-Founder / Residence", desc: "Venture-Strukturen & Operator-in-Residence" },
                 { code: "D", title: "Advisory / Board", desc: "Strategische Begleitung auf Board-Ebene" },
                 { code: "E", title: "System Investment", desc: "Investment in OMM- oder Netzwerk-Module" }
               ].map((item, i) => (
                 <div key={i} className="group flex items-center gap-6 p-4 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-[#A855F7]/30 transition-all">
                   <div className="w-10 h-10 flex items-center justify-center rounded bg-black border border-white/10 font-mono text-[#A855F7] group-hover:bg-[#A855F7] group-hover:text-black transition-colors">
                     {item.code}
                   </div>
                   <div>
                     <h4 className="text-white font-bold">{item.title}</h4>
                     <p className="text-xs text-gray-500 uppercase tracking-wider">{item.desc}</p>
                   </div>
                 </div>
               ))}
             </div>
             
             <div className="mt-12 pt-8 border-t border-white/1 border-dashed">
                <div className="flex items-center gap-3 text-[#A855F7] mb-4">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-widest">Compliance Ready</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Alle Systeme (OMM & Yildirim Network) sind Art. 50 Transparenz-Ready nach EU AI Act und ISO-27001-aligned konzipiert.
                </p>
             </div>
          </motion.div>
        </div>

        {/* Footer Info */}
        <div className="pt-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 grayscale">
           <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
              <span>YAHYA YILDIRIM</span>
              <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
              <span>BERLIN</span>
              <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
              <span>APRIL 2026</span>
           </div>
           <div className="text-[10px] text-gray-600 uppercase tracking-[0.2em]">
             Status: Operator-Architecture Active
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIOperator;
