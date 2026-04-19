import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { FAQEntry } from '../../data/portfolio-v2';

interface FAQBlockProps {
    faqs: FAQEntry[];
    accent?: string;
    kicker?: string;
    heading?: string;
}

// FAQ-Block für AEO (Answer Engine Optimization).
// Visuell sichtbar + über <FAQSchema> als strukturierte Daten im <head> gerendert.
// Aufklappbare Q&A-Paare mit JetBrains-Mono-Kicker im OMM-Stil.
export const FAQBlock: React.FC<FAQBlockProps> = ({
    faqs,
    accent = '#A855F7',
    kicker = 'AEO · Answer Engine Optimization',
    heading = 'Kanonische Fragen',
}) => {
    const [openIdx, setOpenIdx] = useState<number | null>(0);
    if (!faqs || faqs.length === 0) return null;

    return (
        <section className="mb-24 scroll-mt-24" aria-labelledby="faq-heading">
            <div className="max-w-4xl mx-auto">
                <div
                    className="font-mono text-[10px] tracking-[0.4em] uppercase mb-4"
                    style={{ color: accent }}
                >
                    {kicker}
                </div>
                <h2
                    id="faq-heading"
                    className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3"
                >
                    {heading}
                </h2>
                <p className="text-gray-400 leading-relaxed mb-8 max-w-2xl">
                    Diese Q&amp;A-Paare sind für menschliche Leser und Answer-Engines (Claude · Gemini · Perplexity · ChatGPT) gleichermaßen zitierbar.
                </p>

                <div className="space-y-3">
                    {faqs.map((f, i) => {
                        const isOpen = openIdx === i;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-[#0D0D0D] border rounded-lg overflow-hidden"
                                style={{ borderColor: isOpen ? `${accent}55` : 'rgba(255,255,255,0.08)' }}
                            >
                                <button
                                    type="button"
                                    className="w-full flex items-start justify-between gap-4 p-5 text-left hover:bg-white/[0.02] transition-colors"
                                    onClick={() => setOpenIdx(isOpen ? null : i)}
                                    aria-expanded={isOpen}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div
                                            className="font-mono text-[9px] tracking-[0.3em] uppercase mb-2"
                                            style={{ color: accent }}
                                        >
                                            Q{String(i + 1).padStart(2, '0')}
                                        </div>
                                        <div className="text-white text-base md:text-lg font-semibold leading-snug">
                                            {f.q}
                                        </div>
                                    </div>
                                    <ChevronDown
                                        className="w-5 h-5 flex-shrink-0 mt-1 transition-transform"
                                        style={{
                                            color: accent,
                                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                        }}
                                        aria-hidden
                                    />
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                        >
                                            <div
                                                className="px-5 pb-5 pt-0 text-gray-300 leading-relaxed border-t"
                                                style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                                            >
                                                {f.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FAQBlock;
