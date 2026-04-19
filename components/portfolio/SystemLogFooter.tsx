import React from 'react';
import {
    SYSTEM_LOG_FOOTER,
    PORTFOLIO_VERSION,
    CANONICAL_REF,
    LAST_UPDATED,
} from '../../data/portfolio-v2';

// System-Log-Footer nach OMM Brand Protocol v3.0 · auf jeder Portfolio-Route verpflichtend.
export const SystemLogFooter: React.FC = () => (
    <footer className="border-t border-white/5 mt-24 pt-10 pb-8">
        <div className="container mx-auto px-6">
            <div className="flex flex-col gap-6">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="relative flex h-2 w-2" aria-hidden>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
                    </span>
                    <code
                        className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-gray-500 leading-relaxed"
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    >
                        {SYSTEM_LOG_FOOTER}
                    </code>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[10px] font-mono text-gray-600 tracking-[0.2em] uppercase">
                    <span>
                        &gt; ALL MODULES ACTIVE / &gt; GCP_EU_WEST3 SECURED / &gt; AWAITING OPERATOR INPUT
                    </span>
                    <span>
                        Portfolio {PORTFOLIO_VERSION} · Canonical {CANONICAL_REF} · {LAST_UPDATED}
                    </span>
                </div>
            </div>
        </div>
    </footer>
);

export default SystemLogFooter;
