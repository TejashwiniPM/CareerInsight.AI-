import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Lightbulb, 
  CheckCircle2, 
  FileCode, 
  Briefcase, 
  Users, 
  AlertCircle 
} from 'lucide-react';
import { InterviewQuestion } from '../types/career';
import { useTheme } from '../context/ThemeContext';

interface InterviewPrepProps {
  questions: InterviewQuestion[];
}

export const InterviewPrep: React.FC<InterviewPrepProps> = ({ questions }) => {
  const { currentTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'technical':
        return { label: 'Technical', icon: FileCode, color: currentTheme.colors.primaryLight };
      case 'role_specific':
        return { label: 'Role-Specific', icon: Briefcase, color: currentTheme.isLight ? 'text-amber-800' : 'text-blue-400' };
      case 'behavioral':
        return { label: 'Behavioral', icon: Users, color: currentTheme.isLight ? 'text-stone-700' : 'text-purple-400' };
      case 'resume_based':
        return { label: 'Resume-Based', icon: CheckCircle2, color: currentTheme.isLight ? 'text-emerald-700' : 'text-emerald-400' };
      case 'gap_based':
        return { label: 'Gap-Targeted', icon: AlertCircle, color: currentTheme.isLight ? 'text-amber-800' : 'text-amber-400' };
      default:
        return { label: cat, icon: HelpCircle, color: currentTheme.colors.textMuted };
    }
  };

  const filteredQuestions = selectedCategory === 'all'
    ? questions
    : questions.filter(q => q.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${currentTheme.colors.border} pb-4`}>
        <div>
          <h3 className={`text-lg font-bold ${currentTheme.colors.textPrimary} tracking-tight`}>
            Personalized Interview Preparation
          </h3>
          <p className={`text-xs ${currentTheme.colors.textMuted} mt-1`}>
            Questions are generated from the unique intersection of the job description, your resume evidence, and identified gaps.
          </p>
        </div>

        {/* Filter buttons */}
        <div className={`flex flex-wrap items-center gap-1.5 p-1 ${currentTheme.colors.bgSurface} rounded-lg border ${currentTheme.colors.border} self-start sm:self-center`}>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedCategory === 'all'
                ? `${currentTheme.colors.primary} font-semibold`
                : `${currentTheme.colors.textMuted} hover:${currentTheme.colors.textPrimary}`
            }`}
          >
            All Questions ({questions.length})
          </button>
          {['resume_based', 'role_specific', 'gap_based', 'technical', 'behavioral'].map(cat => {
            const count = questions.filter(q => q.category === cat).length;
            if (count === 0) return null;
            const meta = getCategoryLabel(cat);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedCategory === cat
                    ? `${currentTheme.colors.primary} font-semibold`
                    : `${currentTheme.colors.textMuted} hover:${currentTheme.colors.textPrimary}`
                }`}
              >
                {meta.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-3">
        {filteredQuestions.map((q, idx) => {
          const isExpanded = expandedIndex === idx;
          const meta = getCategoryLabel(q.category);
          const Icon = meta.icon;

          return (
            <div
              key={idx}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? `${currentTheme.colors.primaryBorder} ${currentTheme.colors.bgSurface} shadow-md`
                  : `${currentTheme.colors.border} ${currentTheme.colors.bgCard} hover:border-amber-400/60 shadow-xs`
              }`}
            >
              <button
                type="button"
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="w-full flex items-start justify-between gap-4 p-4 sm:p-5 text-left"
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${currentTheme.colors.bgSurface} ${meta.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    {/* Unboxed metadata */}
                    <div className={`flex items-center gap-2 text-[11px] ${currentTheme.colors.textMuted} mb-1`}>
                      <span className={`font-semibold ${meta.color}`}>{meta.label}</span>
                      <span aria-hidden="true">·</span>
                      <span>Targeted Preparation</span>
                    </div>
                    <h4 className={`text-sm sm:text-base font-semibold ${currentTheme.colors.textPrimary} leading-snug`}>
                      {q.question}
                    </h4>
                  </div>
                </div>

                <div className={`${currentTheme.colors.textMuted} p-1`}>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {/* Expanded guidance */}
              {isExpanded && (
                <div className={`border-t ${currentTheme.colors.borderSubtle} px-5 pb-5 pt-4 space-y-4 text-xs`}>
                  {/* Why this question matters */}
                  <div className={`rounded-lg ${currentTheme.colors.bgInput} p-3.5 border ${currentTheme.colors.border}`}>
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${currentTheme.colors.textPrimary} mb-1.5`}>
                      <Lightbulb className={`h-3.5 w-3.5 ${currentTheme.isLight ? 'text-amber-800' : 'text-amber-400'}`} />
                      <span>Why the Interviewer Asks This</span>
                    </div>
                    <p className={`${currentTheme.colors.textSecondary} leading-relaxed`}>
                      {q.rationale}
                    </p>
                  </div>

                  {/* Expected evidence to share */}
                  <div className={`rounded-lg ${currentTheme.colors.primaryBg} p-3.5 border ${currentTheme.colors.primaryBorder}`}>
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${currentTheme.colors.primaryLight} mb-1.5`}>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>How to Answer Honestly with Strong Evidence</span>
                    </div>
                    <p className={`${currentTheme.colors.textPrimary} leading-relaxed`}>
                      {q.expected_evidence_to_share}
                    </p>
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
