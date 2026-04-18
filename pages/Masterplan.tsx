
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTasks } from '../contexts/AppContext';
import { MASTERPLAN_HIERARCHY, MasterplanNode } from '../masterplanData';

// --- ICONS ---
const IconWrapper: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        {children}
    </svg>
);

const CloseIcon: React.FC = () => (<IconWrapper className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></IconWrapper>);
const MinimizeIcon: React.FC = () => (<IconWrapper className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></IconWrapper>);
const MaximizeIcon: React.FC = () => (<IconWrapper className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 20.25v-4.5m0 4.5h-4.5m4.5 0L15 15M3.75 20.25h4.5m-4.5 0v-4.5m0 4.5L9 15m11.25-11.25h-4.5m4.5 0v4.5m0-4.5L15 9" /></IconWrapper>);
const ChevronRightIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (<IconWrapper className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></IconWrapper>);
const NexusQueryIcon: React.FC = () => (<IconWrapper className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></IconWrapper>);
const CreateTaskIcon: React.FC = () => (<IconWrapper className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></IconWrapper>);


// --- TYPES ---
interface MasterplanProps { navigateTo: (page: string) => void; isEmbedded?: boolean; }
interface WindowState { id: string; title: string; x: number; y: number; width: number; height: number; isMinimized: boolean; isMaximized: boolean; }
type DragState = { type: 'drag'; id: string; startX: number; startY: number; initialX: number; initialY: number; } | { type: 'resize'; id: string; edge: 'br'; startX: number; startY: number; initialWidth: number; initialHeight: number; };
type SaveStatus = 'idle' | 'saving' | 'saved';
interface ContextMenuState { x: number; y: number; selection: string; }
interface TaskModalState { isOpen: boolean; description: string; }

// --- RENDERER COMPONENT ---
const ContentRenderer: React.FC<{ content: string; onCitationClick: (citation: string) => void; }> = ({ content, onCitationClick }) => {
    const parts = content.split(/(\[TABLE\][\s\S]*?\[\/TABLE\])/g);

    const renderPart = (part: string) => {
        let html = part
            .replace(/^(## .*)/gm, '<h2 class="text-2xl font-bold text-white mt-6 mb-3">$1</h2>')
            .replace(/^(### .*)/gm, '<h3 class="text-xl font-semibold text-white mt-4 mb-2">$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
            .replace(/\n\s*\* (.*)/g, '<li>$1</li>')
            .replace(/\n/g, '<br />')
            .replace(/<br \/>(<li)/g, '$1')
            .replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>')
            .replace(/<\/ul><br \/><ul>/g, '');

        html = html.replace(/\[(\d+)\]/g, `<button class="text-blue-400 hover:underline text-xs align-super" data-citation="$1">[$1]</button>`);
        return html;
    };
    
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'BUTTON' && target.dataset.citation) {
                onCitationClick(target.dataset.citation);
            }
        };
        // This is a simplified way to add event listeners after render. In a real app, you'd handle this more carefully.
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [onCitationClick]);

    return (
        <>
            {parts.map((part, index) => {
                if (part.startsWith('[TABLE]')) {
                    const tableContent = part.replace('[TABLE]', '').replace('[/TABLE]', '').trim();
                    const [header, separator, ...rows] = tableContent.split('\n');
                    const headers = header.split('|').map(h => h.trim());
                    const bodyRows = rows.map(row => row.split('|').map(cell => cell.trim()));
                    return (
                        <div key={index} className="overflow-x-auto my-4">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-gray-600">{headers.map((h, i) => <th key={i} className="p-2 text-left font-semibold text-gray-200">{h}</th>)}</tr>
                                </thead>
                                <tbody>
                                    {bodyRows.map((row, i) => <tr key={i} className="border-b border-gray-700">{row.map((cell, j) => <td key={j} className="p-2" dangerouslySetInnerHTML={{ __html: cell.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />)}</tr>)}
                                </tbody>
                            </table>
                        </div>
                    );
                } else {
                    return <div key={index} dangerouslySetInnerHTML={{ __html: renderPart(part) }} />;
                }
            })}
        </>
    );
};

const CreateTaskModal: React.FC<{ initialDescription: string; onSave: (title: string, description: string) => void; onClose: () => void; }> = ({ initialDescription, onSave, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState(initialDescription);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);
    
    const handleSave = () => { if (title.trim()) onSave(title, description); };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div ref={modalRef} onClick={e => e.stopPropagation()} className="bg-[#1C1C1C]/80 backdrop-blur-2xl border border-white/10 rounded-lg shadow-2xl w-full max-w-lg m-4 p-6 page-fade-in">
                <h3 className="text-lg font-medium text-white mb-4">Neue Aufgabe aus Auswahl erstellen</h3>
                <div className="space-y-4">
                    <input type="text" value={title} autoFocus onChange={e => setTitle(e.target.value)} placeholder="Aufgabentitel" className="w-full bg-[#0A0A0A] text-white px-4 py-2 rounded-md border border-[#333333]"/>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5} className="w-full bg-[#0A0A0A] text-white px-4 py-2 rounded-md border border-[#333333]" />
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={onClose} className="border border-[#333333] text-white px-4 py-2 rounded-full font-medium text-sm">Abbrechen</button>
                    <button onClick={handleSave} className="bg-white text-black px-4 py-2 rounded-full font-medium text-sm">Aufgabe erstellen</button>
                </div>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT & SUB-COMPONENTS ---
const Masterplan: React.FC<MasterplanProps> = ({ navigateTo, isEmbedded }) => {
    const { setNexusQuery, addTask, setHighlightedTaskIds } = useTasks();
    const [openWindows, setOpenWindows] = useState<WindowState[]>([]);
    const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['phase1']));
    const [interactionState, setInteractionState] = useState<DragState | null>(null);
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
    const [taskModalState, setTaskModalState] = useState<TaskModalState>({ isOpen: false, description: '' });
    const desktopRef = useRef<HTMLDivElement>(null);

    const handleOpenWindow = (id: string, title: string) => {
        const existing = openWindows.find(w => w.id === id);
        if (existing) {
            setActiveWindowId(id);
            if (existing.isMinimized) setOpenWindows(ows => ows.map(w => w.id === id ? { ...w, isMinimized: false } : w));
            return;
        }
        const newWindow: WindowState = { id, title, x: 50 + openWindows.length * 20, y: 50 + openWindows.length * 20, width: 600, height: 400, isMinimized: false, isMaximized: false };
        setOpenWindows([...openWindows, newWindow]);
        setActiveWindowId(id);
    };
    
     const handleCitationClick = useCallback((citationNumber: string) => {
        handleOpenWindow('dci_references', 'References');
        setTimeout(() => {
            const refWindow = document.querySelector('.window-content-area[data-window-id="dci_references"]');
            if (refWindow) {
                const citationElement = refWindow.querySelector(`[data-ref-id="${citationNumber}"]`);
                if(citationElement) {
                    citationElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    (citationElement.parentElement || citationElement).classList.add('highlight-ref');
                    setTimeout(() => (citationElement.parentElement || citationElement).classList.remove('highlight-ref'), 2500);
                }
            }
        }, 300);
    }, [openWindows]);

    const handleCloseWindow = (id: string) => setOpenWindows(openWindows.filter(win => win.id !== id));
    const handleToggleMinimize = (id: string) => setOpenWindows(openWindows.map(win => win.id === id ? { ...win, isMinimized: !win.isMinimized } : win));
    const handleToggleMaximize = (id: string) => setOpenWindows(openWindows.map(win => win.id === id ? { ...win, isMaximized: !win.isMaximized } : win));
    const handleToggleExpand = (id: string) => setExpandedIds(prev => { const newSet = new Set(prev); newSet.has(id) ? newSet.delete(id) : newSet.add(id); return newSet; });
    const handleQueryNexus = (selection: string) => { setNexusQuery(selection); navigateTo('nexus'); setContextMenu(null); };
    const handleCreateTaskFromSelection = (selection: string) => { setTaskModalState({ isOpen: true, description: selection }); setContextMenu(null); };

    const handleSaveTask = (title: string, description: string) => {
        const newTaskId = addTask(title, description);
        setHighlightedTaskIds([newTaskId]);
        setTaskModalState({ isOpen: false, description: '' });
        navigateTo('meisterwerk');
    };

    useEffect(() => { const closeMenu = () => setContextMenu(null); window.addEventListener('click', closeMenu); return () => window.removeEventListener('click', closeMenu); }, []);
    
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!interactionState) return;
            if (interactionState.type === 'drag') {
                setOpenWindows(ows => ows.map(w => w.id === interactionState.id ? { ...w, x: interactionState.initialX + (e.clientX - interactionState.startX), y: interactionState.initialY + (e.clientY - interactionState.startY) } : w));
            } else if (interactionState.type === 'resize') {
                 setOpenWindows(ows => ows.map(w => w.id === interactionState.id ? { ...w, width: Math.max(300, interactionState.initialWidth + (e.clientX - interactionState.startX)), height: Math.max(200, interactionState.initialHeight + (e.clientY - interactionState.startY)) } : w));
            }
        };
        const handleMouseUp = () => setInteractionState(null);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [interactionState]);


    return (
        <>
        {taskModalState.isOpen && <CreateTaskModal initialDescription={taskModalState.description} onSave={handleSaveTask} onClose={() => setTaskModalState({ isOpen: false, description: '' })} />}
        <style>{`.highlight-ref { background-color: rgba(138, 43, 226, 0.3); transition: background-color 0.5s; box-shadow: 0 0 10px rgba(138, 43, 226, 0.5); border-radius: 4px; } .bg-grid-pattern { background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 20px 20px; }`}</style>
        <div className={`w-full flex overflow-hidden bg-[#111] ${isEmbedded ? 'h-full' : 'h-[calc(100vh-80px)]'}`}>
            <aside className="w-72 h-full bg-black/30 backdrop-blur-lg border-r border-white/10 flex flex-col flex-shrink-0 z-10">
                <header className="p-2 border-b border-white/10 flex-shrink-0"><h2 className="text-sm font-semibold text-white uppercase tracking-wider px-2">Project Explorer</h2><p className="text-xs text-gray-400 px-2">LOGIC XO</p></header>
                <div className="flex-1 overflow-y-auto py-2">
                    {MASTERPLAN_HIERARCHY.map(node => <ExplorerNode key={node.id} node={node} level={0} onFileClick={handleOpenWindow} expandedIds={expandedIds} onToggleExpand={handleToggleExpand} activeFileId={activeWindowId}/>)}
                </div>
            </aside>

            <main id="desktop" ref={desktopRef} className="flex-1 relative overflow-hidden bg-grid-pattern" onContextMenu={e => e.preventDefault()} onClick={() => setActiveWindowId(null)}>
                {openWindows.map(win => (
                    <WindowComponent
                        key={win.id} win={win} isActive={activeWindowId === win.id}
                        onClose={handleCloseWindow} onMinimize={handleToggleMinimize} onMaximize={handleToggleMaximize} onCitationClick={handleCitationClick}
                        onHeaderMouseDown={(e: React.MouseEvent) => {
                            e.stopPropagation(); e.preventDefault(); setActiveWindowId(win.id);
                            setInteractionState({ type: 'drag', id: win.id, startX: e.clientX, startY: e.clientY, initialX: win.x, initialY: win.y });
                        }}
                        onResizeMouseDown={(e: React.MouseEvent) => {
                             e.stopPropagation(); e.preventDefault(); setActiveWindowId(win.id);
                             setInteractionState({ type: 'resize', id: win.id, edge: 'br', startX: e.clientX, startY: e.clientY, initialWidth: win.width, initialHeight: win.height });
                        }}
                        onWindowClick={(e: React.MouseEvent) => { e.stopPropagation(); setActiveWindowId(win.id); }}
                        onContextMenu={(e: React.MouseEvent) => {
                            const selection = window.getSelection()?.toString().trim();
                            if (selection) {
                                e.preventDefault();
                                e.stopPropagation();
                                setContextMenu({ x: e.clientX, y: e.clientY, selection });
                            }
                        }}
                    />
                ))}
                {openWindows.length === 0 && (
                     <div className="flex flex-col items-center justify-center h-full text-gray-600 pointer-events-none">
                         <p className="text-sm">Wählen Sie eine Datei aus dem Explorer, um sie zu öffnen.</p>
                     </div>
                )}
            </main>
            {contextMenu && (
                <div style={{ top: contextMenu.y, left: contextMenu.x }} className="fixed z-50 bg-[#111] border border-white/10 rounded-md shadow-2xl p-1 animate-[fadeIn_0.1s_ease-out] w-64">
                    <button onClick={() => handleQueryNexus(contextMenu.selection)} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded-md text-gray-200 hover:bg-white/10 hover:text-white">
                        <NexusQueryIcon />
                        Nexus mit Auswahl abfragen
                    </button>
                    <button onClick={() => handleCreateTaskFromSelection(contextMenu.selection)} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded-md text-gray-200 hover:bg-white/10 hover:text-white">
                        <CreateTaskIcon />
                        Aufgabe aus Auswahl erstellen
                    </button>
                </div>
            )}
        </div>
        </>
    );
};

