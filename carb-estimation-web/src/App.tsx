import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ImageUpload } from './components/ImageUpload';
import { AnalysisForm } from './components/AnalysisForm';
import { ResultsDisplay, type FoodItem } from './components/ResultsDisplay';
import { ApiKeyInput } from './components/ApiKeyInput';
import { analyzeImage } from './services/gemini';

function App() {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<FoodItem[]>([]);
  const [apiKey, setApiKey] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) setApiKey(storedKey);
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const handleResetKey = () => {
    setApiKey('');
    localStorage.removeItem('gemini_api_key');
    setResults([]);
    setSelectedImages([]);
  };

  const handleImagesSelected = (files: File[]) => {
    setSelectedImages(prev => [...prev, ...files]);
    if (results.length > 0) setResults([]);
    setError(null);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (!apiKey) return;

    setIsAnalyzing(true);
    setResults([]);
    setError(null);

    try {
      // Process the first image for now (Gemini Multimodal)
      const imageToAnalyze = selectedImages[0];
      const analysisResults = await analyzeImage(imageToAnalyze, description, apiKey);
      setResults(analysisResults);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze image. Please check your API key and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout onResetKey={apiKey ? handleResetKey : undefined}>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Analyze Your Meal</h2>
          <p className="text-slate-600">
            Upload a photo of your food or menu to get instant carbohydrate and GI estimates.
          </p>
        </div>

        {!apiKey ? (
          <ApiKeyInput onSave={handleSaveApiKey} />
        ) : (
          <>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-8">
              <section>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">1. Upload Images</h3>
                <ImageUpload
                  onImagesSelected={handleImagesSelected}
                  selectedImages={selectedImages}
                  onRemoveImage={handleRemoveImage}
                />
              </section>

              <section>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">2. Add Details</h3>
                <AnalysisForm
                  description={description}
                  onDescriptionChange={setDescription}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                  hasImages={selectedImages.length > 0}
                />
              </section>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 text-center">
                {error}
              </div>
            )}

            <ResultsDisplay items={results} />
          </>
        )}
      </div>
    </Layout>
  );
}

export default App;
