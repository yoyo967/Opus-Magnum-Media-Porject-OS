import { getGeminiClient } from '@/utils/geminiClient';

import React, { useState, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useTasks, COST_TABLE } from '../contexts/AppContext';
import { Toast } from './Toast';

const MODELS = [
    { id: 'churn', name: 'Churn Prediction', description: 'Identifiziert Kundensegmente mit dem höchsten Risiko, abzuwandern.' },
    { id: 'ltv', name: 'LTV Forecasting', description: 'Prognostiziert den zukünftigen Lifetime-Value verschiedener Kundengruppen.' },
    { id: 'propensity', name: 'Propensity Modeling', description: 'Sagt voraus, welche Leads am wahrscheinlichsten auf ein neues Angebot reagieren.' },
];

const churnSchema = { type: Type.OBJECT, properties: { high_risk_segment: { type: Type.STRING }, key_indicators: { type: Type.ARRAY, items: { type: Type.STRING } }, recommended_action: { type: Type.STRING }, task_title: {type: Type.STRING}, task_description: {type: Type.STRING}, chart_metric_label: {type: Type.STRING}, chart_metric_value: {type: Type.INTEGER}, chart_color: {type: Type.STRING, enum: ['red', 'yellow', 'blue', 'green']} } };
const ltvSchema = { type: Type.OBJECT, properties: { highest_ltv_segment: { type: Type.STRING }, value_drivers: { type: Type.ARRAY, items: { type: Type.STRING } }, recommended_action: { type: Type.STRING }, task_title: {type: Type.STRING}, task_description: {type: Type.STRING}, chart_metric_label: {type: Type.STRING}, chart_metric_value: {type: Type.INTEGER}, chart_color: {type: Type.STRING, enum: ['red', 'yellow', 'blue', 'green']} } };
const propensitySchema = { type: Type.OBJECT, properties: { highest_propensity_segment: { type: Type.STRING }, positive_signals: { type: Type.ARRAY, items: { type: Type.STRING } }, recommended_action: { type: Type.STRING }, task_title: {type: Type.STRING}, task_description: {type: Type.STRING}, chart_metric_label: {type: Type.STRING}, chart_metric_value: {type: Type.INTEGER}, chart_color: {type: Type.STRING, enum: ['red', 'yellow', 'blue', 'green']} } };

const MODEL_CONFIGS: any = {
    churn: { schema: churnSchema, prompt: "Analyze the customer data to identify the segment with the highest churn risk. Provide key indicators and a recommended retention action. Also provide a key metric for a chart: the percentage of customers in this high-risk segment as an integer." },
    ltv: { schema: ltvSchema, prompt: "Analyze the customer data to forecast the customer segment with the highest future Lifetime Value (LTV). Identify the key value drivers and recommend an action to maximize this value. Also provide a key metric for a chart: the percentage of total LTV this segment represents as an integer." },
    propensity: { schema: propensitySchema, prompt: "Analyze the customer data to model which user segment has the highest propensity to purchase a new 'AI-powered analytics add-on'. Identify positive signals and recommend a targeted action. Also provide a key metric for a chart: the percentage of users in this high-propensity segment as an integer." },
};

const DatabaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375" /></svg>;
const CloudUploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto mb-2 text-gray-600"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>;
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m-15.686 0A11.959 11.959 0 013 12c0-.778.099-1.533.284-2.253m0 0A11.959 11.959 0 017 12m0 0h10" /></svg>;
const ArchiveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>;
const WarningIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-yellow-400"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>;

