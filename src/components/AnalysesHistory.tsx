import React, { useEffect, useState } from 'react';
import { Clock, Trash2, ArrowRight, Building, CheckCircle2, AlertCircle, HelpCircle, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AnalysisSummary {
  id: string;
  title: string;
  company: string;
  created_at: string;
  role: { title: string; seniority: string; experience_required: string };
  skills_summary: { strong_count: number; partial_count: number; not_demonstrated_count: number; total: number };
}

interface AnalysesHistoryProps {
  onSelectAnalysis: (id: string) => void;
  onNewAnalysis: () => void;
}

export const AnalysesHistory: React.FC<AnalysesHistoryProps> = ({
  onSelectAnalysis,
  onNewAnalysis
}) => {
  const { currentTheme } = useTheme();
  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/analyses');
      if (!res.ok) throw new Error('Failed to load analyses');
      const data = await res.json();
      setAnalyses(data);
    } catch (err: any) {
      setError(err.message || 'Error loading analysis records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/analyses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAnalyses(prev => prev.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${currentTheme.colors.border} pb-5`}>
        <div>
          <h2 className={`text-xl font-bold ${currentTheme.colors.textPrimary} tracking-tight`}>My Saved Analyses</h2>
          <p className={`text-xs sm:text-sm ${currentTheme.colors.textMuted} mt-1`}>
            Reopen previous job opportunity analyses or start a fresh comparison.
          </p>
        </div>

        <button
          onClick={onNewAnalysis}
          className={`flex items-center gap-2 rounded-lg ${currentTheme.colors.primary} ${currentTheme.colors.primaryHover} px-4 py-2 text-xs font-semibold shadow-sm transition-colors whitespace-nowrap self-start sm:self-center`}
        >
          <span>Analyze New Job</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {isLoading ? (
        <div className={`flex flex-col items-center justify-center py-20 gap-3 ${currentTheme.colors.textMuted}`}>
          <RefreshCw className={`h-6 w-6 animate-spin ${currentTheme.colors.primaryLight}`} />
          <p className="text-sm">Loading saved analyses from database...</p>
        </div>
      ) : error ? (
        <div className={`rounded-xl border p-6 text-center text-sm ${
          currentTheme.isLight ? 'border-red-200 bg-red-50/80 text-red-800' : 'border-red-500/30 bg-red-950/20 text-red-300'
        }`}>
          <p>{error}</p>
          <button
            onClick={fetchAnalyses}
            className={`mt-3 text-xs ${currentTheme.colors.primaryLight} underline font-semibold`}
          >
            Retry
          </button>
        </div>
      ) : analyses.length === 0 ? (
        <div className={`rounded-xl border ${currentTheme.colors.border} ${currentTheme.colors.bgCard} p-12 text-center ${currentTheme.colors.textMuted} mt-6`}>
          <Clock className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <h3 className={`text-base font-semibold ${currentTheme.colors.textPrimary} mb-1`}>No saved analyses yet</h3>
          <p className="text-xs max-w-md mx-auto mb-6">
            Compare your resume with a target job description to build your evidence-based alignment map and interview strategy.
          </p>
          <button
            onClick={onNewAnalysis}
            className={`rounded-lg ${currentTheme.colors.primary} ${currentTheme.colors.primaryHover} px-4 py-2 text-xs font-semibold shadow-sm transition-colors`}
          >
            Analyze First Job
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 mt-6">
          {analyses.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectAnalysis(item.id)}
              className={`group cursor-pointer rounded-xl border ${currentTheme.colors.border} ${currentTheme.colors.bgCard} p-5 hover:${currentTheme.colors.primaryBorder} transition-all shadow-xs`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-base font-bold ${currentTheme.colors.textPrimary} group-hover:${currentTheme.colors.primaryLight} transition-colors`}>
                      {item.title}
                    </span>
                  </div>

                  <div className={`flex flex-wrap items-center gap-3 text-xs ${currentTheme.colors.textMuted}`}>
                    <span className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {item.company}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{item.role.seniority || 'Mid-Level'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Skill breakdown chips */}
                  {item.skills_summary && (
                    <div className="flex items-center gap-2 text-xs">
                      <div className={`flex items-center gap-1 rounded-md px-2 py-1 ${
                        currentTheme.isLight 
                          ? 'bg-emerald-50 border border-emerald-300 text-emerald-800' 
                          : 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
                      }`}>
                        <CheckCircle2 className={`h-3 w-3 ${currentTheme.isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
                        <span className="font-semibold">{item.skills_summary.strong_count}</span>
                      </div>
                      <div className={`flex items-center gap-1 rounded-md px-2 py-1 ${
                        currentTheme.isLight 
                          ? 'bg-amber-50 border border-amber-300 text-amber-900' 
                          : 'bg-amber-950/40 border border-amber-500/30 text-amber-300'
                      }`}>
                        <AlertCircle className={`h-3 w-3 ${currentTheme.isLight ? 'text-amber-800' : 'text-amber-400'}`} />
                        <span className="font-semibold">{item.skills_summary.partial_count}</span>
                      </div>
                      <div className={`flex items-center gap-1 rounded-md px-2 py-1 ${
                        currentTheme.isLight 
                          ? 'bg-stone-100 border border-stone-200 text-stone-600' 
                          : 'bg-slate-900 border border-slate-700 text-slate-400'
                      }`}>
                        <HelpCircle className="h-3 w-3 text-stone-400" />
                        <span className="font-semibold">{item.skills_summary.not_demonstrated_count}</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      className={`p-2 rounded-lg ${currentTheme.colors.textMuted} hover:text-red-400 hover:${currentTheme.colors.bgInput} transition-colors`}
                      title="Delete analysis record"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className={`p-2 rounded-lg ${currentTheme.colors.textMuted} group-hover:${currentTheme.colors.primaryLight} group-hover:translate-x-0.5 transition-all`}>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
