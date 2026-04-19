import React from 'react';
import { motion } from 'motion/react';
import { OPC_RESPONSIBILITIES, OPC_STATUS_TODAY, BELEG_STRATEGY } from '../../data/portfolio-v2';

export const OperatorProof: React.FC = () => (
    <section id="operator-proof" className="mb-32 scroll-mt-24">
        <div className="max-w-5xl mx-auto">
            <h2 className="text-xs font-mono text-[#A855F7] tracking-[0.4em] uppercase mb-4">§1a · Proof of Operation — OPC Mandat</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Primäres Mandat: ca. 4 Jahre, volle Vollmacht</h3>
            <p className="text-gray-400 leading-relaxed mb-10 max-w-3xl">
                Kontext: OPC Overnight Parcel Courier — europäischer Express-Kurierdienst, Familienunternehmen mit Stationen-Netzwerk, internationale Präsenz (über 250 Länder via Partnernetzwerk).
            </p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="border border-white/10 rounded-lg overflow-hidden bg-[#0D0D0D]"
            >
                <div className="grid grid-cols-[220px_1fr] bg-white/5 border-b border-white/10 font-mono text-[10px] tracking-[0.3em] uppercase text-gray-400">
                    <div className="px-6 py-3">Bereich</div>
                    <div className="px-6 py-3">Leistung</div>
                </div>
                {OPC_RESPONSIBILITIES.map((row, i) => (
                    <div
                        key={row.area}
                        className={`grid grid-cols-[220px_1fr] ${i < OPC_RESPONSIBILITIES.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/[0.02] transition-colors`}
                    >
                        <div className="px-6 py-4 text-white font-medium text-sm">{row.area}</div>
                        <div className="px-6 py-4 text-gray-400 text-sm leading-relaxed">{row.delivery}</div>
                    </div>
                ))}
            </motion.div>

            <p className="mt-8 text-sm text-gray-300 leading-relaxed border-l-2 border-[#A855F7] pl-6">
                <span className="text-white font-medium">Ergebnis: </span>
                Operative Stabilisierung wiederhergestellt, Refinanzierung erfolgreich. Aus der stabilisierten Basis sind im Firmenverbund zwei weitere GmbHs hervorgegangen.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-lg">
                    <h4 className="text-xs font-mono text-[#A855F7] tracking-[0.3em] uppercase mb-3">Status heute</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{OPC_STATUS_TODAY}</p>
                </div>
                <div className="p-6 bg-white/[0.02] border border-white/10 rounded-lg">
                    <h4 className="text-xs font-mono text-[#A855F7] tracking-[0.3em] uppercase mb-3">Beleg-Strategie</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{BELEG_STRATEGY}</p>
                </div>
            </div>
        </div>
    </section>
);
