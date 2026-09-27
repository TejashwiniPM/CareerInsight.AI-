import React from 'react';
import { Calendar, Compass, Target, Code2, Award, ArrowRight } from 'lucide-react';
import { LearningRoadmapItem } from '../types/career';
import { useTheme } from '../context/ThemeContext';

interface LearningRoadmapProps {
  roadmap: LearningRoadmapItem[];
}

export const LearningRoadmap: React.FC<LearningRoadmapProps> = ({ roadmap }) => {
  const { currentTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div className={`border-b ${currentTheme.colors.border} pb-4`}>
        <h3 className={`text-lg font-bold ${currentTheme.colors.textPrimary} tracking-tight`}>
          Practical Learning Roadmap
        </h3>
        <p className={`text-xs ${currentTheme.colors.textMuted} mt-1`}>
          A targeted progression addressing the highest-value skill gaps with hands-on projects, avoiding generic tutorial lists.
        </p>
      </div>

      <div className={`relative pl-6 sm:pl-8 space-y-8 before:absolute before:bottom-0 before:top-3 before:left-3 sm:before:left-4 before:w-0.5 ${currentTheme.isLight ? 'before:bg-stone-300' : 'before:bg-slate-700'}`}>
        {roadmap.map((item, index) => (
          <div key={item.id} className="relative group">
            {/* Timeline marker */}
            <div className={`absolute -left-6 sm:-left-8 top-1.5 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full ${currentTheme.colors.bgSurface} border-2 ${currentTheme.colors.primaryBorder} ${currentTheme.colors.primaryLight} text-xs font-bold shadow-md`}>
              {index + 1}
            </div>

            {/* Card Content */}
            <div className={`rounded-xl border ${currentTheme.colors.border} ${currentTheme.colors.bgCard} p-5 sm:p-6 transition-all hover:border-amber-400/60 shadow-xs`}>
              {/* Header */}
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b ${currentTheme.colors.borderSubtle} pb-3`}>
                <div>
                  <div className={`flex items-center gap-2 text-xs font-semibold ${currentTheme.colors.primaryLight} mb-1`}>
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{item.timeframe}</span>
                  </div>
                  <h4 className={`text-base font-bold ${currentTheme.colors.textPrimary} tracking-tight`}>
                    {item.skill}
                  </h4>
                </div>

                <div className={`text-xs ${currentTheme.colors.textMuted} font-medium`}>
                  {item.progression_step}
                </div>
              </div>

              {/* Action and project breakdown */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Practical study and action */}
                <div className={`rounded-lg ${currentTheme.colors.bgInput} p-4 border ${currentTheme.colors.border}`}>
                  <div className={`flex items-center gap-1.5 text-xs font-semibold ${currentTheme.colors.textPrimary} mb-2`}>
                    <Compass className={`h-3.5 w-3.5 ${currentTheme.isLight ? 'text-amber-800' : 'text-blue-400'}`} />
                    <span>Core Practical Action</span>
                  </div>
                  <p className={`${currentTheme.colors.textSecondary} leading-relaxed`}>
                    {item.practical_action}
                  </p>
                </div>

                {/* Hands-on portfolio project */}
                <div className={`rounded-lg ${currentTheme.colors.primaryBg} p-4 border ${currentTheme.colors.primaryBorder}`}>
                  <div className={`flex items-center gap-1.5 text-xs font-semibold ${currentTheme.colors.primaryLight} mb-2`}>
                    <Code2 className="h-3.5 w-3.5" />
                    <span>Hands-On Proof Project</span>
                  </div>
                  <p className={`${currentTheme.colors.textPrimary} leading-relaxed font-sans`}>
                    {item.hands_on_project}
                  </p>
                </div>
              </div>

              {/* Measurable milestone outcome */}
              <div className={`mt-4 pt-3 border-t ${currentTheme.colors.borderSubtle} flex items-start gap-2 text-xs`}>
                <Award className={`h-4 w-4 shrink-0 ${currentTheme.isLight ? 'text-emerald-700' : 'text-emerald-400'} mt-0.5`} />
                <div>
                  <span className={`font-semibold ${currentTheme.isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>Measurable Interview Outcome:</span>{' '}
                  <span className={currentTheme.colors.textSecondary}>{item.measurable_outcome}</span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
