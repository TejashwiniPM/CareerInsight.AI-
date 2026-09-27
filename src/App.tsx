import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { AnalysisForm } from './components/AnalysisForm';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { AnalysesHistory } from './components/AnalysesHistory';
import { Analysis } from './types/career';
import { useTheme } from './context/ThemeContext';

export default function App() {
  const { currentTheme } = useTheme();
  const [activeView, setActiveView] = useState<'home' | 'workspace' | 'dashboard' | 'history'>('home');
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingSample, setIsLoadingSample] = useState(false);

  // Load sample analysis from server on mount to have ready
  useEffect(() => {
    const initSample = async () => {
      try {
        const res = await fetch('/api/sample');
        if (res.ok) {
          const data = await res.json();
          // Keep sample cached in case user requests it
          (window as any).__SAMPLE_DATA__ = data;
        }
      } catch (err) {
        console.warn('Sample init note:', err);
      }
    };
    initSample();
  }, []);

  const handleStartAnalysis = async (resumeText: string, jobDescriptionText: string, company?: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescriptionText,
          company
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete analysis.');
      }

      setCurrentAnalysis(data);
      setActiveView('dashboard');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExploreSample = async () => {
    setIsLoadingSample(true);
    try {
      const res = await fetch('/api/sample');
      if (res.ok) {
        const data = await res.json();
        setCurrentAnalysis(data.analysis);
        setActiveView('dashboard');
      }
    } catch (err) {
      console.error('Failed to load sample:', err);
    } finally {
      setIsLoadingSample(false);
    }
  };

  const handleSelectSavedAnalysis = async (id: string) => {
    try {
      const res = await fetch(`/api/analyses/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentAnalysis(data);
        setActiveView('dashboard');
      }
    } catch (err) {
      console.error('Failed to open saved analysis:', err);
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.colors.bgApp} ${currentTheme.colors.textPrimary} flex flex-col font-sans transition-colors duration-200`}>
      {/* Top Bar following 3-zone contract with live Theme Switcher */}
      <Navbar
        activeTab={activeView === 'home' ? 'workspace' : activeView}
        onNavigate={(tab) => {
          if (tab === 'workspace') {
            setActiveView('workspace');
          } else if (tab === 'dashboard') {
            if (currentAnalysis) setActiveView('dashboard');
          } else if (tab === 'history') {
            setActiveView('history');
          }
        }}
        hasCurrentAnalysis={!!currentAnalysis}
        onNewAnalysis={() => setActiveView('workspace')}
        analysisTitle={currentAnalysis?.title}
      />

      {/* Main View Port */}
      <main className="flex-1">
        {activeView === 'home' && (
          <div>
            <HomeHero
              onAnalyzeJob={() => setActiveView('workspace')}
              onExploreSample={handleExploreSample}
              isLoadingSample={isLoadingSample}
            />
            {/* Direct access form on homepage */}
            <AnalysisForm
              onAnalyze={handleStartAnalysis}
              isLoading={isAnalyzing}
              onLoadSample={handleExploreSample}
            />
          </div>
        )}

        {activeView === 'workspace' && (
          <AnalysisForm
            onAnalyze={handleStartAnalysis}
            isLoading={isAnalyzing}
            onLoadSample={handleExploreSample}
          />
        )}

        {activeView === 'dashboard' && currentAnalysis && (
          <AnalysisDashboard
            analysis={currentAnalysis}
            onNewAnalysis={() => setActiveView('workspace')}
          />
        )}

        {activeView === 'history' && (
          <AnalysesHistory
            onSelectAnalysis={handleSelectSavedAnalysis}
            onNewAnalysis={() => setActiveView('workspace')}
          />
        )}
      </main>

      {/* Quiet Footer adhering to anti-slop rules (no fake telemetry, no arbitrary scorecards) */}
      <footer className={`border-t ${currentTheme.colors.border} ${currentTheme.colors.bgSurface} py-8 text-xs ${currentTheme.colors.textMuted} transition-colors`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${currentTheme.colors.textSecondary}`}>CareerInsight AI</span>
            <span>·</span>
            <span>Evidence-Based Career Intelligence</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveView('workspace')}
              className={`hover:${currentTheme.colors.textPrimary} transition-colors`}
            >
              Workspace
            </button>
            <button
              onClick={handleExploreSample}
              className={`hover:${currentTheme.colors.textPrimary} transition-colors`}
            >
              Sample Scenario
            </button>
            <button
              onClick={() => setActiveView('history')}
              className={`hover:${currentTheme.colors.textPrimary} transition-colors`}
            >
              Saved Analyses
            </button>
          </div>

          <p className={`text-[11px] ${currentTheme.colors.textMuted}`}>
            CareerInsight AI does not make hiring determinations. Evaluates submitted resume evidence against stated job criteria.
          </p>
        </div>
      </footer>
    </div>
  );
}
