
import React, { useState } from 'react';
import { generateImageWithGemini } from './services/geminiService';
import { AspectRatio, Resolution, GeneratedImage } from './types';
import { SettingsCard, ToggleOption } from './components/SettingsCard';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [resolution, setResolution] = useState<Resolution>('2K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [editingSource, setEditingSource] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const sourceImageParam = editingSource 
        ? { data: editingSource.url, mimeType: 'image/jpeg' }
        : undefined;

      const imageUrl = await generateImageWithGemini(
        prompt, 
        aspectRatio, 
        resolution, 
        sourceImageParam
      );
      
      const newImage: GeneratedImage = {
        id: Math.random().toString(36).substring(7),
        url: imageUrl,
        prompt: prompt,
        timestamp: Date.now(),
        config: { aspectRatio, resolution }
      };

      setCurrentImage(newImage);
      setHistory(prev => [newImage, ...prev]);
      // Clear editing state after successful modification
      setEditingSource(null);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const startEditing = (img: GeneratedImage) => {
    setEditingSource(img);
    // Optional: Pre-fill prompt with a hint for editing
    // setPrompt(`Modify this image by adding...`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingSource(null);
    setPrompt('');
  };

  const downloadImage = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 mb-8 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Visionary <span className="gradient-text">AI</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
            <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-xs font-mono">Nano Banana Pro</span>
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              Billing Docs
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Input & Controls */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <section className="glass-panel p-6 rounded-3xl shadow-2xl flex flex-col gap-6">
            
            {editingSource && (
              <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-blue-500/50">
                    <img src={editingSource.url} className="w-full h-full object-cover" alt="Source" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Editing Mode</p>
                    <p className="text-[10px] text-slate-400 line-clamp-1">Modifying base image</p>
                  </div>
                </div>
                <button 
                  onClick={cancelEditing}
                  className="p-1 hover:bg-slate-800 rounded-full text-slate-400"
                  title="Cancel editing"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                {editingSource ? 'How should we modify it?' : 'Your Prompt'}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={editingSource ? "e.g. 'Add a sunset', 'Change the background to Mars'..." : "Describe the image you want to create..."}
                className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none placeholder:text-slate-600"
              />
            </div>

            <SettingsCard title="Aspect Ratio">
              <ToggleOption label="1:1" active={aspectRatio === '1:1'} onClick={() => setAspectRatio('1:1')} />
              <ToggleOption label="16:9" active={aspectRatio === '16:9'} onClick={() => setAspectRatio('16:9')} />
              <ToggleOption label="9:16" active={aspectRatio === '9:16'} onClick={() => setAspectRatio('9:16')} />
            </SettingsCard>

            <SettingsCard title="Resolution">
              <ToggleOption label="2K" active={resolution === '2K'} onClick={() => setResolution('2K')} />
              <ToggleOption label="4K" active={resolution === '4K'} onClick={() => setResolution('4K')} />
            </SettingsCard>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                isGenerating 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : editingSource 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-900/30'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-900/30'
              }`}
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-slate-500" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{editingSource ? 'Applying Changes...' : 'Engaging Engine...'}</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingSource ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M13 10V3L4 14h7v7l9-11h-7z"} />
                  </svg>
                  <span>{editingSource ? 'Apply Modifications' : 'Generate Vision'}</span>
                </>
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-sm flex gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Preview & Gallery */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          {/* Main Preview */}
          <section className="relative min-h-[500px] flex items-center justify-center bg-slate-900/40 rounded-[2.5rem] border border-slate-800/50 overflow-hidden group">
            {!currentImage && !isGenerating ? (
              <div className="flex flex-col items-center gap-4 text-slate-500 px-8 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-2">
                   <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-slate-400">Ready for Creation</h3>
                <p className="max-w-xs text-sm">Describe your vision or select an existing image from history to modify it.</p>
              </div>
            ) : isGenerating ? (
              <div className="flex flex-col items-center gap-6">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
                <div className="flex flex-col items-center animate-pulse">
                  <span className="text-lg font-semibold text-blue-400">{editingSource ? 'Transforming Vision' : 'Synthesizing Pixels'}</span>
                  <span className="text-sm text-slate-500">Gemini 3 Pro Nano Banana in progress...</span>
                </div>
              </div>
            ) : currentImage && (
              <div className="relative w-full h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center p-8">
                    <img 
                      src={currentImage.url} 
                      alt={currentImage.prompt} 
                      className="max-w-full max-h-[70vh] rounded-2xl shadow-2xl object-contain transition-transform duration-500 group-hover:scale-[1.01]"
                    />
                </div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={() => startEditing(currentImage)}
                    className="px-6 py-2 bg-blue-600/90 backdrop-blur-md border border-blue-400/30 rounded-full text-white text-sm font-medium hover:bg-blue-500 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Modify
                  </button>
                  <button 
                    onClick={() => downloadImage(currentImage.url, `visionary-${currentImage.id}`)}
                    className="px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium hover:bg-white/20 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* History Gallery */}
          {history.length > 0 && (
            <section className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  Recent <span className="text-slate-500 font-medium">Creations</span>
                </h2>
                <span className="text-xs text-slate-500 font-mono">{history.length} images stored locally</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {history.map((img) => (
                  <div 
                    key={img.id} 
                    className={`relative cursor-pointer aspect-square rounded-2xl overflow-hidden border-2 transition-all group ${
                      currentImage?.id === img.id ? 'border-blue-500' : 'border-transparent hover:border-slate-600'
                    }`}
                  >
                    <img src={img.url} className="w-full h-full object-cover" alt={img.prompt} onClick={() => setCurrentImage(img)} />
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                        onClick={(e) => { e.stopPropagation(); startEditing(img); }}
                        className="p-1.5 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500"
                        title="Modify this image"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 pointer-events-none">
                      <p className="text-[10px] text-white line-clamp-2 leading-tight">{img.prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="max-w-7xl mx-auto px-6 mt-12 text-center text-slate-600 text-xs">
        <p>© 2024 Visionary AI • Powered by Gemini 3 Pro Image • No cookies, no trackers</p>
      </footer>
    </div>
  );
};

export default App;
