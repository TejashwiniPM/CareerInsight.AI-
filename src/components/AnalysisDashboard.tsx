import React, { useState } from 'react';
import { 
  Building, 
  Clock, 
  Briefcase, 
  UserCheck, 
  Layers, 
  AlertTriangle, 
  HelpCircle, 
  BookOpen, 
  Sparkles, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  Share2,
  Download,
  ArrowRight
} from 'lucide-react';
import { Analysis } from '../types/career';
import { EvidenceMap } from './EvidenceMap';
import { SkillGapAnalysis } from './SkillGapAnalysis';
import { InterviewPrep } from './InterviewPrep';
import { LearningRoadmap } from './LearningRoadmap';
import { ResumeInsights } from './ResumeInsights';
import { AskCareerInsight } from './AskCareerInsight';
import { useTheme } from '../context/ThemeContext';

interface AnalysisDashboardProps {
  analysis: Analysis;
  onNewAnalysis: () => void;
}

export type DashboardSubTab = 
  | 'overview' 
  | 'evidence' 
  | 'gaps' 
  | 'interview' 
  | 'roadmap' 
  | 'insights';

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  analysis,
  onNewAnalysis
}) => {
  const { currentTheme } = useTheme();
  const [activeSubTab, setActiveSubTab] = useState<DashboardSubTab>('overview');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const strongCount = analysis.skills_summary?.strong_count || 0;
  const partialCount = analysis.skills_summary?.partial_count || 0;
  const notDemonstratedCount = analysis.skills_summary?.not_demonstrated_count || 0;
  const totalCount = analysis.skills_summary?.total || (strongCount + partialCount + notDemonstratedCount) || 1;

  const strongPct = Math.round((strongCount / totalCount) * 100);
  const partialPct = Math.round((partialCount / totalCount) * 100);
  const notDemonstratedPct = 100 - strongPct - partialPct;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* TOP OVERVIEW CARD */}
      <div className={`rounded-2xl border ${currentTheme.colors.border} ${currentTheme.colors.bgCard} p-6 sm:p-8 shadow-sm transition-colors duration-200`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            {/* Header info */}
            <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${currentTheme.colors.primaryLight} mb-2`}>
              <Building className="h-3.5 w-3.5" />
              <span>{analysis.company}</span>
              <span aria-hidden="true">·</span>
              <span>{analysis.role?.seniority || 'Mid-Level'}</span>
            </div>

            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${currentTheme.colors.textPrimary}`}>
              {analysis.role?.title || analysis.title}
            </h1>

            {/* Candidate & experience comparison line */}
            <div className={`mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs ${currentTheme.colors.textSecondary}`}>
              <div className="flex items-center gap-1.5">
                <UserCheck className={`h-4 w-4 ${currentTheme.isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
                <span className={`font-semibold ${currentTheme.colors.textPrimary}`}>Candidate:</span>
                <span>{analysis.candidate?.name || 'Candidate'}</span>
              </div>
              <span aria-hidden="true" className={currentTheme.isLight ? 'text-stone-300' : 'text-slate-600'}>·</span>
              <div className="flex items-center gap-1.5">
                <Briefcase className={`h-4 w-4 ${currentTheme.isLight ? 'text-amber-800' : 'text-blue-400'}`} />
                <span className={`font-semibold ${currentTheme.colors.textPrimary}`}>Stated Requirement:</span>
                <span className={`font-mono ${currentTheme.colors.textSecondary}`}>{analysis.role?.experience_required}</span>
              </div>
            </div>
          </div>

          {/* Transparent Evidence Distribution (No fake arbitrary score) */}
          <div className={`flex flex-col sm:flex-row lg:flex-col gap-4 rounded-xl border ${currentTheme.colors.border} ${currentTheme.colors.bgSurface} p-4 min-w-[280px]`}>
            <div className={`flex items-center justify-between text-xs ${currentTheme.colors.textMuted} font-medium`}>
              <span>Evidence Distribution</span>
              <span className="font-mono tabular-nums">{totalCount} Requirements Analyzed</span>
            </div>

            {/* Segmented bar */}
            <div className={`h-2.5 w-full rounded-full ${currentTheme.isLight ? 'bg-stone-200' : 'bg-slate-800'} flex overflow-hidden`}>
              <div 
                style={{ width: `${strongPct}%` }} 
                className="bg-emerald-600 transition-all duration-500" 
                title={`${strongCount} Strong Matches (${strongPct}%)`} 
              />
              <div 
                style={{ width: `${partialPct}%` }} 
                className="bg-amber-600 transition-all duration-500" 
                title={`${partialCount} Partial Matches (${partialPct}%)`} 
              />
              <div 
                style={{ width: `${notDemonstratedPct}%` }} 
                className={`${currentTheme.isLight ? 'bg-stone-400' : 'bg-slate-600'} transition-all duration-500`} 
                title={`${notDemonstratedCount} Not Demonstrated (${notDemonstratedPct}%)`} 
              />
            </div>

            {/* Detailed metric counters */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono tabular-nums pt-1">
              <div>
                <div className={`text-sm font-bold ${currentTheme.isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>{strongCount}</div>
                <div className={`text-[10px] ${currentTheme.colors.textMuted}`}>Strong Match</div>
              </div>
              <div>
                <div className={`text-sm font-bold ${currentTheme.isLight ? 'text-amber-800' : 'text-amber-400'}`}>{partialCount}</div>
                <div className={`text-[10px] ${currentTheme.colors.textMuted}`}>Partial Match</div>
              </div>
              <div>
                <div className={`text-sm font-bold ${currentTheme.isLight ? 'text-stone-600' : 'text-slate-400'}`}>{notDemonstratedCount}</div>
                <div className={`text-[10px] ${currentTheme.colors.textMuted}`}>Not Demonstrated</div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer / Objective explanation badge */}
        <div className={`mt-6 pt-4 border-t ${currentTheme.colors.borderSubtle} flex items-center justify-between text-xs ${currentTheme.colors.textMuted}`}>
          <p>
            CareerInsight AI compares submitted resume evidence against the stated requirements of this role. 
            Absence of evidence indicates lack of demonstration, not an assumption of inability.
          </p>
          <button
            onClick={() => setIsChatOpen(true)}
            className={`hidden sm:flex items-center gap-1.5 ${currentTheme.colors.primaryLight} hover:underline font-medium`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Ask questions about this analysis</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD TABS (Interactive Filter Controls) */}
      <div className={`flex overflow-x-auto no-scrollbar items-center gap-1 p-1 ${currentTheme.colors.bgSurface} rounded-xl border ${currentTheme.colors.border}`}>
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
            activeSubTab === 'overview'
              ? `${currentTheme.colors.primary} font-bold shadow-sm`
              : `${currentTheme.colors.textSecondary} hover:${currentTheme.colors.textPrimary}`
          }`}
        >
          <Building className="h-4 w-4" />
          <span>Role Understanding</span>
        </button>

        <button
          onClick={() => setActiveSubTab('evidence')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
            activeSubTab === 'evidence'
              ? `${currentTheme.colors.primary} font-bold shadow-sm`
              : `${currentTheme.colors.textSecondary} hover:${currentTheme.colors.textPrimary}`
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Evidence Map ({analysis.skill_evaluations.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('gaps')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
            activeSubTab === 'gaps'
              ? `${currentTheme.colors.primary} font-bold shadow-sm`
              : `${currentTheme.colors.textSecondary} hover:${currentTheme.colors.textPrimary}`
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Skill Gaps ({analysis.skill_gaps.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('interview')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
            activeSubTab === 'interview'
              ? `${currentTheme.colors.primary} font-bold shadow-sm`
              : `${currentTheme.colors.textSecondary} hover:${currentTheme.colors.textPrimary}`
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span>Interview Prep ({analysis.interview_questions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('roadmap')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
            activeSubTab === 'roadmap'
              ? `${currentTheme.colors.primary} font-bold shadow-sm`
              : `${currentTheme.colors.textSecondary} hover:${currentTheme.colors.textPrimary}`
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Learning Roadmap ({analysis.learning_roadmap.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('insights')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
            activeSubTab === 'insights'
              ? `${currentTheme.colors.primary} font-bold shadow-sm`
              : `${currentTheme.colors.textSecondary} hover:${currentTheme.colors.textPrimary}`
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Career Insights</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & ROLE UNDERSTANDING */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Role Understanding Card */}
            <div className={`rounded-xl border ${currentTheme.colors.border} ${currentTheme.colors.bgCard} p-6 space-y-4`}>
              <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${currentTheme.colors.primaryLight}`}>
                <Briefcase className="h-4 w-4" />
                <span>Role Understanding & Responsibilities</span>
              </div>
              <h3 className={`text-lg font-bold ${currentTheme.colors.textPrimary} tracking-tight`}>
                What the Job Entails
              </h3>
              <p className={`text-xs sm:text-sm ${currentTheme.colors.textSecondary} leading-relaxed`}>
                {analysis.role_understanding?.summary}
              </p>

              {analysis.role_understanding?.key_missions?.length > 0 && (
                <div className="pt-2">
                  <div className={`text-xs font-semibold ${currentTheme.colors.textPrimary} mb-2`}>Key Core Missions:</div>
                  <ul className="space-y-2 text-xs">
                    {analysis.role_understanding.key_missions.map((mission, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${currentTheme.colors.primaryBg} ${currentTheme.colors.primaryLight} text-[10px] font-bold`}>
                          {idx + 1}
                        </span>
                        <span className={`${currentTheme.colors.textSecondary} leading-normal`}>{mission}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.role_understanding?.business_context && (
                <div className={`rounded-lg ${currentTheme.colors.bgSurface} p-3.5 border ${currentTheme.colors.border} text-xs ${currentTheme.colors.textMuted}`}>
                  <span className={`font-semibold ${currentTheme.colors.textPrimary}`}>Business Context:</span>{' '}
                  {analysis.role_understanding.business_context}
                </div>
              )}
            </div>

            {/* Experience Alignment Card */}
            <div className={`rounded-xl border ${currentTheme.colors.border} ${currentTheme.colors.bgCard} p-6 space-y-4`}>
              <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${currentTheme.isLight ? 'text-amber-800' : 'text-blue-400'}`}>
                <Clock className="h-4 w-4" />
                <span>Experience Alignment & Transferable Depth</span>
              </div>
              <h3 className={`text-lg font-bold ${currentTheme.colors.textPrimary} tracking-tight`}>
                Nuanced Tenure Evaluation
              </h3>

              <div className="space-y-3 text-xs">
                <div className={`rounded-lg ${currentTheme.colors.bgSurface} p-3 border ${currentTheme.colors.border}`}>
                  <div className={`text-[11px] font-semibold ${currentTheme.colors.textMuted} mb-1`}>Stated Job Requirement</div>
                  <div className={`${currentTheme.colors.textPrimary} font-medium font-sans`}>
                    {analysis.experience_alignment?.stated_requirement || analysis.role?.experience_required}
                  </div>
                </div>

                <div className={`rounded-lg ${currentTheme.colors.bgSurface} p-3 border ${currentTheme.colors.border}`}>
                  <div className={`text-[11px] font-semibold ${currentTheme.colors.textMuted} mb-1`}>Demonstrated Candidate Experience</div>
                  <div className={`${currentTheme.colors.textPrimary} font-medium font-sans`}>
                    {analysis.experience_alignment?.demonstrated_experience || analysis.candidate?.total_experience}
                  </div>
                </div>

                <div className={`rounded-lg ${currentTheme.colors.primaryBg} p-3.5 border ${currentTheme.colors.primaryBorder}`}>
                  <div className={`text-[11px] font-semibold ${currentTheme.colors.primaryLight} mb-1`}>CareerInsight Evaluation</div>
                  <p className={`${currentTheme.colors.textPrimary} leading-relaxed font-sans`}>
                    {analysis.experience_alignment?.evaluation}
                  </p>
                </div>

                {analysis.experience_alignment?.transferable_analysis && (
                  <div className={`rounded-lg ${currentTheme.colors.bgSurface} p-3.5 border ${currentTheme.colors.border}`}>
                    <div className={`text-[11px] font-semibold ${currentTheme.isLight ? 'text-emerald-700' : 'text-emerald-400'} mb-1`}>Transferable Capabilities</div>
                    <p className={`${currentTheme.colors.textSecondary} leading-relaxed font-sans`}>
                      {analysis.experience_alignment.transferable_analysis}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveSubTab('evidence')}
              className={`rounded-xl border ${currentTheme.colors.border} ${currentTheme.colors.bgCard} p-4 text-left transition-all hover:${currentTheme.colors.border} hover:opacity-90 flex items-center justify-between`}
            >
              <div>
                <div className={`text-xs ${currentTheme.colors.textMuted}`}>View Evidence</div>
                <div className={`text-sm font-bold ${currentTheme.colors.textPrimary} mt-0.5`}>Explore Evidence Map</div>
              </div>
              <ArrowRight className={`h-4 w-4 ${currentTheme.colors.primaryLight}`} />
            </button>

            <button
              onClick={() => setActiveSubTab('gaps')}
              className={`rounded-xl border ${currentTheme.colors.border} ${currentTheme.colors.bgCard} p-4 text-left transition-all hover:${currentTheme.colors.border} hover:opacity-90 flex items-center justify-between`}
            >
              <div>
                <div className={`text-xs ${currentTheme.colors.textMuted}`}>Target Weaknesses</div>
                <div className={`text-sm font-bold ${currentTheme.colors.textPrimary} mt-0.5`}>Prioritized Skill Gaps</div>
              </div>
              <ArrowRight className={`h-4 w-4 ${currentTheme.colors.primaryLight}`} />
            </button>

            <button
              onClick={() => setActiveSubTab('interview')}
              className={`rounded-xl border ${currentTheme.colors.border} ${currentTheme.colors.bgCard} p-4 text-left transition-all hover:${currentTheme.colors.border} hover:opacity-90 flex items-center justify-between`}
            >
              <div>
                <div className={`text-xs ${currentTheme.colors.textMuted}`}>Prepare Ahead</div>
                <div className={`text-sm font-bold ${currentTheme.colors.textPrimary} mt-0.5`}>Interview Practice</div>
              </div>
              <ArrowRight className={`h-4 w-4 ${currentTheme.colors.primaryLight}`} />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: EVIDENCE MAP */}
      {activeSubTab === 'evidence' && (
        <EvidenceMap evaluations={analysis.skill_evaluations} />
      )}

      {/* TAB 3: SKILL GAPS */}
      {activeSubTab === 'gaps' && (
        <SkillGapAnalysis 
          gaps={analysis.skill_gaps} 
          onOpenRoadmap={() => setActiveSubTab('roadmap')} 
        />
      )}

      {/* TAB 4: INTERVIEW PREP */}
      {activeSubTab === 'interview' && (
        <InterviewPrep questions={analysis.interview_questions} />
      )}

      {/* TAB 5: LEARNING ROADMAP */}
      {activeSubTab === 'roadmap' && (
        <LearningRoadmap roadmap={analysis.learning_roadmap} />
      )}

      {/* TAB 6: CAREER INSIGHTS */}
      {activeSubTab === 'insights' && (
        <ResumeInsights insights={analysis.career_insights} />
      )}

      {/* FLOATING ACTION BUTTON: ASK CAREERINSIGHT */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsChatOpen(true)}
          className={`flex items-center gap-2 rounded-full ${currentTheme.colors.primary} ${currentTheme.colors.primaryHover} px-4 py-3 font-bold text-xs sm:text-sm shadow-xl transition-all hover:scale-105`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Ask CareerInsight</span>
        </button>
      </div>

      {/* CONVERSATIONAL AI SLIDE-OVER */}
      <AskCareerInsight
        analysis={analysis}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};
