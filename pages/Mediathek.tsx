
import React, { useState, useMemo } from 'react';
import { useTasks, Task } from '../contexts/AppContext';

const Mediathek: React.FC<{ navigateTo: (page: string) => void }> = () => {
    const { tasks, indexTaskAsset } = useTasks();
    const [searchTerm, setSearchTerm] = useState('');
    const [isIndexing, setIsIndexing] = useState(false);

    const assets = useMemo(() => tasks.filter(t => t.imageUrl || t.videoUrl), [tasks]);
    const unindexedAssets = assets.filter(a => !a.assetMetadata);

    const filteredAssets = useMemo(() => {
        if (!searchTerm.trim()) return assets;
        const lowerCaseSearch = searchTerm.toLowerCase();
        return assets.filter(asset => 
            asset.title.toLowerCase().includes(lowerCaseSearch) ||
            asset.description.toLowerCase().includes(lowerCaseSearch) ||
            asset.assetMetadata?.description.toLowerCase().includes(lowerCaseSearch) ||
            asset.assetMetadata?.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearch))
        );
    }, [assets, searchTerm]);

    const handleAnalyze = async () => {
        setIsIndexing(true);
        for (const asset of unindexedAssets) {
            await indexTaskAsset(asset.id);
        }
        setIsIndexing(false);
    };
    
    return (
        <div className="container mx-auto px-6 py-16">
            <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-[#F5F5F5]">Library</h1>
                <p className="mt-2 text-[#888888] max-w-3xl mx-auto">
                    Your central, intelligent library for all brand assets. Find content based on visual concepts, not just filenames.
                </p>
            </header>
            <main>
                <div className="bg-[#1C1C1C] rounded-lg border border-[#333333] p-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search for concepts (e.g., 'futuristic', 'urban')..."
                            className="w-full md:w-1/2 bg-[#0A0A0A] text-white px-4 py-2 rounded-full border border-[#333333] focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                        />
                        <button
                            onClick={handleAnalyze}
                            disabled={isIndexing || unindexedAssets.length === 0}
                            className="w-full md:w-auto bg-white text-black px-5 py-2 rounded-full font-medium text-sm disabled:opacity-50"
                        >
                            {isIndexing ? 'Indexing...' : `Analyze ${unindexedAssets.length} new assets`}
                        </button>
                    </div>

                    {filteredAssets.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredAssets.map(asset => (
                                <div key={asset.id} className="bg-[#0A0A0A] rounded-md border border-[#333333] overflow-hidden group">
                                    <div className="aspect-video bg-black">
                                        {asset.videoUrl ? <video src={asset.videoUrl} loop autoPlay muted className="w-full h-full object-cover"/> : <img src={asset.imageUrl} alt={asset.title} className="w-full h-full object-cover"/>}
                                    </div>
                                    <div className="p-3">
                                        <h4 className="font-semibold text-white text-sm truncate">{asset.title}</h4>
                                        {asset.assetMetadata ? (
                                            <>
                                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{asset.assetMetadata.description}</p>
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {asset.assetMetadata.tags.slice(0, 3).map(tag => <span key={tag} className="text-[10px] bg-gray-700/50 text-gray-300 px-1.5 py-0.5 rounded-full">{tag}</span>)}
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-xs text-yellow-400/70 mt-1">Not indexed</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <p>No assets found.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Mediathek;
