import React from 'react';
import { Sparkles, AlertCircle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { ResumeInsightItem } from '../types/career';
import { useTheme } from '../context/ThemeContext';

interface ResumeInsightsProps {
  insights: ResumeInsightItem[];
}

export const ResumeInsights: React.FC<ResumeInsightsProps> = ({ insights }) => {
  const { currentTheme } = useTheme();

  const getBadge = (type: string) => {
    switch (type) {
      case 'strength':
        return { 
          label: 'Demonstrated Strength', 
          color: currentTheme.isLight ? 'text-emerald-700' : 'text-emerald-400', 
          border: currentTheme.isLight ? 'border-emerald-200' : 'border-emerald-500/30', 
          bg: currentTheme.isLight ? 'bg-emerald-50/70' : 'bg-emerald-950/20' 
        };
      case 'underarticulated':
        return { 
          label: 'Underarticulated Evidence', 
          color: currentTheme.isLight ? 'text-amber-800' : 'text-amber-400', 
          border: currentTheme.isLight ? 'border-amber-200' : 'border-amber-500/30', 
          bg: currentTheme.isLight ? 'bg-amber-50/70' : 'bg-amber-950/20' 
        };
      case 'transferable':
        return { 
          label: 'Transferable Capability', 
          color: currentTheme.colors.primaryLight, 
          border: currentTheme.colors.primaryBorder, 
          bg: currentTheme.colors.primaryBg 
        };
      default:
        return { 
          label: 'Career Observation', 
          color: currentTheme.colors.textMuted, 
          border: currentTheme.colors.border, 
          bg: currentTheme.isLight ? 'bg-stone-100/50' : 'bg-slate-900/40' 
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className={`border-b ${currentTheme.colors.border} pb-4`}>
        <h3 className={`text-lg font-bold ${currentTheme.colors.textPrimary} tracking-tight`}>
          Resume Articulation & Career Insights
        </h3>
        <p className={`text-xs ${currentTheme.colors.textMuted} mt-1`}>
          Evidence-grounded recommendations for articulating your authentic achievements without inventing metrics.
        </p>
      </div>

      <div className="space-y-4">
        {insights.map((item) => {
          const badge = getBadge(item.type);
          return (
            <div
              key={item.id}
              className={`rounded-xl border ${badge.border} ${badge.bg} p-5 transition-all`}
            >
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b ${currentTheme.colors.borderSubtle} pb-3`}>
                <h4 className={`text-base font-semibold ${currentTheme.colors.textPrimary} tracking-tight`}>
                  {item.title}
                </h4>
                <div className={`text-xs font-semibold ${badge.color}`}>
                  {badge.label}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Current phrasing */}
                <div className={`rounded-lg ${currentTheme.colors.bgInput} p-3.5 border ${currentTheme.colors.border}`}>
                  <div className={`text-[11px] font-semibold uppercase tracking-wider ${currentTheme.colors.textMuted} mb-1.5`}>
                    Current Resume Evidence
                  </div>
                  <p className={`${currentTheme.colors.textSecondary} italic leading-relaxed`}>
                    "{item.current_evidence}"
                  </p>
                </div>

                {/* Recommendation */}
                <div className={`rounded-lg ${currentTheme.colors.primaryBg} p-3.5 border ${currentTheme.colors.primaryBorder}`}>
                  <div className={`text-[11px] font-semibold uppercase tracking-wider ${currentTheme.colors.primaryLight} mb-1.5`}>
                    CareerInsight Articulation Guidance
                  </div>
                  <p className={`${currentTheme.colors.textPrimary} leading-relaxed font-sans`}>
                    {item.improvement_recommendation}
                  </p>
                </div>
              </div>

              {/* Caution note */}
              {item.caution_note && (
                <div className={`mt-3.5 pt-3 border-t ${currentTheme.colors.borderSubtle} flex items-start gap-2 text-xs ${currentTheme.colors.textMuted}`}>
                  <ShieldCheck className={`h-4 w-4 shrink-0 ${currentTheme.colors.primaryLight} mt-0.5`} />
                  <div>
                    <span className={`font-semibold ${currentTheme.colors.textSecondary}`}>Integrity Note:</span>{' '}
                    <span>{item.caution_note}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
