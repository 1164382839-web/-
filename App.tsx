import React, { useState, useRef } from 'react';
import { UploadZone } from './components/UploadZone';
import { Button } from './components/Button';
import { generateSketchFromImage } from './services/geminiService';
import { AppState, SketchStyle, ProcessingError } from './types';
import { Download, RefreshCw, X, ArrowRight, Wand2, Image as ImageIcon } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [sketchImage, setSketchImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<SketchStyle>(SketchStyle.PENCIL);
  const [error, setError] = useState<ProcessingError | null>(null);

  const styles = Object.values(SketchStyle);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setOriginalImage(e.target.result as string);
        setAppState(AppState.PREVIEW);
        setSketchImage(null);
        setError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!originalImage) return;

    setAppState(AppState.PROCESSING);
    setError(null);

    try {
      const result = await generateSketchFromImage(originalImage, selectedStyle);
      setSketchImage(result);
      setAppState(AppState.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setError({ message: err.message || 'Failed to generate sketch. Please try again.' });
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setOriginalImage(null);
    setSketchImage(null);
    setError(null);
  };

  const handleDownload = () => {
    if (sketchImage) {
      const link = document.createElement('a');
      link.href = sketchImage;
      link.download = `sketchify-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-200">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 bg-opacity-80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
              <Wand2 size={18} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Sketchify<span className="text-slate-400 font-normal">.ai</span></h1>
          </div>
          <div className="flex items-center gap-4">
             {appState !== AppState.IDLE && (
                <button 
                  onClick={handleReset}
                  className="text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors"
                >
                  New Sketch
                </button>
             )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* State: IDLE - Upload Area */}
        {appState === AppState.IDLE && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up">
            <div className="text-center mb-10 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-hand leading-tight">
                Turn your memories into <span className="text-blue-600">works of art</span>.
              </h2>
              <p className="text-lg text-slate-600">
                Upload a photo and let our AI sketch artist recreate it in seconds. 
                Choose from pencil, charcoal, ink, and more.
              </p>
            </div>
            <UploadZone onFileSelect={handleFileSelect} />
          </div>
        )}

        {/* State: PREVIEW, PROCESSING, COMPLETE, ERROR */}
        {appState !== AppState.IDLE && (
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
            
            {/* Sidebar / Configuration - Hidden on mobile if viewing result? No, keep sticky */}
            <div className="w-full lg:w-1/3 space-y-6 lg:sticky lg:top-24">
              
              {/* Style Selector */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
                  Artistic Style
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  {styles.map((style) => (
                    <button
                      key={style}
                      onClick={() => setSelectedStyle(style)}
                      disabled={appState === AppState.PROCESSING}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 text-left ${
                        selectedStyle === style 
                          ? 'border-blue-600 bg-blue-50 text-blue-800 ring-1 ring-blue-600' 
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="font-medium">{style}</span>
                      {selectedStyle === style && (
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  {appState === AppState.PROCESSING ? (
                     <Button 
                       fullWidth 
                       isLoading 
                       className="w-full"
                       variant="primary"
                     >
                       Sketching...
                     </Button>
                  ) : appState === AppState.COMPLETE ? (
                    <div className="flex flex-col gap-3">
                       <Button 
                        onClick={handleDownload} 
                        variant="primary" 
                        className="w-full"
                        icon={<Download size={18} />}
                      >
                        Download Sketch
                      </Button>
                       <Button 
                        onClick={handleGenerate} 
                        variant="secondary" 
                        className="w-full"
                        icon={<RefreshCw size={18} />}
                      >
                        Regenerate
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={handleGenerate} 
                      variant="primary" 
                      className="w-full"
                      icon={<Wand2 size={18} />}
                    >
                      Convert to Sketch
                    </Button>
                  )}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-slate-100 rounded-2xl p-6 text-sm text-slate-600">
                <p className="font-medium text-slate-900 mb-2">Pro Tip:</p>
                <p>Photos with good lighting and clear subjects produce the best sketches. High contrast images work great for Charcoal style.</p>
              </div>
            </div>

            {/* Main Visual Area */}
            <div className="w-full lg:w-2/3 space-y-6">
              
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
                  <X size={20} />
                  <p>{error.message}</p>
                </div>
              )}

              {/* Before / After Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original */}
                <div className="space-y-3">
                   <div className="flex items-center justify-between text-sm font-medium text-slate-500 uppercase tracking-wider">
                      <span>Original</span>
                      <button onClick={handleReset} className="text-xs text-red-500 hover:text-red-700">Change</button>
                   </div>
                   <div className="relative group rounded-2xl overflow-hidden bg-slate-200 aspect-[4/5] shadow-inner border border-slate-200">
                      {originalImage && (
                        <img 
                          src={originalImage} 
                          alt="Original" 
                          className="w-full h-full object-cover" 
                        />
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                   </div>
                </div>

                {/* Result */}
                <div className="space-y-3">
                   <div className="flex items-center justify-between text-sm font-medium text-slate-500 uppercase tracking-wider">
                      <span>Sketch Result</span>
                      {sketchImage && <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Ready</span>}
                   </div>
                   <div className="relative rounded-2xl overflow-hidden bg-white aspect-[4/5] shadow-lg border-4 border-white flex items-center justify-center">
                      
                      {appState === AppState.PROCESSING && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10">
                          <div className="relative w-20 h-20 mb-4">
                            <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                          </div>
                          <p className="text-slate-600 font-medium animate-pulse">Drawing...</p>
                        </div>
                      )}

                      {sketchImage ? (
                        <img 
                          src={sketchImage} 
                          alt="Sketch" 
                          className="w-full h-full object-cover animate-in fade-in duration-700" 
                        />
                      ) : (
                        <div className="text-slate-300 flex flex-col items-center">
                          <ImageIcon size={48} className="mb-2 opacity-50" />
                          <p className="text-sm">Preview will appear here</p>
                        </div>
                      )}
                   </div>
                </div>
              </div>

              {sketchImage && (
                 <div className="flex justify-center md:justify-end mt-4">
                    <p className="text-xs text-slate-400 italic">
                      Generated by Gemini 2.5 Flash Image Model
                    </p>
                 </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default App;