import React from 'react';
import { ArrowRight, SearchCode, Target, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HomeHeroProps {
  onAnalyzeJob: () => void;
  onExploreSample: () => void;
  isLoadingSample?: boolean;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onAnalyzeJob,
  onExploreSample,
  isLoadingSample
}) => {
  const { currentTheme } = useTheme();

  return (
    <div className={`relative overflow-hidden border-b ${currentTheme.colors.border} bg-gradient-to-b ${currentTheme.isLight ? 'from-amber-100/30 via-stone-50/50 to-transparent' : 'from-[#121929]/50 via-transparent to-transparent'} pt-12 pb-14 sm:pt-16 sm:pb-20 transition-colors duration-200`}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Subtle kicker badge */}
        <div className="flex items-center justify-center mb-6">
          <div className={`inline-flex items-center gap-2 rounded-full border ${currentTheme.colors.primaryBorder} ${currentTheme.colors.primaryBg} px-3 py-1 text-xs font-medium ${currentTheme.colors.primaryLight}`}>
            <span className={`flex h-1.5 w-1.5 rounded-full ${currentTheme.badge} animate-pulse`} />
            <span>Evidence-Based Career Intelligence</span>
          </div>
        </div>

        {/* Main headline */}
        <h1 className={`text-3xl font-bold tracking-tight ${currentTheme.colors.textPrimary} sm:text-5xl lg:text-6xl text-balance`}>
          Understand Your Career Fit Before You Apply
        </h1>

        {/* Supporting description */}
        <p className={`mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed ${currentTheme.colors.textSecondary} text-balance`}>
          Upload your resume and provide a job description to discover your demonstrated skills, skill gaps, interview preparation needs, and personalized career insights.
        </p>

        {/* Primary and sample CTA actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onAnalyzeJob}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg ${currentTheme.colors.primary} ${currentTheme.colors.primaryHover} px-6 py-3 text-sm font-semibold transition-all shadow-md`}
          >
            <span>Analyze a Job</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={onExploreSample}
            disabled={isLoadingSample}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border ${currentTheme.colors.border} ${currentTheme.colors.bgSurface} px-6 py-3 text-sm font-medium ${currentTheme.colors.textSecondary} hover:${currentTheme.colors.textPrimary} transition-colors`}
          >
            {isLoadingSample ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
                <span>Loading Scenario...</span>
              </span>
            ) : (
              <span>Explore Sample Analysis (Product Analyst)</span>
            )}
          </button>
        </div>

        {/* Key Core Principles Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className={`rounded-xl border ${currentTheme.colors.border} ${currentTheme.colors.bgCard} p-4 transition-colors hover:border-amber-400/60 shadow-xs`}>
            <div className={`flex items-center gap-2.5 ${currentTheme.colors.primaryLight} font-semibold text-sm mb-2`}>
              <SearchCode className="h-4 w-4" />
              <span>Evidence vs. Keyword Count</span>
            </div>
            <p className={`text-xs ${currentTheme.colors.textMuted} leading-relaxed`}>
              We extract demonstrated impact and verifiable context instead of simple keyword tallying or arbitrary fit scores.
            </p>
          </div>

          <div className={`rounded-xl border ${currentTheme.colors.border} ${currentTheme.colors.bgCard} p-4 transition-colors hover:border-amber-400/60 shadow-xs`}>
            <div className={`flex items-center gap-2.5 ${currentTheme.colors.primaryLight} font-semibold text-sm mb-2`}>
              <Target className="h-4 w-4" />
              <span>Three-Tier Skill Match</span>
            </div>
            <p className={`text-xs ${currentTheme.colors.textMuted} leading-relaxed`}>
              Explicitly categorizes requirements into <span className="text-emerald-700 font-semibold">Strong Match</span>, <span className="text-amber-800 font-semibold">Partial</span>, and <span className="text-stone-500 font-semibold">Not Demonstrated</span>.
            </p>
          </div>

          <div className={`rounded-xl border ${currentTheme.colors.border} ${currentTheme.colors.bgCard} p-4 transition-colors hover:border-amber-400/60 shadow-xs`}>
            <div className={`flex items-center gap-2.5 ${currentTheme.colors.primaryLight} font-semibold text-sm mb-2`}>
              <Sparkles className="h-4 w-4" />
              <span>Actionable Bridge Plans</span>
            </div>
            <p className={`text-xs ${currentTheme.colors.textMuted} leading-relaxed`}>
              Direct recommendations to bridge missing skills with prioritized learning topics and scenario-based interview responses.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
