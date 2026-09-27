import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ChevronRight, 
  X, 
  Layers, 
  Tag, 
  FileCheck2, 
  Building, 
  FileText 
} from 'lucide-react';
import { SkillEvaluation, MatchStatus, SkillCategory } from '../types/career';
import { useTheme } from '../context/ThemeContext';

interface EvidenceMapProps {
  evaluations: SkillEvaluation[];
}

export const EvidenceMap: React.FC<EvidenceMapProps> = ({ evaluations }) => {
  const { currentTheme } = useTheme();
  const [statusFilter, setStatusFilter] = useState<'all' | MatchStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<SkillEvaluation | null>(null);

  const categories = Array.from(new Set(evaluations.map(e => e.category)));

  const filteredEvaluations = evaluations.filter(e => {
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
    return true;
  });

  const getStatusBadge = (status: MatchStatus) => {
    switch (status) {
      case 'strong':
        return (
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${currentTheme.isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Strong Match</span>
          </span>
        );
      case 'partial':
        return (
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${currentTheme.isLight ? 'text-amber-800' : 'text-amber-400'}`}>
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Partial Match</span>
          </span>
        );
      case 'not_demonstrated':
        return (
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${currentTheme.colors.textMuted}`}>
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Not Demonstrated</span>
          </span>
        );
    }
  };

  const getEvidenceTypeLabel = (type: string) => {
    switch (type) {
      case 'demonstrated_project_work':
        return 'Project & Operational Evidence';
      case 'operational_experience':
        return 'Contextual Mention';
      case 'mention_only':
        return 'Listed in Skills Only';
      default:
        return 'No Evidence Found';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter and stats controls (functional buttons with interactive state) */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${currentTheme.colors.border} pb-4`}>
        {/* Status segmented filters */}
        <div className={`flex flex-wrap items-center gap-1.5 p-1 ${currentTheme.colors.bgSurface} rounded-lg border ${currentTheme.colors.border}`}>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'all'
                ? `${currentTheme.colors.primary} font-semibold shadow-xs`
                : `${currentTheme.colors.textMuted} hover:${currentTheme.colors.textPrimary}`
            }`}
          >
            All Skills ({evaluations.length})
          </button>
          <button
            onClick={() => setStatusFilter('strong')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'strong'
                ? currentTheme.isLight
                  ? 'bg-emerald-100 text-emerald-900 font-semibold border border-emerald-300 shadow-xs'
                  : 'bg-emerald-950/80 text-emerald-300 font-semibold border border-emerald-500/30'
                : `${currentTheme.colors.textMuted} hover:${currentTheme.colors.textPrimary}`
            }`}
          >
            Strong ({evaluations.filter(e => e.status === 'strong').length})
          </button>
          <button
            onClick={() => setStatusFilter('partial')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'partial'
                ? currentTheme.isLight
                  ? 'bg-amber-100 text-amber-900 font-semibold border border-amber-300 shadow-xs'
                  : 'bg-amber-950/80 text-amber-300 font-semibold border border-amber-500/30'
                : `${currentTheme.colors.textMuted} hover:${currentTheme.colors.textPrimary}`
            }`}
          >
            Partial ({evaluations.filter(e => e.status === 'partial').length})
          </button>
          <button
            onClick={() => setStatusFilter('not_demonstrated')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'not_demonstrated'
                ? `${currentTheme.colors.bgCard} ${currentTheme.colors.textPrimary} font-semibold border ${currentTheme.colors.border} shadow-xs`
                : `${currentTheme.colors.textMuted} hover:${currentTheme.colors.textPrimary}`
            }`}
          >
            Not Demonstrated ({evaluations.filter(e => e.status === 'not_demonstrated').length})
          </button>
        </div>

        {/* Category selector */}
        <div className={`flex items-center gap-2 text-xs ${currentTheme.colors.textMuted}`}>
          <span>Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`rounded-md border ${currentTheme.colors.border} ${currentTheme.colors.bgSurface} px-2.5 py-1.5 text-xs ${currentTheme.colors.textPrimary} focus:outline-none`}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Evidence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvaluations.map((item) => {
          const isSelected = selectedSkill?.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedSkill(item)}
              className={`flex flex-col justify-between rounded-xl border p-4 sm:p-5 cursor-pointer transition-all duration-150 ${
                isSelected 
                  ? `${currentTheme.colors.primaryBorder} ${currentTheme.colors.bgSurface} shadow-md ring-1` 
                  : `${currentTheme.colors.border} ${currentTheme.colors.bgCard} hover:border-amber-400/60 shadow-xs`
              }`}
            >
              <div>
                {/* Header row: Skill title + Status */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className={`text-base font-semibold ${currentTheme.colors.textPrimary} tracking-tight`}>
                      {item.skill}
                    </h4>
                    {/* Unboxed metadata with typographic separator */}
                    <div className={`mt-1 flex items-center gap-2 text-xs ${currentTheme.colors.textMuted}`}>
                      <span>{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className={item.importance === 'required' ? (currentTheme.isLight ? 'text-amber-800 font-semibold' : 'text-amber-400 font-medium') : currentTheme.colors.textMuted}>
                        {item.importance === 'required' ? 'Required by JD' : 'Preferred in JD'}
                      </span>
                    </div>
                  </div>
                  <div>{getStatusBadge(item.status)}</div>
                </div>

                {/* Evidence snippet preview */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className={`rounded-lg ${currentTheme.colors.bgInput} p-2.5 border ${currentTheme.colors.border}`}>
                    <p className={`text-[11px] font-medium ${currentTheme.colors.textMuted} uppercase tracking-wider mb-1 flex items-center gap-1.5`}>
                      <FileText className="h-3 w-3" />
                      <span>Resume Evidence</span>
                    </p>
                    <p className={`${currentTheme.colors.textSecondary} italic line-clamp-2`}>
                      "{item.resume_evidence}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer: Action affordance */}
              <div className={`mt-4 pt-3 border-t ${currentTheme.colors.borderSubtle} flex items-center justify-between text-xs ${currentTheme.colors.textMuted}`}>
                <span className="font-mono text-[11px]">
                  {getEvidenceTypeLabel(item.evidence_type)}
                </span>
                <span className={`flex items-center gap-1 ${currentTheme.colors.primaryLight} hover:underline font-medium`}>
                  <span>View Explanation</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvaluations.length === 0 && (
        <div className={`rounded-xl border ${currentTheme.colors.border} ${currentTheme.colors.bgCard} p-12 text-center ${currentTheme.colors.textMuted}`}>
          <p className="text-sm font-medium">No skills match the selected filter combination.</p>
          <button
            onClick={() => { setStatusFilter('all'); setCategoryFilter('all'); }}
            className={`mt-3 text-xs ${currentTheme.colors.primaryLight} underline hover:opacity-80`}
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* DETAIL MODAL / DRAWER FOR EXPLAINABILITY */}
      {selectedSkill && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${currentTheme.isLight ? 'bg-stone-900/40' : 'bg-slate-950/80'} backdrop-blur-sm animate-in fade-in duration-200`}>
          <div 
            className={`relative w-full max-w-2xl rounded-2xl border ${currentTheme.colors.border} ${currentTheme.colors.bgCard} p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex items-start justify-between border-b ${currentTheme.colors.border} pb-4`}>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`text-xl font-bold ${currentTheme.colors.textPrimary}`}>{selectedSkill.skill}</h3>
                  {selectedSkill.canonical_skill !== selectedSkill.skill && (
                    <span className={`text-xs ${currentTheme.colors.textMuted}`}>
                      (Normalized from {selectedSkill.canonical_skill})
                    </span>
                  )}
                </div>
                <div className={`mt-1 flex items-center gap-2 text-xs ${currentTheme.colors.textMuted}`}>
                  <span>{selectedSkill.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className={selectedSkill.importance === 'required' ? (currentTheme.isLight ? 'text-amber-800 font-semibold' : 'text-amber-400') : currentTheme.colors.textMuted}>
                    {selectedSkill.importance === 'required' ? 'Required Qualification' : 'Preferred Qualification'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{getEvidenceTypeLabel(selectedSkill.evidence_type)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(selectedSkill.status)}
                <button
                  onClick={() => setSelectedSkill(null)}
                  className={`rounded-lg p-1.5 ${currentTheme.colors.textMuted} hover:${currentTheme.colors.textPrimary}`}
                  aria-label="Close detail modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Evidence comparison block */}
            <div className="space-y-4">
              {/* Job Requirement */}
              <div className={`rounded-xl border ${currentTheme.colors.border} ${currentTheme.colors.bgInput} p-4`}>
                <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${currentTheme.colors.primaryLight} mb-2`}>
                  <Building className="h-3.5 w-3.5" />
                  <span>Job Requirement (From Job Description)</span>
                </div>
                <p className={`text-sm ${currentTheme.colors.textSecondary} leading-relaxed font-sans`}>
                  "{selectedSkill.job_requirement}"
                </p>
              </div>

              {/* Resume Evidence */}
              <div className={`rounded-xl border ${currentTheme.colors.border} ${currentTheme.colors.bgInput} p-4`}>
                <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${currentTheme.isLight ? 'text-amber-800' : 'text-blue-400'} mb-2`}>
                  <FileCheck2 className="h-3.5 w-3.5" />
                  <span>Resume Evidence (From Submitted Document)</span>
                </div>
                <p className={`text-sm ${currentTheme.colors.textSecondary} leading-relaxed font-sans italic`}>
                  "{selectedSkill.resume_evidence}"
                </p>
              </div>

              {/* CareerInsight Explanation */}
              <div className={`rounded-xl border ${currentTheme.colors.primaryBorder} ${currentTheme.colors.primaryBg} p-4`}>
                <div className={`text-xs font-semibold uppercase tracking-wider ${currentTheme.colors.primaryLight} mb-2`}>
                  CareerInsight Evidence Explanation
                </div>
                <p className={`text-sm ${currentTheme.colors.textPrimary} leading-relaxed font-sans`}>
                  {selectedSkill.explanation}
                </p>
              </div>

              {selectedSkill.transferable_notes && (
                <div className={`rounded-xl border ${currentTheme.colors.border} ${currentTheme.colors.bgSurface} p-4`}>
                  <div className={`text-xs font-semibold uppercase tracking-wider ${currentTheme.isLight ? 'text-emerald-700' : 'text-emerald-400'} mb-1`}>
                    Transferable Skills Note
                  </div>
                  <p className={`text-xs ${currentTheme.colors.textSecondary}`}>
                    {selectedSkill.transferable_notes}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`flex justify-end pt-4 border-t ${currentTheme.colors.border}`}>
              <button
                onClick={() => setSelectedSkill(null)}
                className={`rounded-lg ${currentTheme.colors.bgSurface} border ${currentTheme.colors.border} px-4 py-2 text-xs font-semibold ${currentTheme.colors.textSecondary} hover:${currentTheme.colors.textPrimary} transition-colors`}
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
