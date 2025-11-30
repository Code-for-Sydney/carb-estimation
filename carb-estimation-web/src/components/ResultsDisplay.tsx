
import { Activity, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

export interface FoodItem {
    name: string;
    carbs: number; // grams
    gi: number; // glycemic index
    confidence: number; // 0-1
}

interface ResultsDisplayProps {
    items: FoodItem[];
}

export function ResultsDisplay({ items }: ResultsDisplayProps) {

    const getGiColor = (gi: number) => {
        if (gi < 55) return "text-emerald-600 bg-emerald-50 border-emerald-200";
        if (gi < 70) return "text-amber-600 bg-amber-50 border-amber-200";
        return "text-red-600 bg-red-50 border-red-200";
    };

    const getGiLabel = (gi: number) => {
        if (gi < 55) return "Low GI";
        if (gi < 70) return "Medium GI";
        return "High GI";
    };

    if (items.length === 0) return null;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-600" />
                        Analysis Results
                    </h2>
                    <span className="text-sm text-slate-500">
                        {items.length} item{items.length !== 1 ? 's' : ''} identified
                    </span>
                </div>

                <div className="divide-y divide-slate-100">
                    {items.map((item, index) => (
                        <div key={index} className="p-6 flex items-start justify-between gap-4">
                            <div>
                                <h3 className="font-medium text-slate-900 text-lg">{item.name}</h3>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className={clsx("px-2.5 py-0.5 rounded-full text-xs font-medium border", getGiColor(item.gi))}>
                                        GI: {item.gi} ({getGiLabel(item.gi)})
                                    </span>
                                    <span className="text-sm text-slate-500">
                                        Confidence: {Math.round(item.confidence * 100)}%
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-slate-900">{item.carbs}g</div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Carbs</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-3 p-4 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>
                    These are estimates based on visual analysis. Actual nutritional content may vary based on ingredients and portion sizes.
                    Always consult with a healthcare professional for medical advice.
                </p>
            </div>
        </div>
    );
}
