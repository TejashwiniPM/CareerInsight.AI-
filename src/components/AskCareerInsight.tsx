import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Sparkles, X, RefreshCw, User, Bot, AlertCircle } from 'lucide-react';
import { Analysis, ChatMessage } from '../types/career';
import { useTheme } from '../context/ThemeContext';

interface AskCareerInsightProps {
  analysis: Analysis;
  isOpen: boolean;
  onClose: () => void;
}

export const AskCareerInsight: React.FC<AskCareerInsightProps> = ({
  analysis,
  isOpen,
  onClose
}) => {
  const { currentTheme } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested questions tailored to user's analysis
  const quickQuestions = [
    'Which skill should I learn first?',
    'Why is my skill match classified as partial?',
    'How can I improve my resume for this role without fabricating?',
    'What are the 3 biggest gaps in my profile?',
    'Which projects should I build for this specific job?'
  ];

  // Load existing messages when opened
  useEffect(() => {
    if (!isOpen || !analysis.id) return;
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/analyses/${analysis.id}/messages`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };
    fetchHistory();
  }, [isOpen, analysis.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (questionToSend?: string) => {
    const q = (questionToSend || inputValue).trim();
    if (!q || isLoading) return;

    setChatError(null);
    setInputValue('');

    // Optimistically add user message
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      analysis_id: analysis.id,
      role: 'user',
      content: q,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisId: analysis.id,
          question: q
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get answer.');
      }

      setMessages(data.messages || [
        ...messages,
        tempUserMsg,
        {
          id: `resp-${Date.now()}`,
          analysis_id: analysis.id,
          role: 'assistant',
          content: data.answer,
          created_at: new Date().toISOString()
        }
      ]);
    } catch (err: any) {
      setChatError(err.message || 'Error processing follow-up question.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l ${currentTheme.colors.border} ${currentTheme.colors.bgSurface} shadow-2xl animate-in slide-in-from-right duration-200`}>
      {/* Header */}
      <div className={`flex items-center justify-between border-b ${currentTheme.colors.border} px-5 py-4 ${currentTheme.colors.bgCard}`}>
        <div className="flex items-center gap-2.5">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${currentTheme.colors.primaryBg} ${currentTheme.colors.primaryLight} border ${currentTheme.colors.primaryBorder}`}>
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className={`text-sm font-bold ${currentTheme.colors.textPrimary}`}>Ask CareerInsight</h3>
            <p className={`text-[11px] ${currentTheme.colors.textMuted} truncate max-w-xs`}>
              Context: {analysis.role.title} at {analysis.company}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className={`rounded-lg p-1.5 ${currentTheme.colors.textMuted} hover:${currentTheme.colors.textPrimary} hover:${currentTheme.colors.bgInput} transition-colors`}
          aria-label="Close assistant"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Intro notice */}
        <div className={`rounded-xl border ${currentTheme.colors.border} ${currentTheme.colors.bgInput} p-3.5 text-xs`}>
          <p className={`font-semibold ${currentTheme.colors.primaryLight} mb-1 flex items-center gap-1.5`}>
            <Sparkles className="h-3.5 w-3.5" />
            Grounded Career Advisor
          </p>
          <p className={`${currentTheme.colors.textSecondary} text-[11px] leading-relaxed`}>
            I am anchored specifically to your submitted resume and the {analysis.company} job requirements. I explain reasons behind your matches, address gaps honestly, and never invent qualifications.
          </p>
        </div>

        {/* Message history */}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 text-xs ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'assistant' && (
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${currentTheme.colors.primaryBg} ${currentTheme.colors.primaryLight} border ${currentTheme.colors.primaryBorder}`}>
                <Bot className="h-3.5 w-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-xl px-4 py-3 leading-relaxed ${
                m.role === 'user'
                  ? `${currentTheme.colors.primary} shadow-sm font-medium`
                  : `${currentTheme.colors.bgCard} border ${currentTheme.colors.border} ${currentTheme.colors.textSecondary}`
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">{m.content}</div>
            </div>

            {m.role === 'user' && (
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${currentTheme.colors.bgCard} border ${currentTheme.colors.border} ${currentTheme.colors.textSecondary}`}>
                <User className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 text-xs justify-start">
            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${currentTheme.colors.primaryBg} ${currentTheme.colors.primaryLight} border ${currentTheme.colors.primaryBorder}`}>
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className={`rounded-xl ${currentTheme.colors.bgCard} border ${currentTheme.colors.border} px-4 py-3 ${currentTheme.colors.textMuted} flex items-center gap-2`}>
              <RefreshCw className={`h-3.5 w-3.5 animate-spin ${currentTheme.colors.primaryLight}`} />
              <span>Analyzing evidence and formulating answer...</span>
            </div>
          </div>
        )}

        {chatError && (
          <div className={`flex items-center gap-2 rounded-lg border p-3 text-xs ${
            currentTheme.isLight 
              ? 'border-red-200 bg-red-50/80 text-red-800' 
              : 'border-red-500/30 bg-red-950/20 text-red-300'
          }`}>
            <AlertCircle className={`h-4 w-4 shrink-0 ${currentTheme.isLight ? 'text-red-600' : 'text-red-400'}`} />
            <span>{chatError}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      <div className={`border-t ${currentTheme.colors.borderSubtle} px-4 py-2.5 ${currentTheme.colors.bgCard}`}>
        <div className={`text-[11px] font-medium ${currentTheme.colors.textMuted} mb-1.5`}>
          Suggested follow-ups:
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className={`rounded-md border ${currentTheme.colors.border} ${currentTheme.colors.bgInput} px-2.5 py-1 text-[11px] ${currentTheme.colors.textSecondary} hover:${currentTheme.colors.primaryLight} hover:${currentTheme.colors.primaryBorder} transition-colors text-left`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className={`border-t ${currentTheme.colors.border} p-4 ${currentTheme.colors.bgSurface}`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question about your evidence or gaps..."
            disabled={isLoading}
            className={`flex-1 rounded-lg border ${currentTheme.colors.border} ${currentTheme.colors.bgInput} px-3.5 py-2.5 text-xs sm:text-sm ${currentTheme.colors.textPrimary} placeholder:${currentTheme.colors.textMuted} focus:outline-none focus:ring-1 focus:ring-amber-600 disabled:opacity-50`}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${currentTheme.colors.primary} ${currentTheme.colors.primaryHover} disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm`}
            aria-label="Send question"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
