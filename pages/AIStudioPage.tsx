
import React, { useState, useRef } from 'react';
import SEO from '../components/SEO';
import { 
    generateSmartText, 
    generateImage, 
    editImage, 
    generateVideo, 
    analyzeMedia 
} from '../services/geminiService';
import Spinner from '../components/Spinner';

const AIStudioPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'text' | 'image' | 'video' | 'analyze'>('text');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Common State
    const [prompt, setPrompt] = useState('');
    
    // Text State
    const [textMode, setTextMode] = useState<'fast' | 'thinking' | 'search' | 'standard'>('standard');
    const [textResult, setTextResult] = useState<{ text?: string, groundingUrls?: string[] } | null>(null);

    // Image State
    const [imageAspectRatio, setImageAspectRatio] = useState('1:1');
    const [imageSize, setImageSize] = useState('1K');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [editSourceImage, setEditSourceImage] = useState<{ base64: string, mimeType: string } | null>(null);

    // Video State
    const [videoAspectRatio, setVideoAspectRatio] = useState('16:9');
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [videoSourceImage, setVideoSourceImage] = useState<{ base64: string, mimeType: string } | null>(null);

    // Analyze State
    const [analyzeFile, setAnalyzeFile] = useState<{ base64: string, mimeType: string } | null>(null);
    const [analyzeResult, setAnalyzeResult] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    // --- Helpers ---
    const checkApiKey = async () => {
       const win = window as any;
       if (win.aistudio && win.aistudio.hasSelectedApiKey) {
           const hasKey = await win.aistudio.hasSelectedApiKey();
           if (!hasKey) {
               await win.aistudio.openSelectKey();
           }
       }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setFile: (file: any) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFile({
                    base64: reader.result as string,
                    mimeType: file.type
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            const chunks: Blob[] = [];

            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' }); // Chrome uses webm
                const reader = new FileReader();
                reader.onloadend = () => {
                    setAnalyzeFile({
                        base64: reader.result as string,
                        mimeType: 'audio/webm' // Common standard for web recording
                    });
                };
                reader.readAsDataURL(blob);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            setError("Could not access microphone.");
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    };


    // --- Handlers ---
    const handleGenerateText = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateSmartText(prompt, textMode);
            setTextResult(result);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateImage = async () => {
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);
        try {
            let result;
            if (editSourceImage) {
                // Editing mode (Flash Image - no paid key check strictly required by prompt instructions, but good practice)
                result = await editImage(editSourceImage.base64, editSourceImage.mimeType, prompt);
            } else {
                // Generation mode (Pro Image - Requires Paid Key)
                await checkApiKey();
                result = await generateImage(prompt, imageAspectRatio, imageSize);
            }
            setGeneratedImage(result);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateVideo = async () => {
        await checkApiKey(); // Veo requires paid key
        setIsLoading(true);
        setError(null);
        setGeneratedVideoUrl(null);
        try {
            const result = await generateVideo(
                prompt, 
                videoSourceImage?.base64 || null, 
                videoSourceImage?.mimeType || null, 
                videoAspectRatio
            );
            setGeneratedVideoUrl(result);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnalyze = async () => {
        if (!analyzeFile) {
            setError("Please upload a file or record audio.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await analyzeMedia(analyzeFile.base64, analyzeFile.mimeType, prompt);
            setAnalyzeResult(result);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-10">
            <SEO title="AI Studio" description="Create and Edit with Gemini AI" />
            
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight flex items-center justify-center gap-3">
                        <i className="fas fa-magic text-blue-600"></i> Creative Studio
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Harness the power of Gemini 2.5 and Veo to generate text, images, and video.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm inline-flex mx-auto w-full md:w-auto">
                    {[
                        { id: 'text', label: 'Writer', icon: 'fa-pen-nib' },
                        { id: 'image', label: 'Imager', icon: 'fa-image' },
                        { id: 'video', label: 'Video', icon: 'fa-video' },
                        { id: 'analyze', label: 'Analyzer', icon: 'fa-eye' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id as any); setPrompt(''); setError(null); }}
                            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                                activeTab === tab.id 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'bg-transparent text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <i className={`fas ${tab.icon}`}></i> {tab.label}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10 min-h-[500px]">
                    {error && (
                        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-center">
                            <i className="fas fa-exclamation-circle mr-3"></i> {error}
                        </div>
                    )}

                    {/* TEXT TAB */}
                    {activeTab === 'text' && (
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-4 mb-4">
                                <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer ${textMode === 'standard' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200'}`}>
                                    <input type="radio" name="mode" className="hidden" checked={textMode === 'standard'} onChange={() => setTextMode('standard')} />
                                    <i className="fas fa-star"></i> Standard (Pro)
                                </label>
                                <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer ${textMode === 'fast' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-gray-200'}`}>
                                    <input type="radio" name="mode" className="hidden" checked={textMode === 'fast'} onChange={() => setTextMode('fast')} />
                                    <i className="fas fa-bolt"></i> Fast (Lite)
                                </label>
                                <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer ${textMode === 'thinking' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'bg-white border-gray-200'}`}>
                                    <input type="radio" name="mode" className="hidden" checked={textMode === 'thinking'} onChange={() => setTextMode('thinking')} />
                                    <i className="fas fa-brain"></i> Deep Thinking
                                </label>
                                <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer ${textMode === 'search' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'bg-white border-gray-200'}`}>
                                    <input type="radio" name="mode" className="hidden" checked={textMode === 'search'} onChange={() => setTextMode('search')} />
                                    <i className="fab fa-google"></i> Search Grounding
                                </label>
                            </div>

                            <textarea 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="What would you like to write about?"
                                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none min-h-[150px] text-lg font-medium"
                            />
                            
                            <button 
                                onClick={handleGenerateText} 
                                disabled={isLoading || !prompt.trim()}
                                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
                            >
                                {isLoading ? <Spinner /> : <><i className="fas fa-pen-fancy"></i> Generate Text</>}
                            </button>

                            {textResult && (
                                <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200 prose max-w-none">
                                    <div dangerouslySetInnerHTML={{ __html: textResult.text?.replace(/\n/g, '<br/>') || '' }} />
                                    {textResult.groundingUrls && textResult.groundingUrls.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <h4 className="text-sm font-bold text-gray-500 uppercase">Sources</h4>
                                            <ul className="list-disc pl-5 text-sm text-blue-600">
                                                {textResult.groundingUrls.map((url, i) => (
                                                    <li key={i}><a href={url} target="_blank" rel="noreferrer" className="hover:underline">{url}</a></li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* IMAGE TAB */}
                    {activeTab === 'image' && (
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="block font-bold text-gray-700">Prompt</label>
                                    <textarea 
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Describe the image you want to create or edit..."
                                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                                    />
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-600 mb-1">Aspect Ratio</label>
                                            <select 
                                                value={imageAspectRatio} 
                                                onChange={(e) => setImageAspectRatio(e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-lg"
                                                disabled={!!editSourceImage}
                                            >
                                                <option value="1:1">1:1</option>
                                                <option value="16:9">16:9</option>
                                                <option value="9:16">9:16</option>
                                                <option value="4:3">4:3</option>
                                                <option value="3:4">3:4</option>
                                                <option value="3:2">3:2</option>
                                                <option value="2:3">2:3</option>
                                                <option value="21:9">21:9</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-600 mb-1">Size (Quality)</label>
                                            <select 
                                                value={imageSize} 
                                                onChange={(e) => setImageSize(e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-lg"
                                                disabled={!!editSourceImage}
                                            >
                                                <option value="1K">1K</option>
                                                <option value="2K">2K</option>
                                                <option value="4K">4K</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                        <label className="block text-sm font-bold text-gray-600 mb-2">Image to Edit (Optional)</label>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, setEditSourceImage)}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Upload to enable editing mode (Flash Image)</p>
                                        {editSourceImage && <p className="text-xs text-green-600 mt-2"><i className="fas fa-check"></i> Image loaded for editing</p>}
                                        {editSourceImage && (
                                            <button onClick={() => setEditSourceImage(null)} className="text-xs text-red-500 underline mt-1">Clear Image</button>
                                        )}
                                    </div>

                                    <button 
                                        onClick={handleGenerateImage} 
                                        disabled={isLoading || !prompt.trim()}
                                        className="w-full bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition"
                                    >
                                        {isLoading ? <Spinner /> : <>{editSourceImage ? 'Edit Image (Flash)' : 'Generate Image (Pro)'}</>}
                                    </button>
                                </div>

                                <div className="flex items-center justify-center bg-gray-100 rounded-2xl min-h-[300px] border border-gray-200 overflow-hidden">
                                    {generatedImage ? (
                                        <img src={generatedImage} alt="Generated" className="max-w-full max-h-[400px] rounded-xl shadow-lg" />
                                    ) : (
                                        <div className="text-gray-400 text-center">
                                            <i className="fas fa-image text-4xl mb-2"></i>
                                            <p>Your creation will appear here</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* VIDEO TAB */}
                    {activeTab === 'video' && (
                        <div className="space-y-6">
                             <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="block font-bold text-gray-700">Prompt (Veo)</label>
                                    <textarea 
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Describe the video you want to generate..."
                                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                                    />
                                    
                                     <div>
                                        <label className="block text-sm font-bold text-gray-600 mb-1">Aspect Ratio</label>
                                        <select 
                                            value={videoAspectRatio} 
                                            onChange={(e) => setVideoAspectRatio(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                        >
                                            <option value="16:9">16:9 (Landscape)</option>
                                            <option value="9:16">9:16 (Portrait)</option>
                                        </select>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                        <label className="block text-sm font-bold text-gray-600 mb-2">Starting Image (Optional)</label>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, setVideoSourceImage)}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        {videoSourceImage && <p className="text-xs text-green-600 mt-2"><i className="fas fa-check"></i> Start image loaded</p>}
                                    </div>

                                    <button 
                                        onClick={handleGenerateVideo} 
                                        disabled={isLoading || !prompt.trim()}
                                        className="w-full bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition"
                                    >
                                        {isLoading ? <span className="flex items-center justify-center gap-2"><Spinner /> Generating (Wait for it)...</span> : 'Generate Video (Veo)'}
                                    </button>
                                </div>
                                
                                <div className="flex items-center justify-center bg-gray-900 rounded-2xl min-h-[300px] border border-gray-800">
                                     {generatedVideoUrl ? (
                                        <video controls src={generatedVideoUrl} className="max-w-full max-h-[400px] rounded-xl shadow-lg" />
                                    ) : (
                                        <div className="text-gray-600 text-center">
                                            <i className="fas fa-film text-4xl mb-2"></i>
                                            <p>Video preview</p>
                                        </div>
                                    )}
                                </div>
                             </div>
                        </div>
                    )}

                    {/* ANALYZE TAB */}
                    {activeTab === 'analyze' && (
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="block font-bold text-gray-700">Media Input</label>
                                    
                                    <div className="flex gap-4">
                                        <div className="flex-1 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                            <label className="block text-sm font-bold text-gray-600 mb-2">Upload File (Image/Video/Audio)</label>
                                            <input 
                                                type="file" 
                                                accept="image/*,video/*,audio/*"
                                                onChange={(e) => handleFileUpload(e, setAnalyzeFile)}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                        </div>
                                        <div className="flex-none flex items-center">
                                            <button 
                                                onClick={isRecording ? stopRecording : startRecording}
                                                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-all ${isRecording ? 'bg-red-500 animate-pulse text-white' : 'bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-500'}`}
                                                title="Record Audio"
                                            >
                                                <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {analyzeFile && (
                                        <div className="text-sm text-blue-600 font-bold bg-blue-50 p-2 rounded-lg">
                                            <i className="fas fa-file mr-2"></i> File Ready: {analyzeFile.mimeType}
                                        </div>
                                    )}

                                    <textarea 
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Ask something about the media (e.g. 'Transcribe this', 'Describe the scene')..."
                                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                                    />

                                    <button 
                                        onClick={handleAnalyze} 
                                        disabled={isLoading || !analyzeFile}
                                        className="w-full bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition"
                                    >
                                        {isLoading ? <Spinner /> : 'Analyze with Gemini'}
                                    </button>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 min-h-[300px]">
                                    <h3 className="font-bold text-gray-700 mb-4 uppercase text-sm tracking-wider">Analysis Result</h3>
                                    {analyzeResult ? (
                                        <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{analyzeResult}</p>
                                    ) : (
                                        <p className="text-gray-400 italic">Analysis output will appear here...</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AIStudioPage;
