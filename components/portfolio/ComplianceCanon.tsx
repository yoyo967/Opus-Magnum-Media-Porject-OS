import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { COMPLIANCE_FRAMEWORK } from '../../data/portfolio-v2';

export const ComplianceCanon: React.FC = () => (
    <section id="compliance" className="mb-32 scroll-mt-24">
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-4 h-4 text-[#A855F7]" />
                <h2 className="text-xs font-mono text-[#A855F7] tracking-[0.4em] uppercase">§16 · Datenschutz- und Datenrechts-Ordnung</h2>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Compliance-Canon</h3>
            <p className="text-gray-400 leading-relaxed mb-10 max-w-3xl">
                Alle OMM-Systeme und Yildirim-Netzwerk-Plattformen sind entlang des folgenden EU-Regulierungsrahmens konzipiert. Diese Übersicht hält den Status fest; sie ersetzt keine rechtliche Prüfung vor Produkt-Veröffentlichung.
            </p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="border border-white/10 rounded-lg overflow-hidden bg-[#0D0D0D]"
            >
                <div className="grid grid-cols-[1fr_1fr_1fr_2fr] bg-white/5 border-b border-white/10 font-mono text-[10px] tracking-[0.3em] uppercase text-gray-400">
                    <div className="px-6 py-3">Regelwerk</div>
                    <div className="px-6 py-3">Verordnung</div>
                    <div className="px-6 py-3">Status</div>
                    <div className="px-6 py-3">Kernpflichten für OMM</div>
                </div>
                {COMPLIANCE_FRAMEWORK.map((row, i) => (
                    <div
                        key={row.regime}
                        className={`grid grid-cols-[1fr_1fr_1fr_2fr] ${i < COMPLIANCE_FRAMEWORK.length - 1 ? 'border-b border-white/5' : ''} text-sm`}
                    >
                        <div className="px-6 py-4 text-white font-medium">{row.regime}</div>
                        <div className="px-6 py-4 text-gray-400 font-mono text-xs">{row.regulation}</div>
                        <div className="px-6 py-4 text-[#A855F7]">{row.status}</div>
                        <div className="px-6 py-4 text-gray-400 leading-relaxed">{row.obligation}</div>
                    </div>
                ))}
            </motion.div>

            <p className="mt-6 text-xs text-gray-500 leading-relaxed">
                Vollständige DSGVO-Konformitäts-Architektur, DSFA-Dokumentation und Drittland-Transfer-Strategie im Canonical §16.2–16.6.
            </p>
        </div>
    </section>
);
