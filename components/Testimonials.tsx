
import React from 'react';

interface TestimonialCardProps {
    quote: string;
    name: string;
    title: string;
    imageUrl: string;
    results: { value: string; label: string }[];
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, title, imageUrl, results }) => (
    <div className="bg-[#0A0A0A] p-10 rounded-2xl border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-10 font-serif text-6xl text-white">"</div>
        
        <div className="flex items-center gap-4 mb-8">
            <img src={imageUrl} alt={name} className="w-14 h-14 rounded-full object-cover border-2 border-white/10 grayscale group-hover:grayscale-0 transition-all" />
            <div>
                <p className="font-bold text-white text-lg">{name}</p>
                <p className="text-xs text-purple-400 font-mono uppercase tracking-wider">{title}</p>
            </div>
        </div>

        <p className="text-xl text-gray-300 font-light italic leading-relaxed mb-8">"{quote}"</p>
        
        <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-8">
            {results.map((result, index) => (
                <div key={index}>
                    <p className="text-3xl font-bold text-white tracking-tighter">{result.value}</p>
                    <p className="text-xs text-gray-500 font-mono uppercase mt-1">{result.label}</p>
                </div>
            ))}
        </div>
    </div>
);

const Testimonials: React.FC = () => {
    const testimonialsData: TestimonialCardProps[] = [
        {
            quote: "OPUS MAGNUM is not a tool, it's our operating system for growth. The fusion of strategy and execution is unprecedented.",
            name: "Dr. Sarah Jenkins",
            title: "Chief Strategy Officer, FutureTech",
            imageUrl: "https://i.pravatar.cc/150?u=sarah",
            results: [
                { value: "+120%", label: "Execution Speed" },
                { value: "-40%", label: "Agency Costs" },
            ],
        },
        {
            quote: "The ability to go from data analysis directly to asset production without switching platforms has halved our time-to-market.",
            name: "Marcus Thorn",
            title: "VP Marketing, Innovate Corp.",
            imageUrl: "https://i.pravatar.cc/150?u=marcus",
            results: [
                { value: "2.5x", label: "ROI Increase" },
                { value: "24/7", label: "System Uptime" },
            ],
        },
    ];

    return (
        <section className="py-32 bg-black border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter max-w-xl">
                        Validated by the new generation of leadership.
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        VERIFIED_EXECUTIVES
                    </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                    {testimonialsData.map((testimonial, index) => (
                        <TestimonialCard key={index} {...testimonial} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
