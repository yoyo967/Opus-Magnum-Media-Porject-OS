import React from 'react';
import { TOC } from '../../data/portfolio-v2';

export const TableOfContents: React.FC = () => (
    <nav className="hidden xl:block sticky top-24 self-start w-56 text-xs">
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-4">Navigation</div>
        <ul className="space-y-2 border-l border-white/10">
            {TOC.map((entry) => (
                <li key={entry.id}>
                    <a
                        href={`#${entry.id}`}
                        className="group flex items-center gap-3 pl-4 -ml-px border-l border-transparent hover:border-[#A855F7] transition-colors"
                    >
                        <span className="font-mono text-gray-600 group-hover:text-[#A855F7] w-8">{entry.canon}</span>
                        <span className="text-gray-400 group-hover:text-white">{entry.label}</span>
                    </a>
                </li>
            ))}
        </ul>
    </nav>
);