const DonutChart: React.FC<{ value: number; color: 'red' | 'yellow' | 'blue' | 'green'; label: string }> = ({ value, color, label }) => {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (value / 100) * circumference;
    const colorMap = {
        red: 'text-red-400',
        yellow: 'text-yellow-400',
        blue: 'text-blue-400',
        green: 'text-green-400',
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4 group">
            <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-gray-700" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                    <circle className={colorMap[color]} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 1s ease-out' }}/>
                </svg>
                <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold ${colorMap[color]}`}>{value}%</span>
            </div>
            <p className="text-xs text-gray-400 text-center">{label}</p>
        </div>
    );
};

const TrendChart: React.FC<{ trends: number[], labels: string[] }> = ({ trends, labels }) => {
    const max = Math.max(...trends, 10);
    const min = Math.min(...trends, 0);
    
    return (
        <div className="h-32 w-full flex items-end gap-2 relative pt-4">
             {trends.map((val, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center group">
                     <div className="w-full bg-purple-500/20 border-t-2 border-purple-500 rounded-t-sm relative hover:bg-purple-500/40 transition-colors" style={{ height: `${((val - min) / (max - min)) * 80 + 10}%` }}>
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-1 rounded">{val}%</div>
                     </div>
                     <span className="text-[10px] text-gray-500 mt-1 truncate w-full text-center">{labels[i]}</span>
                 </div>
             ))}
        </div>
    );
};

interface OrakelToolProps {
    navigateTo: (page: string) => void;
    isEmbedded?: boolean;
}

export const OrakelTool: React.FC<OrakelToolProps> = ({ navigateTo, isEmbedded }) => {
    const { addTask, addDocument, addSystemLog, checkCredits, deductCredits } = useTasks();
    const [mode, setMode] = useState<'internal' | 'live'>('internal');
    
    // Internal Mode State
    const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
    const [csvData, setCsvData] = useState<string | null>(null);
    const [csvFileName, setCsvFileName] = useState<string | null>(null);
    
    // Live Mode State
    const [marketTopic, setMarketTopic] = useState('KI Marketing Trends 2026');
    const [liveAnalysis, setLiveAnalysis] = useState<any | null>(null);
    
    // Shared State
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [usedFallback, setUsedFallback] = useState(false);

    const handleFile = (file: File) => {
        if (file && file.type === 'text/csv') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result;
                setCsvData(text as string);
                setCsvFileName(file.name);
                setError(null);
            };
            reader.readAsText(file);
        } else {
            setError("Bitte laden Sie eine gültige .csv-Datei hoch.");
            setCsvData(null);
            setCsvFileName(null);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]); };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
    const clearCsv = () => { setCsvData(null); setCsvFileName(null); };

    const handleRunModel = async () => {
        if (!selectedModelId) return;
        
        const cost = COST_TABLE.COMPLEX_TEXT;
        if(!checkCredits(cost)) {
             setError(`Insufficient Credits. Required: ${cost}.`);
             return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);
        deductCredits(cost, `Oracle Internal: ${selectedModelId}`);

        const config = MODEL_CONFIGS[selectedModelId];
        let prompt: string;

        const dataContext = csvData 
            ? `based *only on the provided CSV data*:\n---\n${csvData}\n---`
            : `based on a simulated unified Customer 360 data warehouse containing profiles for 15,000 customers.`;
        
        prompt = `
            Act as a lead data scientist.
            ${config.prompt}
            Analyze the data ${dataContext}
            Generate a plausible, realistic analysis and respond strictly in the requested JSON format.
            Assign a color for the chart: red for negative/risk, yellow for neutral/warning, blue for informational, green for positive/opportunity.
        `;
        
        try {
            const ai = getGeminiClient();
            // Upgraded to Gemini 3.0 for deeper data analysis
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: config.schema }
            });
            setResult(JSON.parse(response.text));
        } catch (e) {
            console.error("Fehler bei der Modellausführung:", e);
            setError("Analyse konnte nicht durchgeführt werden.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const executeLivePulse = async (useSearch: boolean) => {
         const liveSchema = {
            type: Type.OBJECT,
            properties: {
                trend_summary: { type: Type.STRING, description: "A summary of the current market trend." },
                growth_probability: { type: Type.INTEGER, description: "Probability of growth in % (0-100)." },
                trend_data_points: { type: Type.ARRAY, items: { type: Type.INTEGER }, description: "5 integer data points representing the trend trajectory over time." },
                time_labels: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5 labels for the time axis (e.g. Q1, Q2...)." },
                key_drivers: { type: Type.ARRAY, items: { type: Type.STRING } },
                strategic_advice: { type: Type.STRING }
            }
        };

        const prompt = `
            Act as a futuristic market oracle. Perform a ${useSearch ? 'LIVE web analysis' : 'simulated analysis based on your training data'} on the topic: "${marketTopic}".
            
            1. ${useSearch ? 'Use Google Search to find the latest news, statistics, and sentiment.' : 'Synthesize your internal knowledge regarding this topic.'}
            2. Predict the future trajectory of this trend.
            3. Generate a 5-point trend dataset representing the "Hype Cycle" or "Growth Curve" for this topic.
            
            Return the analysis in the specified JSON format.
        `;

        const config: any = { 
            responseMimeType: "application/json", 
            responseSchema: liveSchema 
        };
        
        if (useSearch) {
             config.tools = [{googleSearch: {}}];
        }
        
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config
        });
        return JSON.parse(response.text);
    };

    const handleLiveMarketPulse = async () => {
        if (!marketTopic.trim()) return;
        
        const cost = COST_TABLE.WEB_SEARCH + COST_TABLE.COMPLEX_TEXT; // Search + Reasoning
        if(!checkCredits(cost)) {
             setError(`Insufficient Credits for Live Pulse. Required: ${cost}.`);
             return;
        }
        
        setIsLoading(true);
        setError(null);
        setLiveAnalysis(null);
        setUsedFallback(false);
        
        addSystemLog(`Oracle accessing live market data via Google Search for: ${marketTopic} (-${cost} Credits)`, 'Orakel');
        deductCredits(cost, 'Oracle Live Pulse');
        
        try {
            // Try with Search
            const data = await executeLivePulse(true);
            setLiveAnalysis(data);
            addSystemLog(`Oracle pulse complete. Market prediction generated via Search.`, 'Orakel', 'success');
        } catch (e) {
            console.warn("Search failed, falling back.", e);
            addSystemLog(`Oracle Search failed. Switching to internal forecast simulation...`, 'Orakel', 'warning');
            try {
                // Fallback without Search
                setUsedFallback(true);
                const data = await executeLivePulse(false);
                setLiveAnalysis(data);
            } catch (fallbackError) {
                 console.error("Fallback error", fallbackError);
                 setError("Live-Markt-Daten konnten nicht abgerufen werden.");
                 addSystemLog(`Oracle pulse failed completely.`, 'Orakel', 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateTask = () => {
        const data = mode === 'internal' ? result : liveAnalysis;
        const title = mode === 'internal' ? data?.task_title : `Strategie: ${marketTopic}`;
        const desc = mode === 'internal' ? data?.task_description : data?.strategic_advice;
        
        if (!title) return;
        addTask(title, desc || 'Generiert vom Orakel.');
        setToastMessage(`Aufgabe "${title}" wurde zum Meisterwerk hinzugefügt.`);
        navigateTo('meisterwerk');
    };
    
    const handleSaveAnalysis = () => {
        if (mode === 'internal' && result) {
            const content = `
# Oracle Analysis: ${selectedModelId}
*Model: ${MODELS.find(m => m.id === selectedModelId)?.name}*

## High Risk Segment
${result.high_risk_segment || result.highest_ltv_segment || result.highest_propensity_segment}

## Key Indicators / Drivers
${(result.key_indicators || result.value_drivers || result.positive_signals || []).join(', ')}

## Recommended Action
${result.recommended_action}
            `;
            addDocument(`Oracle: ${selectedModelId}`, content.trim(), 'strategy');
            setToastMessage("Interne Analyse gespeichert.");
        } else if (mode === 'live' && liveAnalysis) {
             const content = `
# Market Oracle: ${marketTopic}
*Growth Probability: ${liveAnalysis.growth_probability}%*
*Date: ${new Date().toLocaleDateString()}*
*Source: ${usedFallback ? 'Internal Simulation' : 'Live Web Reconnaissance'}*

## Summary
${liveAnalysis.trend_summary}

## Strategic Advice
${liveAnalysis.strategic_advice}

## Key Drivers
${liveAnalysis.key_drivers.join(', ')}
            `;
            addDocument(`Market Pulse: ${marketTopic}`, content.trim(), 'strategy');
            setToastMessage("Markt-Analyse gespeichert.");
        }
    };
    
    const renderResult = () => {
        if (!result) return null;
        const resultEntries = Object.entries(result).filter(([key]) => !key.startsWith('task_') && !key.startsWith('chart_'));

        return (
            <div className="grid md:grid-cols-3 gap-6 items-center page-fade-in">
                <div className="md:col-span-1">
                    {result.chart_metric_value && result.chart_color && result.chart_metric_label && (
                         <DonutChart value={result.chart_metric_value} color={result.chart_color} label={result.chart_metric_label} />
                    )}
                </div>
                <div className="md:col-span-2 space-y-4">
                    {resultEntries.map(([key, value]) => (
                        <div key={key}>
                            <h4 className="font-semibold text-gray-300 capitalize text-sm">{key.replace(/_/g, ' ')}</h4>
                            {Array.isArray(value) 
                                ? <ul className="list-disc list-inside text-white mt-1 text-sm">{value.map((item, i) => <li key={i}>{item}</li>)}</ul>
                                : <p className="text-white mt-1 text-sm">{String(value)}</p>
                            }
                        </div>
                    ))}
                    <div className="border-t border-[#333333] mt-6 pt-4 flex gap-4">
                        <button onClick={handleSaveAnalysis} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-full text-sm flex items-center justify-center gap-2 transition-colors">
                            <ArchiveIcon /> Analyse speichern
                        </button>
                        <button onClick={handleCreateTask} className="flex-1 bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded-full text-sm transition-colors">
                            Maßnahme erstellen
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    
    const renderLiveResult = () => {
        if (!liveAnalysis) return null;
        return (
             <div className="space-y-6 page-fade-in">
                 {usedFallback && (
                    <div className="p-2 bg-yellow-900/20 border border-yellow-500/30 rounded flex items-center gap-2 text-xs text-yellow-200">
                        <WarningIcon />
                        <span><strong>Offline Mode:</strong> Live-Daten nicht verfügbar. Prognose basiert auf interner Simulation.</span>
                    </div>
                )}

                 <div className="bg-[#111] p-4 rounded-lg border border-purple-500/30">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-bold text-purple-300 uppercase tracking-widest flex items-center gap-2">
                            <GlobeIcon /> Trend Prognose
                        </h4>
                        <span className="text-xs text-gray-400">Wachstumswahrscheinlichkeit: <span className="text-white font-bold">{liveAnalysis.growth_probability}%</span></span>
                    </div>
                    <TrendChart trends={liveAnalysis.trend_data_points} labels={liveAnalysis.time_labels} />
                 </div>
                 
                 <div>
                     <h4 className="font-semibold text-gray-300 text-sm">Markt-Zusammenfassung {usedFallback ? '(Simuliert)' : '(Live)'}</h4>
                     <p className="text-white mt-1 text-sm">{liveAnalysis.trend_summary}</p>
                 </div>
                 
                 <div>
                     <h4 className="font-semibold text-gray-300 text-sm">Haupttreiber</h4>
                     <ul className="list-disc list-inside text-white mt-1 text-sm">{liveAnalysis.key_drivers.map((k:string, i:number) => <li key={i}>{k}</li>)}</ul>
                 </div>
                 
                 <div className="bg-blue-900/20 p-4 rounded border border-blue-500/20">
                     <h4 className="font-bold text-blue-300 text-sm mb-1">Strategischer Rat</h4>
                     <p className="text-blue-100 text-sm">{liveAnalysis.strategic_advice}</p>
                 </div>
                 
                 <div className="flex gap-4 pt-2">
                     <button onClick={handleSaveAnalysis} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-full text-sm flex items-center justify-center gap-2 transition-colors">
                        <ArchiveIcon /> Analyse speichern
                     </button>
                     <button onClick={handleCreateTask} className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 px-4 rounded-full text-sm transition-colors">
                        Strategie planen
                     </button>
                 </div>
             </div>
        );
    };

    return (
        <>
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            <div className={`${isEmbedded ? 'h-full overflow-y-auto' : 'bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 max-w-5xl mx-auto'}`}>
                {/* Mode Switcher */}
                <div className="flex justify-center mb-8 sticky top-0 z-10 pt-2 pb-2 bg-[#1C1C1C]/80 backdrop-blur-sm">
                    <div className="bg-[#0A0A0A] p-1 rounded-full border border-[#333] flex">
                        <button onClick={() => setMode('internal')} className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${mode === 'internal' ? 'bg-white text-black shadow' : 'text-gray-400 hover:text-white'}`}>
                            Interne Daten
                        </button>
                        <button onClick={() => setMode('live')} className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${mode === 'live' ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
                            <GlobeIcon /> Live-Markt-Radar
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        {mode === 'internal' ? (
                            <>
                                <div>
                                    <label className="text-sm font-medium text-gray-300 block mb-2">Datenquelle (Optional)</label>
                                    {csvFileName ? (
                                        <div className="bg-[#0A0A0A] p-3 rounded-md border border-[#333333] flex items-center justify-between">
                                            <p className="text-sm text-white truncate">{csvFileName}</p>
                                            <button onClick={clearCsv} className="text-gray-400 hover:text-white text-lg leading-none">&times;</button>
                                        </div>
                                    ) : (
                                        <div onDrop={handleDrop} onDragOver={handleDragOver} className="relative bg-[#0A0A0A] p-4 rounded-md border-2 border-dashed border-[#333333] text-center text-gray-500 hover:border-gray-400 transition-colors cursor-pointer">
                                            <input type="file" accept=".csv" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                            <CloudUploadIcon />
                                            <p className="text-xs">CSV-Datei hierher ziehen oder klicken</p>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-300 mb-2">Modell auswählen</h3>
                                    <div className="space-y-2">
                                        {MODELS.map(model => (
                                            <button key={model.id} onClick={() => setSelectedModelId(model.id)} className={`w-full text-left p-3 rounded-md border text-sm transition-all ${selectedModelId === model.id ? 'bg-blue-900/50 border-blue-500' : 'bg-[#0A0A0A] border-[#333333] hover:border-gray-600'}`}>
                                                <p className="font-semibold text-white">{model.name}</p>
                                                <p className="text-xs text-gray-400 mt-1">{model.description}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={handleRunModel} disabled={!selectedModelId || isLoading} className="w-full bg-white text-black py-2.5 rounded-full font-medium text-sm disabled:opacity-50">
                                    {isLoading ? 'Analysiere...' : `Analyse durchführen [${COST_TABLE.COMPLEX_TEXT} Cr]`}
                                </button>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="text-sm font-medium text-gray-300 block mb-2">Markt / Thema</label>
                                    <textarea 
                                        value={marketTopic} 
                                        onChange={e => setMarketTopic(e.target.value)}
                                        className="w-full bg-[#0A0A0A] text-white px-3 py-2 rounded-md border border-[#333333] focus:border-purple-500 outline-none"
                                        rows={3}
                                        placeholder="z.B. Crypto Trends, Nachhaltige Mode..."
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Das Orakel scannt das Live-Web nach aktuellen Signalen und berechnet eine Zukunftsprognose.
                                    </p>
                                </div>
                                <button onClick={handleLiveMarketPulse} disabled={!marketTopic || isLoading} className="w-full bg-purple-600 text-white py-2.5 rounded-full font-medium text-sm disabled:opacity-50 hover:bg-purple-500 transition-colors shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                                    {isLoading ? 'Scanne Markt...' : `Zukunft vorhersagen [${COST_TABLE.WEB_SEARCH + COST_TABLE.COMPLEX_TEXT} Cr]`}
                                </button>
                            </>
                        )}
                    </div>
                    
                    <div className={`lg:col-span-2 bg-[#0A0A0A] rounded-lg border border-[#333333] p-6 min-h-[300px] flex flex-col ${isEmbedded ? 'mb-6' : ''}`}>
                        <h3 className="text-lg font-medium text-white mb-4">
                            {mode === 'internal' ? '2. Ergebnisse & Handlungsempfehlung' : '2. Live-Markt Prognose'}
                        </h3>
                        
                        {isLoading && (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4">
                                <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                                <p className="animate-pulse">{mode === 'internal' ? 'KI-Orakel befragt Daten...' : 'Orakel verbindet sich mit dem Weltwissen...'}</p>
                            </div>
                        )}
                        
                        {error && (
                            <div className="flex-1 flex items-center justify-center text-red-400">
                                <p>{error}</p>
                            </div>
                        )}
                        
                        {!isLoading && !error && (
                            mode === 'internal' ? (
                                result ? renderResult() : (
                                    <div className="flex-1 flex items-center justify-center text-center text-gray-500">
                                        <p>Wählen Sie ein Modell, um die Analyse zu starten.</p>
                                    </div>
                                )
                            ) : (
                                liveAnalysis ? renderLiveResult() : (
                                    <div className="flex-1 flex items-center justify-center text-center text-gray-500">
                                        <p>Geben Sie ein Thema ein, um den Live-Markt-Puls zu fühlen.</p>
                                    </div>
                                )
                            )
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
