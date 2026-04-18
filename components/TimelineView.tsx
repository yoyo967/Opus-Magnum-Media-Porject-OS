
import React from 'react';
import { Task } from '../contexts/AppContext';

interface TimelineViewProps {
    tasks: Task[];
}

const statusColors: { [key in Task['status']]: string } = {
    todo: 'bg-blue-500/70',
    inprogress: 'bg-yellow-500/70',
    review: 'bg-orange-500/70',
    done: 'bg-green-500/70',
};

export const TimelineView: React.FC<TimelineViewProps> = ({ tasks }) => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 10); // Start timeline 10 days ago

    const totalDays = 30;

    const getTaskPosition = (task: Task, index: number) => {
        let startDay = 0;
        let duration = 3; // Default duration

        switch (task.status) {
            case 'done':
                startDay = index % 5; // Stagger done tasks in the first 5 days
                duration = 2;
                break;
            case 'inprogress':
                startDay = 10; // In progress tasks start around "today"
                duration = 5;
                break;
            case 'review':
                startDay = 15; // Review tasks start after in-progress
                duration = 2;
                break;
            case 'todo':
                startDay = 17 + (index % 10); // Stagger todo tasks in the future
                duration = 4;
                break;
        }

        return {
            left: `${(startDay / totalDays) * 100}%`,
            width: `${(duration / totalDays) * 100}%`,
        };
    };

    return (
        <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] p-6 page-fade-in">
            <h3 className="text-lg font-semibold text-white mb-4">Campaign Timeline</h3>
            <div className="space-y-3">
                {/* Header */}
                <div className="grid grid-cols-[200px_1fr] gap-4 items-center mb-2">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Task</div>
                    <div className="relative h-4">
                        <div className="grid grid-cols-4 w-full text-center text-xs text-gray-500">
                            <span>Week 1</span>
                            <span>Week 2</span>
                            <span>Week 3</span>
                            <span>Week 4</span>
                        </div>
                    </div>
                </div>

                {/* Timeline Body */}
                <div className="relative">
                    {/* Background Grid */}
                    <div className="absolute top-0 left-[216px] right-0 bottom-0 grid grid-cols-4 border-l border-white/10">
                        <div className="border-r border-white/10"></div>
                        <div className="border-r border-white/10"></div>
                        <div className="border-r border-white/10"></div>
                        <div></div>
                    </div>

                    {tasks.map((task, index) => {
                        const { left, width } = getTaskPosition(task, index);
                        return (
                            <div key={task.id} className="grid grid-cols-[200px_1fr] gap-4 items-center h-12">
                                <div className="truncate text-sm text-gray-300 pr-2">{task.title}</div>
                                <div className="relative h-full">
                                    <div
                                        className={`absolute top-1/2 -translate-y-1/2 h-6 rounded flex items-center px-2 ${statusColors[task.status]}`}
                                        style={{ left, width }}
                                        title={`${task.title} (${task.status})`}
                                    >
                                        <span className="text-xs text-white font-medium truncate hidden sm:inline">{task.title}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
