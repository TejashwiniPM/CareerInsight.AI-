import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, ArrowRight, Sparkles, X, RefreshCw } from 'lucide-react';
import { SAMPLE_RESUME_TEXT, SAMPLE_JOB_DESCRIPTION } from '../server/sample-data';
import { useTheme } from '../context/ThemeContext';

interface AnalysisFormProps {
  onAnalyze: (resumeText: string, jobDescriptionText: string, company?: string) => Promise<void>;
  isLoading: boolean;
  onLoadSample: () => void;
}

export const AnalysisForm: React.FC<AnalysisFormProps> = ({
  onAnalyze,
  isLoading,
  onLoadSample
}) => {
  const { currentTheme } = useTheme();
  const [resumeMode, setResumeMode] = useState<'upload' | 'paste'>('upload');
  const [resumeText, setResumeText] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  // File upload state
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setFileError(null);
    setSubmitError(null);
    setIsParsingFile(true);

    const validExtensions = ['pdf', 'docx', 'doc', 'txt', 'rtf', 'md'];
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (!ext || !validExtensions.includes(ext)) {
      setFileError('Unsupported file type. Please upload a PDF (.pdf), Word document (.docx), or plain text file (.txt).');
      setIsParsingFile(false);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError('File exceeds 10MB limit. Please upload a smaller document.');
      setIsParsingFile(false);
      return;
    }

    // Direct browser read optimization for plain text or markdown files
    if (ext === 'txt' || ext === 'md') {
      try {
        const text = await file.text();
        if (text && text.trim().length >= 25) {
          setResumeText(text.trim());
          setUploadedFileName(file.name);
          setIsParsingFile(false);
          return;
        }
      } catch {
        // Fall back to server parsing
      }
    }

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        throw new Error(`Server returned status ${res.status}. Could not parse server response.`);
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to parse resume document.');
      }

      setResumeText(data.text);
      setUploadedFileName(data.filename);
    } catch (err: any) {
      console.error('Resume upload error:', err);
      setFileError(err.message || 'Error parsing resume file.');
      setUploadedFileName(null);
    } finally {
      setIsParsingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleLoadSampleScenario = () => {
    setResumeText(SAMPLE_RESUME_TEXT);
    setJobDescriptionText(SAMPLE_JOB_DESCRIPTION);
    setCompanyName('FinTech Horizon');
    setUploadedFileName('Alex_Morgan_Data_Analyst_Resume.pdf');
    setFileError(null);
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!resumeText.trim() || resumeText.trim().length < 50) {
      setSubmitError('Please provide a complete resume (at least 50 characters) by uploading a PDF/DOCX or pasting text.');
      return;
    }

    if (!jobDescriptionText.trim() || jobDescriptionText.trim().length < 50) {
      setSubmitError('Please provide the job description (at least 50 characters) so CareerInsight can analyze requirements.');
      return;
    }

    try {
      await onAnalyze(resumeText, jobDescriptionText, companyName);
    } catch (err: any) {
      setSubmitError(err.message || 'An error occurred while running the analysis. Please check your connection and try again.');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header with Sample Shortcut */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b ${currentTheme.colors.border}`}>
        <div>
          <h2 className={`text-xl font-bold ${currentTheme.colors.textPrimary}`}>Analysis Workspace</h2>
          <p className={`text-xs sm:text-sm ${currentTheme.colors.textMuted} mt-1`}>
            Provide the candidate's resume and target job description to evaluate evidence, gaps, and interview prep.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadSampleScenario}
          className={`flex items-center gap-1.5 rounded-lg border ${currentTheme.colors.primaryBorder} ${currentTheme.colors.primaryBg} px-3.5 py-2 text-xs font-medium ${currentTheme.colors.primaryLight} hover:opacity-90 transition-opacity whitespace-nowrap self-start sm:self-center`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Pre-fill Sample Product Analyst Data</span>
        </button>
      </div>

      {submitError && (
        <div className={`mt-6 flex items-start gap-3 rounded-lg border p-4 text-sm ${
          currentTheme.isLight 
            ? 'border-red-200 bg-red-50/80 text-red-800' 
            : 'border-red-500/30 bg-red-950/20 text-red-200'
        }`}>
          <AlertCircle className={`h-5 w-5 shrink-0 ${currentTheme.isLight ? 'text-red-600' : 'text-red-400'}`} />
          <div className="flex-1">
            <p className={`font-semibold ${currentTheme.isLight ? 'text-red-900' : 'text-red-300'}`}>Input Validation</p>
            <p className="mt-1 text-xs">{submitError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* STEP 1: RESUME INPUT */}
          <div className={`flex flex-col rounded-xl border ${currentTheme.colors.border} ${currentTheme.colors.bgCard} p-5 sm:p-6 shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className={`text-xs font-semibold uppercase tracking-wider ${currentTheme.colors.primaryLight}`}>Step 1</span>
                <h3 className={`text-base font-semibold ${currentTheme.colors.textPrimary}`}>Candidate Resume</h3>
              </div>

              {/* Mode switch */}
              <div className={`flex items-center rounded-lg ${currentTheme.colors.bgSurface} p-0.5 border ${currentTheme.colors.border} text-xs`}>
                <button
                  type="button"
                  onClick={() => setResumeMode('upload')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    resumeMode === 'upload' ? `${currentTheme.colors.primary} font-semibold` : `${currentTheme.colors.textMuted} hover:${currentTheme.colors.textPrimary}`
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setResumeMode('paste')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    resumeMode === 'paste' ? `${currentTheme.colors.primary} font-semibold` : `${currentTheme.colors.textMuted} hover:${currentTheme.colors.textPrimary}`
                  }`}
                >
                  Paste Text
                </button>
              </div>
            </div>

            {resumeMode === 'upload' ? (
              <div className="space-y-4">
                {/* Drag and drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                    isDragOver 
                      ? `${currentTheme.colors.primaryBorder} ${currentTheme.colors.primaryBg}` 
                      : `${currentTheme.colors.border} ${currentTheme.colors.bgInput} hover:border-amber-500/60`
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.doc,.txt"
                    className="hidden"
                  />

                  {isParsingFile ? (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <RefreshCw className={`h-8 w-8 ${currentTheme.colors.primaryLight} animate-spin`} />
                      <p className={`text-sm font-medium ${currentTheme.colors.textPrimary}`}>Extracting document text...</p>
                      <p className={`text-xs ${currentTheme.colors.textMuted}`}>Parsing structure, roles, and project evidence</p>
                    </div>
                  ) : uploadedFileName ? (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <p className={`text-sm font-semibold ${currentTheme.colors.textPrimary} truncate max-w-xs`}>{uploadedFileName}</p>
                      <p className={`text-xs ${currentTheme.colors.textMuted} font-mono tabular-nums`}>
                        {resumeText.length.toLocaleString()} characters extracted
                      </p>
                      <p className={`text-[11px] ${currentTheme.colors.primaryLight} hover:underline mt-1`}>Click to replace file</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${currentTheme.colors.bgSurface} ${currentTheme.colors.textSecondary}`}>
                        <Upload className="h-5 w-5" />
                      </div>
                      <p className={`text-sm font-medium ${currentTheme.colors.textPrimary}`}>
                        Drop resume here or <span className={`${currentTheme.colors.primaryLight} underline`}>browse</span>
                      </p>
                      <p className={`text-xs ${currentTheme.colors.textMuted}`}>
                        Supports PDF, Word (.docx), or TXT (Max 10MB)
                      </p>
                    </div>
                  )}
                </div>

                {fileError && (
                  <div className={`rounded-lg border p-3 text-xs ${
                    currentTheme.isLight
                      ? 'border-red-200 bg-red-50/90 text-red-800'
                      : 'border-red-500/30 bg-red-950/30 text-red-300'
                  }`}>
                    <div className="flex items-start gap-2">
                      <AlertCircle className={`h-4 w-4 shrink-0 mt-0.5 ${currentTheme.isLight ? 'text-red-600' : 'text-red-400'}`} />
                      <div className="flex-1 space-y-2">
                        <p className="font-medium leading-relaxed">{fileError}</p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setResumeMode('paste');
                              setFileError(null);
                            }}
                            className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                              currentTheme.isLight
                                ? 'bg-amber-800 text-white hover:bg-amber-900'
                                : 'bg-amber-700 text-stone-100 hover:bg-amber-600'
                            }`}
                          >
                            Switch to Paste Text
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleLoadSampleScenario();
                              setFileError(null);
                            }}
                            className={`rounded border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                              currentTheme.isLight
                                ? 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                                : 'border-stone-700 bg-stone-800 text-stone-200 hover:bg-stone-700'
                            }`}
                          >
                            Load Sample Resume
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preview of extracted resume text if available */}
                {resumeText && (
                  <div className="space-y-1.5">
                    <div className={`flex items-center justify-between text-xs ${currentTheme.colors.textMuted}`}>
                      <span>Extracted Content Preview</span>
                      <button
                        type="button"
                        onClick={() => {
                          setResumeText('');
                          setUploadedFileName(null);
                        }}
                        className="text-red-400 hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                    <div className={`h-28 overflow-y-auto rounded-lg border ${currentTheme.colors.border} ${currentTheme.colors.bgInput} p-2.5 text-xs ${currentTheme.colors.textSecondary} font-mono`}>
                      <pre className="whitespace-pre-wrap font-sans">{resumeText.slice(0, 500)}...</pre>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={resumeText}
                  onChange={(e) => {
                    setResumeText(e.target.value);
                    setUploadedFileName(null);
                  }}
                  rows={9}
                  placeholder="Paste candidate resume text here (experience, previous roles, projects, skills, education)..."
                  className={`w-full rounded-lg border ${currentTheme.colors.border} ${currentTheme.colors.bgInput} p-3 text-xs sm:text-sm ${currentTheme.colors.textPrimary} placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-600 resize-none font-mono`}
                />
                <div className={`flex justify-between text-xs ${currentTheme.colors.textMuted} font-mono tabular-nums`}>
                  <span>{resumeText.length} characters</span>
                  <span>Minimum 50 characters required</span>
                </div>
              </div>
            )}

            <div className={`mt-auto pt-4 text-xs ${currentTheme.colors.textMuted} border-t ${currentTheme.colors.borderSubtle}`}>
              <p>Privacy Notice: Resumes are processed locally in your session. No files are shared with third parties.</p>
            </div>
          </div>

          {/* STEP 2: JOB DESCRIPTION INPUT */}
          <div className={`flex flex-col rounded-xl border ${currentTheme.colors.border} ${currentTheme.colors.bgCard} p-5 sm:p-6 shadow-sm`}>
            <div className="mb-4">
              <span className={`text-xs font-semibold uppercase tracking-wider ${currentTheme.colors.primaryLight}`}>Step 2</span>
              <h3 className={`text-base font-semibold ${currentTheme.colors.textPrimary}`}>Target Job Description</h3>
              <p className={`text-xs ${currentTheme.colors.textMuted} mt-0.5`}>
                Paste the job listing requirements, responsibilities, and experience criteria.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-xs font-medium ${currentTheme.colors.textSecondary} mb-1`}>
                  Target Company / Team (Optional)
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. FinTech Horizon, Stripe, Acme Corp"
                  className={`w-full rounded-lg border ${currentTheme.colors.border} ${currentTheme.colors.bgInput} px-3 py-2 text-xs sm:text-sm ${currentTheme.colors.textPrimary} placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-600`}
                />
              </div>

              <div>
                <label className={`block text-xs font-medium ${currentTheme.colors.textSecondary} mb-1`}>
                  Job Description Content <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={jobDescriptionText}
                  onChange={(e) => setJobDescriptionText(e.target.value)}
                  rows={8}
                  placeholder="Paste the target job description here (Responsibilities, Minimum Requirements, Preferred Qualifications)..."
                  className={`w-full rounded-lg border ${currentTheme.colors.border} ${currentTheme.colors.bgInput} p-3 text-xs sm:text-sm ${currentTheme.colors.textPrimary} placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-600 resize-none font-mono`}
                />
                <div className={`flex justify-between text-xs ${currentTheme.colors.textMuted} font-mono tabular-nums mt-1`}>
                  <span>{jobDescriptionText.length} characters</span>
                  <span>Minimum 50 characters required</span>
                </div>
              </div>
            </div>

            <div className={`mt-auto pt-4 text-xs ${currentTheme.colors.textMuted} border-t ${currentTheme.colors.borderSubtle}`}>
              <p>Supports job titles, required skills, preferred qualifications, and seniority requirements.</p>
            </div>
          </div>

        </div>

        {/* Submit Button Bar */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border ${currentTheme.colors.border} ${currentTheme.colors.bgSurface} p-4`}>
          <div className={`text-xs ${currentTheme.colors.textMuted} text-center sm:text-left`}>
            <span className={`font-semibold ${currentTheme.colors.textSecondary}`}>Ready to analyze:</span>{' '}
            Evidence comparison, skill gaps, personalized interview prep, and learning roadmap will be generated.
          </div>

          <button
            type="submit"
            disabled={isLoading || isParsingFile}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg ${currentTheme.colors.primary} ${currentTheme.colors.primaryHover} px-7 py-3 text-sm font-semibold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Comparing Evidence & Requirements...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Start Evidence Analysis</span>
                <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
