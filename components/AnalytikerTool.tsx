
import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useTasks, Task } from '../contexts/AppContext';
import { ChartIcon, SparkleIcon } from '../constants';

// --- SUB-COMPONENTS ---
const PerformanceChart: React.FC<{ data: Task[] }> = ({ data }) => {
    // This is a simplified chart simulation
    const chartData = useMemo(() => {
        if (data.length === 0) return { labels: [], impressions: [], engagement: [] };
        const sortedData = [...data].sort((a, b) => new Date(a.publishedAt!).getTime() - new Date(b.publishedAt!).getTime());
        return {
            labels: sortedData.map(d => new Date(d.publishedAt!).toLocaleDateString('de-DE', { month: 'short', day: 'numeric' })),
            impressions: sortedData.map(d => d.performanceData.impressions),
            engagement: sortedData.map(d => d.performanceData.engagementRate),
        };
    }, [data]);

    const maxImpressions = Math.max(...chartData.impressions, 1);

    return (
        <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#333333] h-64">
             <div className="w-full h-full flex items-end gap-2">
                {chartData.impressions.map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                         <div className="absolute -top-8 bg-black/50 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            <p>Imp: {value.toLocaleString()}</p>
                            <p>Eng: {chartData.engagement[index]}%</p>
                         </div>
                        <div className="w-full bg-blue-500/50 hover:bg-blue-500 rounded-t-sm" style={{ height: `${(value / maxImpressions) * 80}%`, transition: 'height 0.3s ease' }}></div>
                        <div className="text-[10px] text-gray-500 mt-1 truncate">{chartData.labels[index]}</div>
                    </div>
                ))}
                {data.length === 0 && <p className="w-full text-center text-gray-600">Keine Daten für Diagramm verfügbar.</p>}
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---
export const AnalytikerTool: React.FC<{ isEmbedded?: boolean }> = ({ isEmbedded }) => {
    const { tasks } = useTasks();
    const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | 'all'>('30d');
    const [insights, setInsights] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const publishedAssets = useMemo(() => {
        return tasks.filter(t => t.publishedAt && t.performanceData);
    }, [tasks]);

    const filteredAssets = useMemo(() => {
        const now = new Date();
        const filterDate = new Date();
        if (timeFilter === '7d') filterDate.setDate(now.getDate() - 7);
        else if (timeFilter === '30d') filterDate.setDate(now.getDate() - 30);
        else return publishedAssets;

        return publishedAssets.filter(asset => new Date(asset.publishedAt!) >= filterDate);
    }, [publishedAssets, timeFilter]);

    const handleGenerateInsights = async () => {
        setIsLoading(true);
        setError(null);
        setInsights(null);

        if (filteredAssets.length === 0) {
            setError("Keine Daten im ausgewählten Zeitraum für die Analyse verfügbar.");
            setIsLoading(false);
            return;
        }

        const dataForAI = filteredAssets.map(asset => ({
            title: asset.title,
            publishedAt: asset.publishedAt,
            performance: asset.performanceData,
            type: asset.videoUrl ? 'Video' : asset.imageUrl ? 'Image' : 'Text',
        }));

        const prompt = `Act as a senior marketing analyst. Analyze the following performance data for our recently published content.

        Data (JSON format):
        ${JSON.stringify(dataForAI, null, 2)}

        Your task:
        1. Provide a concise summary of the overall performance in the period.
        2. Identify the top-performing asset and explain *why* it might be successful (causal analysis).
        3. Identify any hidden patterns or trends (e.g., "Video content performs better on weekends").
        4. Give two concrete, actionable recommendations for future content strategy.

        Format your response in clear, easy-to-read markdown.
        `;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            // Upgraded to Gemini 3.0 for causal analysis
            const response = await ai.models.generateContent({ model: 'gemini-2.5-pro', contents: prompt });
            setInsights(response.text);
        } catch (e) {
            console.error("Fehler bei der Insight-Generierung:", e);
            setError("Einblicke konnten nicht generiert werden.");
        } finally {
            setIsLoading(false);
        }
    };

    const TimeFilterButton: React.FC<{ filter: '7d' | '30d' | 'all', label: string }> = ({ filter, label }) => (
        <button
            onClick={() => setTimeFilter(filter)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${timeFilter === filter ? 'bg-white text-black font-semibold' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
        >
            {label}
        </button>
    );

    return (
        <div className={`${isEmbedded ? 'bg-transparent' : 'bg-[#1C1C1C] rounded-lg border border-[#333333] p-6'}`}>
            <div className="flex justify-end mb-4">
                <div className="flex items-center gap-2 p-1 bg-black/30 rounded-full">
                    <TimeFilterButton filter="7d" label="Letzte 7 Tage" />
                    <TimeFilterButton filter="30d" label="Letzte 30 Tage" />
                    <TimeFilterButton filter="all" label="Gesamt" />
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2"><ChartIcon /> Performance-Trend</h3>
                        <PerformanceChart data={filteredAssets} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Veröffentlichte Assets ({filteredAssets.length})</h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {filteredAssets.map(asset => (
                                <div key={asset.id} className="bg-[#0A0A0A] p-3 rounded-md border border-[#333333] flex gap-4 items-center">
                                    {(asset.imageUrl || asset.videoUrl) && (
                                        <div className="w-16 h-10 bg-black rounded-sm overflow-hidden flex-shrink-0">
                                            {asset.videoUrl ? <video src={asset.videoUrl} muted loop className="w-full h-full object-cover"/> : <img src={asset.imageUrl} alt={asset.title} className="w-full h-full object-cover"/>}
                                        </div>
                                    )}
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-medium text-white truncate">{asset.title}</p>
                                        <div className="flex gap-4 text-xs text-gray-400 mt-1">
                                            <span>Imp: {asset.performanceData.impressions.toLocaleString()}</span>
                                            <span>Eng: {asset.performanceData.engagementRate}%</span>
                                            <span>Klicks: {asset.performanceData.clicks.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                             {filteredAssets.length === 0 && (
                                <div className="text-center py-10 text-gray-500">
                                    <p>Keine veröffentlichten Assets in diesem Zeitraum.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 bg-[#0A0A0A] rounded-lg border border-[#333333] p-4 flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2"><SparkleIcon /> KI-Insights</h3>
                    <div className="flex-1 overflow-y-auto prose prose-sm prose-invert max-w-none text-gray-300">
                        {isLoading && <div className="space-y-2 animate-pulse pt-2"><div className="h-3 bg-gray-700/50 rounded w-3/4"></div><div className="h-3 bg-gray-700/50 rounded w-full"></div><div className="h-3 bg-gray-700/50 rounded w-5/6"></div></div>}
                        {error && <p className="text-red-400">{error}</p>}
                        {insights ? (
                            <div dangerouslySetInnerHTML={{ __html: insights.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/### (.*)/g, '<h3 class="text-sm font-semibold text-white">$1</h3>').replace(/## (.*)/g, '<h2 class="text-md font-bold text-white">$1</h2>').replace(/# (.*)/g, '<h1>$1</h1>') }} />
                        ) : (
                           !isLoading && <p className="text-gray-500">Klicken Sie auf "Insights generieren", um eine KI-gestützte Analyse zu erhalten.</p>
                        )}
                    </div>
                    <button
                        onClick={handleGenerateInsights}
                        disabled={isLoading}
                        className="w-full mt-4 bg-purple-600 text-white py-2 rounded-full font-medium text-sm disabled:opacity-50 hover:bg-purple-500"
                    >
                        Insights generieren
                    </button>
                    <p className="text-[10px] text-gray-500 text-center mt-2">Powered by Gemini 3.0 Pro</p>
                </div>
            </div>
        </div>
    );
};
