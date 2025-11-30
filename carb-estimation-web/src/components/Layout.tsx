import { UtensilsCrossed, Settings } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    onResetKey?: () => void;
}

export function Layout({ children, onResetKey }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-emerald-500 p-2 rounded-lg">
                            <UtensilsCrossed className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-slate-900">CarbEstimate AI</h1>
                    </div>
                    <nav className="flex items-center gap-4">
                        {onResetKey && (
                            <button
                                onClick={onResetKey}
                                className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors flex items-center gap-1"
                            >
                                <Settings className="w-4 h-4" />
                                Change API Key
                            </button>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {children}
            </main>

            <footer className="bg-white border-t border-slate-200 py-6">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
                    <p>© {new Date().getFullYear()} CarbEstimate AI. For informational purposes only.</p>
                </div>
            </footer>
        </div>
    );
}
