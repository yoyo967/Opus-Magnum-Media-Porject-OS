
import React, { useState, useMemo } from 'react';

const ChartLineIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.75-.625m3.75.625l-6.25 3.75" />
    </svg>
);

export const ROIPredictionWidget: React.FC = () => {
    const BASE_REVENUE = 47000;
    const BASE_BUDGET = 10000;
    const [budgetShift, setBudgetShift] = useState(0);

    const projectedRevenue = useMemo(() => {
        // A simple non-linear function to simulate diminishing returns
        const shiftFactor = Math.sign(budgetShift) * Math.pow(Math.abs(budgetShift) / 5000, 0.8);
        return BASE_REVENUE + (shiftFactor * 15000);
    }, [budgetShift]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    };

    return (
        <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <ChartLineIcon /> ROI Prediction Engine
            </h3>
            <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Main Projection */}
                <div className="text-center md:text-left">
                    <p className="text-sm text-gray-400">Prognostizierter Umsatz</p>
                    <p className="text-5xl font-bold text-white tracking-tighter my-1">{formatCurrency(projectedRevenue)}</p>
                    <p className="text-sm text-gray-500">Konfidenz: ±{formatCurrency(3000)}</p>
                </div>

                {/* Details */}
                <div className="flex flex-col items-center justify-center text-center">
                     <p className="text-sm text-gray-400">Break-Even-Timeline</p>
                     <p className="text-2xl font-semibold text-green-400">Positiver ROI ab Tag 14</p>
                     <p className="text-xs text-gray-500 mt-1">Basierend auf aktueller Performance</p>
                </div>
                
                {/* What-If Slider */}
                <div className="space-y-3">
                    <label htmlFor="budget-slider" className="text-sm font-medium text-gray-300 block">"Was-wäre-wenn"-Szenario</label>
                    <input
                        id="budget-slider"
                        type="range"
                        min="-5000"
                        max="5000"
                        step="100"
                        value={budgetShift}
                        onChange={(e) => setBudgetShift(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>-5k</span>
                        <span className="font-semibold text-white">{budgetShift >= 0 ? '+' : ''}{formatCurrency(budgetShift)} Budget</span>
                        <span>+5k</span>
                    </div>
                </div>
            </div>
        </div>
    );
};