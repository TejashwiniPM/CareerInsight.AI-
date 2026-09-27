import React, { useState } from 'react';
import { Menu, X, Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  activeTab: 'workspace' | 'dashboard' | 'history';
  onNavigate: (tab: 'workspace' | 'dashboard' | 'history') => void;
  hasCurrentAnalysis: boolean;
  onNewAnalysis: () => void;
  analysisTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onNavigate,
  hasCurrentAnalysis,
  onNewAnalysis,
  analysisTitle
}) => {
  const { currentTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={`sticky top-0 z-40 w-full border-b ${currentTheme.colors.bgNavbar} backdrop-blur-md transition-colors duration-200`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('workspace')}
            className={`flex items-center gap-2.5 text-left text-lg font-bold tracking-tight ${currentTheme.colors.textPrimary} hover:opacity-90 transition-opacity`}
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${currentTheme.colors.brandGradient} text-white font-black text-sm shadow-sm`}>
              CI
            </div>
            <span>CareerInsight AI</span>
          </button>

          {analysisTitle && hasCurrentAnalysis && (
            <div className={`hidden lg:flex items-center gap-2 pl-3 border-l ${currentTheme.colors.border} text-xs ${currentTheme.colors.textMuted} truncate max-w-xs xl:max-w-md`}>
              <span className="truncate">{analysisTitle}</span>
            </div>
          )}
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className={`hidden md:flex items-center gap-6 text-sm font-medium ${currentTheme.colors.textSecondary}`}>
          <button
            onClick={() => onNavigate('workspace')}
            className={`transition-colors hover:${currentTheme.colors.textPrimary} ${
              activeTab === 'workspace' ? `${currentTheme.colors.primaryLight} font-semibold` : currentTheme.colors.textMuted
            }`}
          >
            Workspace
          </button>

          {hasCurrentAnalysis && (
            <button
              onClick={() => onNavigate('dashboard')}
              className={`transition-colors hover:${currentTheme.colors.textPrimary} ${
                activeTab === 'dashboard' ? `${currentTheme.colors.primaryLight} font-semibold` : currentTheme.colors.textMuted
              }`}
            >
              Current Analysis
            </button>
          )}

          <button
            onClick={() => onNavigate('history')}
            className={`transition-colors hover:${currentTheme.colors.textPrimary} ${
              activeTab === 'history' ? `${currentTheme.colors.primaryLight} font-semibold` : currentTheme.colors.textMuted
            }`}
          >
            My Analyses
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onNewAnalysis}
            className={`flex items-center gap-1.5 rounded-lg ${currentTheme.colors.primary} ${currentTheme.colors.primaryHover} px-3.5 py-2 text-xs font-semibold transition-colors shadow-sm whitespace-nowrap`}
          >
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Analyze a Job</span>
            <span className="sm:hidden">New</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`flex md:hidden h-9 w-9 items-center justify-center rounded-lg border ${currentTheme.colors.border} ${currentTheme.colors.textMuted} hover:${currentTheme.colors.textPrimary}`}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-b ${currentTheme.colors.border} ${currentTheme.colors.bgSurface} px-4 py-4 space-y-3`}>
          <div className="flex flex-col space-y-2 text-sm font-medium">
            <button
              onClick={() => {
                onNavigate('workspace');
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2 px-3 rounded-lg ${
                activeTab === 'workspace' ? `${currentTheme.colors.primaryBg} ${currentTheme.colors.primaryLight} font-semibold` : currentTheme.colors.textSecondary
              }`}
            >
              Workspace
            </button>

            {hasCurrentAnalysis && (
              <button
                onClick={() => {
                  onNavigate('dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 px-3 rounded-lg ${
                  activeTab === 'dashboard' ? `${currentTheme.colors.primaryBg} ${currentTheme.colors.primaryLight} font-semibold` : currentTheme.colors.textSecondary
                }`}
              >
                Current Analysis
              </button>
            )}

            <button
              onClick={() => {
                onNavigate('history');
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2 px-3 rounded-lg ${
                activeTab === 'history' ? `${currentTheme.colors.primaryBg} ${currentTheme.colors.primaryLight} font-semibold` : currentTheme.colors.textSecondary
              }`}
            >
              My Saved Analyses
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
