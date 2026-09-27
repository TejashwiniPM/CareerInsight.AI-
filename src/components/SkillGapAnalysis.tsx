import React from 'react';
import { AlertTriangle, ArrowUpRight, CheckCircle2, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { SkillGap } from '../types/career';
import { useTheme } from '../context/ThemeContext';

interface SkillGapAnalysisProps {
  gaps: SkillGap[];
  onOpenRoadmap?: () => void;
}

export const SkillGapAnalysis: React.FC<SkillGapAnalysisProps> = ({ gaps, onOpenRoadmap }) => {
  const { currentTheme } = useTheme();

  const getPriorityStyle = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return {
          label: 'High Priority',
          color: currentTheme.isLight ? 'text-rose-700' : 'text-rose-400',
          border: currentTheme.isLight ? 'border-rose-200' : 'border-rose-900/60',
          bg: currentTheme.isLight ? 'bg-rose-50/70' : 'bg-rose-950/10'
        };
      case 'medium':
        return {
          label: 'Medium Priority',
          color: currentTheme.isLight ? 'text-amber-800' : 'text-amber-400',
          border: currentTheme.isLight ? 'border-amber-200' : 'border-amber-900/60',
          bg: currentTheme.isLight ? 'bg-amber-50/70' : 'bg-amber-950/10'
        };
      case 'low':
        return {
          label: 'Low Priority',
          color: currentTheme.colors.textMuted,
          border: currentTheme.colors.border,
          bg: currentTheme.isLight ? 'bg-stone-100/50' : 'bg-slate-900/40'
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className={`text-lg font-bold ${currentTheme.colors.textPrimary} tracking-tight`}>
            Prioritized Skill Gaps
          </h3>
          <p className={`text-xs ${currentTheme.colors.textMuted} mt-1`}>
            Gaps are prioritized based on whether the skill is a required core competency or a preferred bonus in the target job description.
          </p>
        </div>

        {onOpenRoadmap && (
          <button
            onClick={onOpenRoadmap}
            className={`flex items-center gap-1.5 rounded-lg border ${currentTheme.colors.primaryBorder} ${currentTheme.colors.primaryBg} px-3.5 py-2 text-xs font-medium ${currentTheme.colors.primaryLight} hover:opacity-80 transition-opacity whitespace-nowrap self-start sm:self-center`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>View Practical Learning Roadmap</span>
          </button>
        )}
      </div>

      {gaps.length === 0 ? (
        <div className={`rounded-xl border ${currentTheme.colors.border} ${currentTheme.colors.bgCard} p-8 text-center`}>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mb-3">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h4 className={`text-base font-semibold ${currentTheme.colors.textPrimary}`}>No Critical Gaps Detected</h4>
          <p className={`text-xs ${currentTheme.colors.textMuted} mt-1 max-w-md mx-auto`}>
            The submitted resume demonstrates sufficient practical evidence across all stated core requirements of this role.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {gaps.map((gap) => {
            const p = getPriorityStyle(gap.priority);
            return (
              <div
                key={gap.id}
                className={`rounded-xl border ${p.border} ${p.bg} p-5 transition-all`}
              >
                {/* Header line: Skill name + Priority + Importance */}
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b ${currentTheme.colors.borderSubtle} pb-3`}>
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className={`h-4 w-4 shrink-0 ${p.color}`} />
                    <h4 className={`text-base font-semibold ${currentTheme.colors.textPrimary} tracking-tight`}>
                      {gap.skill}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className={`font-semibold ${p.color}`}>
                      {p.label}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className={currentTheme.colors.textMuted}>
                      {gap.importance === 'required' ? 'Required in JD' : 'Preferred in JD'}
                    </span>
                  </div>
                </div>

                {/* Details grid */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Why it matters */}
                  <div className={`rounded-lg ${currentTheme.colors.bgInput} p-3.5 border ${currentTheme.colors.border}`}>
                    <div className={`text-[11px] font-semibold uppercase tracking-wider ${currentTheme.colors.textMuted} mb-1.5`}>
                      Why It Matters for This Job
                    </div>
                    <p className={`${currentTheme.colors.textSecondary} leading-relaxed`}>
                      {gap.why_it_matters}
                    </p>
                  </div>

                  {/* Missing evidence */}
                  <div className={`rounded-lg ${currentTheme.colors.bgInput} p-3.5 border ${currentTheme.colors.border}`}>
                    <div className={`text-[11px] font-semibold uppercase tracking-wider ${currentTheme.colors.textMuted} mb-1.5`}>
                      Evidence Currently Missing
                    </div>
                    <p className={`${currentTheme.colors.textSecondary} leading-relaxed italic`}>
                      "{gap.missing_evidence}"
                    </p>
                  </div>

                  {/* Recommended action */}
                  <div className={`rounded-lg ${currentTheme.colors.primaryBg} p-3.5 border ${currentTheme.colors.primaryBorder}`}>
                    <div className={`text-[11px] font-semibold uppercase tracking-wider ${currentTheme.colors.primaryLight} mb-1.5 flex items-center gap-1`}>
                      <Sparkles className="h-3 w-3" />
                      <span>Recommended Action</span>
                    </div>
                    <p className={`${currentTheme.colors.textPrimary} leading-relaxed`}>
                      {gap.recommended_action}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Anti-fabrication reminder banner */}
      <div className={`rounded-xl border ${currentTheme.colors.border} ${currentTheme.colors.bgSurface} p-4 flex items-start gap-3 text-xs ${currentTheme.colors.textMuted}`}>
        <ShieldAlert className={`h-4 w-4 shrink-0 ${currentTheme.colors.primaryLight} mt-0.5`} />
        <div>
          <span className={`font-semibold ${currentTheme.colors.textSecondary}`}>Anti-Fabrication Principle:</span>{' '}
          CareerInsight recommends addressing gaps through focused projects or clarifying unwritten true experience. Never fabricate achievements, titles, or metrics to pass an initial scan.
        </div>
      </div>
    </div>
  );
};