const ExplorerNode: React.FC<{ node: MasterplanNode; level: number; onFileClick: (id: string, title: string) => void; expandedIds: Set<string>; onToggleExpand: (id: string) => void; activeFileId: string | null; }> = ({ node, level, onFileClick, expandedIds, onToggleExpand, activeFileId }) => {
    const isParent = !!node.children;
    const isExpanded = expandedIds.has(node.id);
    const isActive = !isParent && activeFileId === node.id;
    const handleNodeClick = () => { isParent ? onToggleExpand(node.id) : onFileClick(node.id, node.title); };
    const Icon = node.icon;

    return (
        <div>
            <button onClick={handleNodeClick} className={`w-full flex items-center text-left text-sm transition-colors py-1.5 ${isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`} style={{ paddingLeft: `${level * 16 + 8}px` }}>
                {isParent ? <ChevronRightIcon className={`w-4 h-4 mr-1.5 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`} /> : <Icon />}
                <span className="truncate">{node.title}</span>
            </button>
            {isParent && isExpanded && node.children!.map(child => <ExplorerNode key={child.id} node={child} level={level + 1} onFileClick={onFileClick} expandedIds={expandedIds} onToggleExpand={onToggleExpand} activeFileId={activeFileId} />)}
        </div>
    );
};

const WindowComponent: React.FC<{ win: WindowState, isActive: boolean, onClose: (id: string) => void, onMinimize: (id: string) => void, onMaximize: (id: string) => void, onHeaderMouseDown: (e: React.MouseEvent) => void, onResizeMouseDown: (e: React.MouseEvent) => void, onWindowClick: (e: React.MouseEvent) => void; onContextMenu: (e: React.MouseEvent) => void, onCitationClick: (citation: string) => void; }> = ({ win, isActive, onClose, onMinimize, onMaximize, onHeaderMouseDown, onResizeMouseDown, onWindowClick, onContextMenu, onCitationClick }) => {
    const [content, setContent] = useState('');
    const findNodeContent = useCallback((nodes: MasterplanNode[], nodeId: string): string => {
        for (const node of nodes) {
            if (node.id === nodeId) return node.content || '';
            if (node.children) {
                const found = findNodeContent(node.children, nodeId);
                if (found) return found;
            }
        }
        return '';
    }, []);

    useEffect(() => {
        const initialContent = findNodeContent(MASTERPLAN_HIERARCHY, win.id);
        setContent(initialContent);
    }, [win.id, findNodeContent]);

    return (
        <div 
            style={{ 
                top: win.y, 
                left: win.x, 
                width: win.isMaximized ? '100%' : win.width, 
                height: win.isMaximized ? '100%' : win.height, 
                zIndex: isActive ? 10 : 5,
                transform: win.isMinimized ? 'scale(0.9) translateY(20px)' : 'scale(1) translateY(0)',
                opacity: win.isMinimized ? 0 : 1,
            }} 
            className={`absolute transition-transform,opacity duration-200 ease-in-out ${win.isMinimized ? 'pointer-events-none' : ''} ${win.isMaximized ? '!top-0 !left-0' : ''}`}
            onClick={onWindowClick}
        >
            <div className={`w-full h-full bg-[#1C1C1C]/80 backdrop-blur-xl border rounded-lg shadow-2xl flex flex-col transition-all duration-300 ${isActive ? 'border-white/20' : 'border-white/5'}`}>
                <header onMouseDown={onHeaderMouseDown} onDoubleClick={() => onMaximize(win.id)} className="h-8 bg-black/30 rounded-t-lg flex items-center justify-between px-2 cursor-move flex-shrink-0">
                    <span className="text-xs text-white truncate pr-4">{win.title}</span>
                    <div className="flex items-center gap-2"><button onClick={(e) => {e.stopPropagation(); onMinimize(win.id)}} className="w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center text-black/50 hover:text-black"><MinimizeIcon /></button><button onClick={(e) => {e.stopPropagation(); onMaximize(win.id)}} className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-black/50 hover:text-black"><MaximizeIcon /></button><button onClick={(e) => {e.stopPropagation(); onClose(win.id)}} className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-black/50 hover:text-black"><CloseIcon /></button></div>
                </header>
                <div className="flex-1 p-6 overflow-y-auto window-content-area" data-window-id={win.id} onContextMenu={onContextMenu}>
                    <div className="prose prose-sm prose-invert max-w-none text-gray-300">
                        <ContentRenderer content={content} onCitationClick={onCitationClick} />
                    </div>
                </div>
                <div onMouseDown={onResizeMouseDown} className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10" />
            </div>
        </div>
    );
};

export default Masterplan;
