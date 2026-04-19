import React from 'react';
import { PORTFOLIO_VERSION, CANONICAL_REF, LAST_UPDATED } from '../../data/portfolio-v2';

export const VersionBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`inline-flex items-center gap-3 font-mono text-[10px] tracking-[0.3em] uppercase ${className}`}>
        <span className="px-2 py-1 rounded border border-[#A855F7]/30 bg-[#A855F7]/10 text-[#A855F7]">
            Portfolio {PORTFOLIO_VERSION}
        </span>
        <span className="text-gray-500">Canonical {CANONICAL_REF}</span>
        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
        <span className="text-gray-500">{LAST_UPDATED}</span>
    </div>
);
