
import React from 'react';

interface FooterLinkProps {
    label: string;
    page?: string;
    href?: string;
    navigateTo?: (page: string) => void;
    icon?: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ label, page, href, navigateTo, icon }) => {
    // External Link Logic
    if (href) {
        return (
            <li>
                <a 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 group text-xs py-1"
                >
                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-purple-500 transition-colors"></span>
                    {icon && <span className="opacity-70">{icon}</span>}
                    {label}
                </a>
            </li>
        );
    }
    
    // Internal Route Logic (via state)
    return (
        <li>
            <button 
                onClick={() => navigateTo && page && navigateTo(page)} 
                className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 group text-xs text-left w-full py-1"
            >
                <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-purple-500 transition-colors"></span>
                {icon && <span className="opacity-70">{icon}</span>}
                {label}
            </button>
        </li>
    );
};

const StatusIndicator: React.FC<{ label: string; value: string; color?: string; blink?: boolean }> = ({ label, value, color = "text-green-500", blink = false }) => (
    <div className="flex items-center gap-2 font-mono text-[10px] text-gray-500 border border-white/5 px-2 py-1 rounded bg-black/20">
        <span className="uppercase tracking-wider opacity-70">{label}:</span>
        <span className={`${color} ${blink ? 'animate-pulse' : ''}`}>{value}</span>
    </div>
);

interface FooterProps {
    navigateTo?: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-20 pb-8 font-sans relative overflow-hidden z-10 no-print">
      {/* Decorative Infrastructure Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-900/5 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
            {/* Column 1: Brand & Core */}
            <div className="lg:col-span-4 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                         <div className="w-4 h-4 bg-black rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tighter">OPUS MAGNUM MEDIA</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed font-mono max-w-sm">
                    SYSTEM_KERNEL: v3.0.4-PRO<br/>
                    INFRASTRUCTURE: GOOGLE_CLOUD<br/>
                    The Operating System for Professional Excellence.
                </p>
                <div className="flex gap-4">
                    <button onClick={() => navigateTo && navigateTo('grantbook')} className="px-4 py-2 bg-white/5 border border-white/10 rounded text-xs text-white hover:bg-white/10 hover:border-purple-500/50 transition-all font-mono uppercase tracking-widest">
                        Initialize Grant Book
                    </button>
                </div>
            </div>
            
            {/* Column 2: Infrastructure (External) */}
            <div className="lg:col-span-2">
                <h4 className="text-white font-bold mb-6 text-[10px] uppercase tracking-[0.2em] font-mono text-purple-400">Infrastructure</h4>
                <ul className="space-y-2">
                    <FooterLink label="Alphabet Inc." href="https://abc.xyz" />
                    <FooterLink label="Google Cloud Platform" href="https://cloud.google.com" />
                    <FooterLink label="Firebase Architecture" href="https://firebase.google.com" />
                    <FooterLink label="DeepMind Research" href="https://deepmind.google" />
                    <FooterLink label="Gemini AI Studio" href="https://aistudio.google.com" />
                </ul>
            </div>

            {/* Column 3: Legal & Compliance (Internal) */}
            <div className="lg:col-span-2">
                <h4 className="text-white font-bold mb-6 text-[10px] uppercase tracking-[0.2em] font-mono text-blue-400">Legal & Compliance</h4>
                <ul className="space-y-2">
                    <FooterLink label="Imprint / Impressum" page="imprint" navigateTo={navigateTo} />
                    <FooterLink label="Privacy Policy (GDPR)" page="privacy" navigateTo={navigateTo} />
                    <FooterLink label="AI Ethics Statement" page="ethics" navigateTo={navigateTo} />
                    <FooterLink label="Terms of Service" page="terms" navigateTo={navigateTo} />
                </ul>
            </div>
            
            {/* Column 4: Connect (Social & Professional) */}
            <div className="lg:col-span-2">
                <h4 className="text-white font-bold mb-6 text-[10px] uppercase tracking-[0.2em] font-mono text-green-400">Connect</h4>
                <ul className="space-y-2">
                    <FooterLink label="LinkedIn Profile" href="https://www.linkedin.com/in/yahya-yildirim-8294a2153/" />
                    <FooterLink label="DCI Berlin" href="https://digitalcareerinstitute.org" />
                    <FooterLink label="Contact Architect" href="mailto:yahya.yildirim@dci-student.org" />
                </ul>
            </div>

            {/* Column 5: Manifest (Internal) */}
            <div className="lg:col-span-2">
                <h4 className="text-white font-bold mb-6 text-[10px] uppercase tracking-[0.2em] font-mono text-orange-400">Knowledge</h4>
                <ul className="space-y-2">
                    <FooterLink label="The Grant Book" page="grantbook" navigateTo={navigateTo} />
                    <FooterLink label="Masterplan v3" page="masterplan" navigateTo={navigateTo} />
                    <FooterLink label="System Audit" page="systemaudit" navigateTo={navigateTo} />
                </ul>
            </div>
        </div>

        {/* Bottom Bar: Transparency & Stats */}
        <div className="border-t border-white/10 pt-8 mt-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="text-[10px] text-gray-600 leading-relaxed max-w-xl">
                    <p className="mb-2 font-bold uppercase text-gray-500 tracking-widest">Transparency Disclosure</p>
                    <p>
                        OPUS MAGNUM MEDIA is an independent orchestration platform leveraging the advanced neural infrastructure of Alphabet Inc. and Google Cloud. 
                        Gemini 3.0 Pro is used for reasoning and strategic synthesis. We are not an official affiliate or reseller of Google Cloud services.
                    </p>
                </div>
                <div className="flex flex-col lg:items-end gap-4">
                    <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
                        <StatusIndicator label="Uplink" value="ENCRYPTED" color="text-blue-500" />
                        <StatusIndicator label="Core" value="ONLINE" blink />
                        <StatusIndicator label="Model" value="GEMINI-3.0-PRO" color="text-purple-500" />
                        <StatusIndicator label="Latency" value="12ms" />
                    </div>
                    <div className="text-[10px] text-gray-700 font-mono">
                        COPYRIGHT_©_{new Date().getFullYear()}_YAHYA_YILDIRIM._ALL_RIGHTS_RESERVED.
                    </div>
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
