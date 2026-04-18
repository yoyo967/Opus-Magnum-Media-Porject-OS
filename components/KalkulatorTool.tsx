
import React, { useMemo, useState, useEffect } from 'react';
import { useTasks, Task } from '../contexts/AppContext';

const BudgetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125-1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const SpentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const RemainingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ROIIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.75-.625m3.75.625l-6.25 3.75" /></svg>;

const formatCurrency = (value: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#333333]">
        <div className="flex items-center gap-3">
            <div className="text-gray-400">{icon}</div>
            <div>
                <p className="text-xs text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    </div>
);

const ProgressBar: React.FC<{ value: number, max: number }> = ({ value, max }) => {
    const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
    const colorClass = percentage > 95 ? 'bg-red-500' : percentage > 75 ? 'bg-yellow-500' : 'bg-green-500';

    return (
        <div className="bg-[#0A0A0A] p-4 rounded-lg border border-[#333333]">
            <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm font-medium text-gray-300">Budget-Auslastung</span>
                <span className="text-sm font-bold text-white">{formatCurrency(value)} / {formatCurrency(max)}</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-3">
                <div className={`${colorClass} h-3 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};


const TaskCostInput: React.FC<{ task: Task, onUpdate: (taskId: number, updates: Partial<Task>) => void }> = ({ task, onUpdate }) => {
    const [budget, setBudget] = useState(task.budgetedCost || '');
    const [actual, setActual] = useState(task.actualCost || '');

    const handleBlur = (field: 'budgetedCost' | 'actualCost', value: string) => {
        const numericValue = value ? Number(value) : undefined;
        if (numericValue !== task[field]) {
            onUpdate(task.id, { [field]: numericValue });
        }
    };
    
    return (
        <div className="grid grid-cols-[1fr_100px_100px] gap-4 items-center p-2 rounded-md hover:bg-white/5">
            <p className="text-sm text-gray-300 truncate">{task.title}</p>
            <input type="number" value={budget} onChange={e => setBudget(e.target.value)} onBlur={e => handleBlur('budgetedCost', e.target.value)} placeholder="0" className="w-full bg-[#0A0A0A] text-white px-2 py-1 rounded-md border border-[#333333] text-sm text-right" />
            <input type="number" value={actual} onChange={e => setActual(e.target.value)} onBlur={e => handleBlur('actualCost', e.target.value)} placeholder="0" className="w-full bg-[#0A0A0A] text-white px-2 py-1 rounded-md border border-[#333333] text-sm text-right" />
        </div>
    );
};

interface KalkulatorToolProps {
    navigateTo: (page: string) => void;
    isEmbedded?: boolean;
}

export const KalkulatorTool: React.FC<KalkulatorToolProps> = ({ navigateTo, isEmbedded }) => {
    const { tasks, updateTask } = useTasks();

    const financials = useMemo(() => {
        const totalBudgeted = tasks.reduce((sum, task) => sum + (task.budgetedCost || 0), 0);
        const totalActual = tasks.reduce((sum, task) => sum + (task.actualCost || 0), 0);
        const remaining = totalBudgeted - totalActual;
        const roi = totalActual > 0 ? ((totalBudgeted - totalActual) / totalActual) * 100 : 0;
        return { totalBudgeted, totalActual, remaining, roi };
    }, [tasks]);
    
    return (
        <div className={isEmbedded ? "h-full overflow-y-auto p-2 space-y-6" : "space-y-8"}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Gesamtbudget" value={formatCurrency(financials.totalBudgeted)} icon={<BudgetIcon />} />
                <StatCard title="Ausgegeben" value={formatCurrency(financials.totalActual)} icon={<SpentIcon />} />
                <StatCard title="Verbleibend" value={formatCurrency(financials.remaining)} icon={<RemainingIcon />} />
                <StatCard title="Projekt-Effizienz (ROI)" value={`${financials.roi.toFixed(1)}%`} icon={<ROIIcon />} />
            </div>

            <ProgressBar value={financials.totalActual} max={financials.totalBudgeted} />

            <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Aufgaben-Budgetierung</h3>
                <div className="grid grid-cols-[1fr_100px_100px] gap-4 items-center px-2 pb-2 border-b border-white/10">
                    <p className="text-xs font-bold text-gray-400 uppercase">Aufgabe</p>
                    <p className="text-xs font-bold text-gray-400 uppercase text-right">Budget (€)</p>
                    <p className="text-xs font-bold text-gray-400 uppercase text-right">Ist-Kosten (€)</p>
                </div>
                <div className="max-h-96 overflow-y-auto mt-2 pr-2">
                    {tasks.map(task => <TaskCostInput key={task.id} task={task} onUpdate={updateTask} />)}
                </div>
            </div>
        </div>
    );
};
