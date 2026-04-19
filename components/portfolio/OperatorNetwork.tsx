import React from 'react';
import { motion } from 'motion/react';
import {
    NETWORK_PROJECTS,
    NETWORK_CONSEQUENCE,
    NETWORK_PRINCIPLE,
    FAMILY_PRINCIPLE,
} from '../../data/portfolio-v2';

export const OperatorNetwork: React.FC = () => (
    <section id="network" className="mb-32 scroll-mt-24">
        <div className="max-w-5xl mx-auto">
            <h2 className="text-xs font-mono text-[#A855F7] tracking-[0.4em] uppercase mb-4">§1c · Proof of Network — Yildirim Operator Network</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Kein Einzeloperator. Ein Netzwerk aus Haltung.</h3>
            <p className="text-gray-400 leading-relaxed mb-12 max-w-3xl">
                Physische Basis: OPC-Gruppe. Digitale Knoten: OMM, LYGOX, MASTER-X 2.0, Sovereign 2030. Familien-Ebene: bewusst, verantwortungsvoll, über Generationen. Das Muster unten definiert, wie das Netzwerk zusammenhält.
            </p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12 border border-[#A855F7]/20 rounded-xl bg-[#A855F7]/[0.03] p-8 md:p-10"
            >
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#A855F7] mb-3">{NETWORK_PRINCIPLE.kicker}</div>
                <p className="text-white text-lg md:text-xl leading-relaxed mb-8 max-w-3xl">
                    {NETWORK_PRINCIPLE.lead}
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                    {NETWORK_PRINCIPLE.tenets.map((tenet) => (
                        <div key={tenet.title} className="border-l border-[#A855F7]/30 pl-4">
                            <h4 className="text-white font-semibold mb-2 text-sm">{tenet.title}</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">{tenet.desc}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            <h4 className="font-mono text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-4">Aktive digitale Knoten</h4>
            <div className="grid md:grid-cols-2 gap-6">
                {NETWORK_PROJECTS.map((project, i) => (
                    <motion.div
                        key={project.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="relative bg-[#0D0D0D] border border-white/10 rounded-lg p-6 hover:border-[#A855F7]/40 transition-colors"
                    >
                        <div className="flex items-baseline justify-between mb-1">
                            <h4 className="text-xl font-bold text-white tracking-tight">{project.name}</h4>
                            <span className="font-mono text-[10px] tracking-widest uppercase text-[#A855F7]">Knoten</span>
                        </div>
                        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-4">{project.kind}</div>
                        <dl className="space-y-3 text-sm">
                            <div>
                                <dt className="font-mono text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-1">Initiator / Vision</dt>
                                <dd className="text-gray-300">{project.initiator}</dd>
                            </div>
                            <div>
                                <dt className="font-mono text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-1">Yahyas Rolle</dt>
                                <dd className="text-gray-300">{project.role}</dd>
                            </div>
                            <div>
                                <dt className="font-mono text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-1">Team / Stack</dt>
                                <dd className="text-gray-300">{project.team}</dd>
                            </div>
                            <div>
                                <dt className="font-mono text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-1">Status</dt>
                                <dd className="text-gray-300">{project.status}</dd>
                            </div>
                            {project.grounding && (
                                <div className="pt-3 mt-2 border-t border-[#A855F7]/15">
                                    <dt className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#A855F7] mb-1">
                                        Trainings-/Grounding-Korpus · Art. 50 Disclosure
                                    </dt>
                                    <dd className="text-gray-400 text-xs leading-relaxed">{project.grounding}</dd>
                                </div>
                            )}
                        </dl>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 p-6 md:p-8 bg-white/[0.02] border border-white/10 rounded-lg"
            >
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#A855F7] mb-3">{FAMILY_PRINCIPLE.kicker}</div>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-3xl">
                    {FAMILY_PRINCIPLE.body}
                </p>
            </motion.div>

            <p className="mt-8 p-6 bg-[#A855F7]/5 border border-[#A855F7]/20 rounded-lg text-sm text-gray-300 leading-relaxed">
                <span className="text-[#A855F7] font-mono text-[10px] tracking-[0.3em] uppercase block mb-2">Konsequenz für die Positionierung</span>
                {NETWORK_CONSEQUENCE}
            </p>
        </div>
    </section>
);
