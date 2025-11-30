
import { Send } from 'lucide-react';

interface AnalysisFormProps {
    description: string;
    onDescriptionChange: (value: string) => void;
    onAnalyze: () => void;
    isAnalyzing: boolean;
    hasImages: boolean;
}

export function AnalysisForm({
    description,
    onDescriptionChange,
    onAnalyze,
    isAnalyzing,
    hasImages
}: AnalysisFormProps) {
    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                    Additional Details (Optional)
                </label>
                <textarea
                    id="description"
                    rows={3}
                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 resize-none"
                    placeholder="e.g., 'Spaghetti bolognese with parmesan' or 'Menu from Italian restaurant'"
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                />
            </div>

            <button
                onClick={onAnalyze}
                disabled={!hasImages || isAnalyzing}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isAnalyzing ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing...
                    </>
                ) : (
                    <>
                        <Send className="w-5 h-5" />
                        Analyze Food
                    </>
                )}
            </button>
        </div>
    );
}
