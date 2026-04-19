import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Nucleus } from '../brand/Nucleus';
import { Breadcrumb, Crumb } from './Breadcrumb';
import { SystemLogFooter } from './SystemLogFooter';
import { PORTFOLIO_APEX } from '../../data/portfolio-v2';
import { BreadcrumbSchema } from '../seo/Schemas';

interface PortfolioShellProps {
    crumbs: Crumb[];
    children: React.ReactNode;
}

// PortfolioShell — eigenständige Layout-Hülle für /portfolio/*.
// Trägt Nucleus-Branding, Breadcrumb, System-Log-Footer und Rückkehr zur OMM-Plattform.
// OMM-Header/Footer werden auf /portfolio-Routen NICHT gerendert (App.tsx-Dispatch).
export const PortfolioShell: React.FC<PortfolioShellProps> = ({ crumbs, children }) => (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] flex flex-col">
        <BreadcrumbSchema crumbs={crumbs.map((c) => ({ label: c.label, path: c.to }))} />
        <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_20%,#A855F722_0%,transparent_55%)]" />
            <div className="retro-grid" />
        </div>

        <header className="sticky top-0 z-40 backdrop-blur-md bg-black/40 border-b border-white/5">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-6">
                <Link
                    to={PORTFOLIO_APEX.path}
                    className="group flex items-center gap-3"
                    aria-label="Portfolio APEX"
                >
                    <Nucleus variant="glyph" size={36} glow />
                    <div className="hidden sm:block leading-tight">
                        <div
                            className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#F5F5F5] group-hover:text-[#A855F7] transition-colors"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                            Portfolio OS
                        </div>
                        <div
                            className="text-[9px] tracking-[0.35em] uppercase text-gray-500"
                            style={{ fontFamily: 'JetBrains Mono, monospace' }}
                        >
                            Yahya Yildirim · Operator-Architekt
                        </div>
                    </div>
                </Link>

                <div className="hidden md:block flex-1 min-w-0">
                    <Breadcrumb crumbs={crumbs} />
                </div>

                <a
                    href="/"
                    className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] uppercase text-gray-400 hover:text-[#A855F7] transition-colors"
                >
                    <ArrowLeft className="w-3 h-3" />
                    OMM Plattform
                </a>
            </div>

            <div className="md:hidden container mx-auto px-6 pb-3">
                <Breadcrumb crumbs={crumbs} />
            </div>
        </header>

        <main className="flex-grow relative z-10 page-fade-in">
            {children}
        </main>

        <div className="relative z-10">
            <SystemLogFooter />
        </div>
    </div>
);

export default PortfolioShell;
