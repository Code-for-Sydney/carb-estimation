import { useState } from 'react';
import { Key, Save } from 'lucide-react';

interface ApiKeyInputProps {
    onSave: (key: string) => void;
}

export function ApiKeyInput({ onSave }: ApiKeyInputProps) {
    const [key, setKey] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (key.trim()) {
            onSave(key.trim());
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center space-y-4 max-w-md mx-auto">
            <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <Key className="w-6 h-6" />
            </div>

            <div>
                <h3 className="text-lg font-semibold text-slate-900">Enter API Key</h3>
                <p className="text-sm text-slate-500 mt-1">
                    To use the advanced AI features, please provide your Google Gemini API Key.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="password"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
                <button
                    type="submit"
                    disabled={!key.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    Save API Key
                </button>
            </form>

            <p className="text-xs text-slate-400">
                Your key is stored locally in your browser and never sent to our servers.
            </p>
        </div>
    );
}
