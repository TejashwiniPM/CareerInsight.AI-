import { GoogleGenAI } from '@google/genai';
import { Analysis, SkillEvaluation, SkillGap, ResumeInsightItem, InterviewQuestion, LearningRoadmapItem } from '../types/career';
import { normalizeSkill, extractSkillEvidence, CANONICAL_SKILLS } from './normalizer';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function runCareerInsightAnalysis(
  resumeText: string,
  jobDescriptionText: string,
  companyNameInput?: string
): Promise<Analysis> {
  const analysisId = `analysis-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const createdAt = new Date().toISOString();

  // Try AI-powered analysis with Gemini 3.8 Flash
  if (process.env.GEMINI_API_KEY) {
    try {
      const aiResult = await generateAiAnalysis(resumeText, jobDescriptionText, companyNameInput);
      if (aiResult) {
        return {
          ...aiResult,
          id: analysisId,
          created_at: createdAt,
          raw_resume_text: resumeText,
          raw_jd_text: jobDescriptionText
        };
      }
    } catch (err) {
      console.warn('Gemini AI analysis error, falling back to deterministic analyzer:', err);
    }
  }

  // Deterministic rule-based fallback
  return generateDeterministicAnalysis(analysisId, createdAt, resumeText, jobDescriptionText, companyNameInput);
}

async function generateAiAnalysis(
  resumeText: string,
  jobDescriptionText: string,
  companyNameInput?: string
): Promise<Analysis | null> {
  const prompt = `
You are the AI engine for CareerInsight AI, an evidence-based career intelligence platform.
Your task is to analyze the candidate's resume against the target job description.

CRITICAL NON-NEGOTIABLE PRINCIPLES:
1. EVIDENCE-BASED EXPLANATIONS: Explain every conclusion using verbatim quotes or strict factual references from the submitted resume and job description.
2. ZERO HALLUCINATION / ANTI-FABRICATION: NEVER invent experience, projects, metrics, tools, certifications, or qualifications not explicitly found in the resume.
3. PHRASING DISCIPLINE: Never claim the candidate "doesn't know" something. If a skill is absent, state: "[Skill] is not demonstrated in the submitted resume."
4. MENTION VS EVIDENCE: Distinguish between mere keyword mentions in a "Skills" list and demonstrated practical evidence in projects/experience bullet points.
   - "Strong Match": Clear practical evidence of usage/achievement in bullet points.
   - "Partial Match": Listed only in skills section, or mentioned with limited context.
   - "Not Demonstrated": Desired in JD, but no sufficient evidence in resume.
5. NUANCED EXPERIENCE: Distinguish total career experience vs directly relevant domain experience. Identify transferable skills.

JOB DESCRIPTION:
${jobDescriptionText.slice(0, 5000)}

CANDIDATE RESUME:
${resumeText.slice(0, 5000)}

Respond strictly in valid JSON matching this schema:
{
  "title": "string (e.g. Senior Data Analyst — Company)",
  "company": "string (detected company name or '${companyNameInput || 'Target Company'}')",
  "role": {
    "title": "string (extracted job title)",
    "seniority": "string (e.g. Mid-Level, Senior, Entry)",
    "experience_required": "string (e.g. 2-4 years in analytics)",
    "department": "string (optional department)"
  },
  "candidate": {
    "name": "string (candidate name from resume or 'Candidate')",
    "total_experience": "string (e.g. 2.5 years)",
    "relevant_experience": "string (e.g. 1.5 years)",
    "current_summary": "string"
  },
  "role_understanding": {
    "summary": "string (objective summary of what the role entails)",
    "key_missions": ["string (3-5 core objectives from JD)"],
    "business_context": "string (why this role matters to the company)"
  },
  "experience_alignment": {
    "stated_requirement": "string",
    "demonstrated_experience": "string",
    "evaluation": "string (nuanced, supportive analysis)",
    "transferable_analysis": "string"
  },
  "skill_evaluations": [
    {
      "id": "string",
      "skill": "string",
      "canonical_skill": "string",
      "category": "Technical | Analytical | Business & Domain | Soft Skills & Leadership | Tools & Platforms",
      "importance": "required | preferred",
      "status": "strong | partial | not_demonstrated",
      "job_requirement": "string (quote or synthesized requirement from JD)",
      "resume_evidence": "string (verbatim quote or 'No direct evidence found in the submitted resume.')",
      "evidence_type": "demonstrated_project_work | operational_experience | mention_only | none",
      "explanation": "string (objective CareerInsight reasoning)"
    }
  ],
  "skill_gaps": [
    {
      "id": "string",
      "skill": "string",
      "priority": "high | medium | low",
      "importance": "required | preferred",
      "why_it_matters": "string",
      "missing_evidence": "string",
      "recommended_action": "string"
    }
  ],
  "career_insights": [
    {
      "id": "string",
      "type": "strength | underarticulated | transferable | caution",
      "title": "string",
      "current_evidence": "string",
      "improvement_recommendation": "string",
      "caution_note": "string"
    }
  ],
  "interview_questions": [
    {
      "question": "string",
      "category": "technical | role_specific | behavioral | resume_based | gap_based",
      "rationale": "string (why interviewers ask this based on JD)",
      "expected_evidence_to_share": "string (how to answer honestly with real experience)"
    }
  ],
  "learning_roadmap": [
    {
      "id": "string",
      "skill": "string",
      "timeframe": "string (e.g. Week 1-2)",
      "progression_step": "string",
      "practical_action": "string",
      "hands_on_project": "string",
      "measurable_outcome": "string"
    }
  ]
}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      systemInstruction: 'You are an expert career intelligence engine that produces strict, evidence-based candidate evaluations without hallucinating details or using buzzwords.'
    }
  });

  const text = response.text?.trim();
  if (!text) return null;

  try {
    const parsed = JSON.parse(text);

    // Compute summary stats
    const strong_count = parsed.skill_evaluations.filter((s: any) => s.status === 'strong').length;
    const partial_count = parsed.skill_evaluations.filter((s: any) => s.status === 'partial').length;
    const not_demonstrated_count = parsed.skill_evaluations.filter((s: any) => s.status === 'not_demonstrated').length;

    parsed.skills_summary = {
      strong_count,
      partial_count,
      not_demonstrated_count,
      total: parsed.skill_evaluations.length
    };

    return parsed;
  } catch (err) {
    console.error('Failed to parse Gemini response JSON:', err);
    return null;
  }
}

/**
 * Deterministic analyzer: executes rule-based extraction, canonical normalization,
 * evidence scanning, and structured generation.
 */
function generateDeterministicAnalysis(
  id: string,
  createdAt: string,
  resumeText: string,
  jdText: string,
  companyInput?: string
): Analysis {
  // Extract candidate name from top lines of resume
  const resumeLines = resumeText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const candidateName = resumeLines[0] && resumeLines[0].length < 40 && !resumeLines[0].toLowerCase().includes('resume') 
    ? resumeLines[0] 
    : 'Candidate';

  // Detect job title and company from JD
  const jdFirstLines = jdText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let detectedTitle = 'Target Opportunity';
  let detectedCompany = companyInput || 'Target Organization';

  for (const line of jdFirstLines.slice(0, 5)) {
    if (/role:|position:|title:|job title:/i.test(line)) {
      detectedTitle = line.replace(/^(role|position|title|job title)[:\s]*/i, '').trim();
    } else if (/company:|organization:|at\s+/i.test(line)) {
      detectedCompany = line.replace(/^(company|organization)[:\s]*/i, '').trim();
    }
  }

  if (detectedTitle === 'Target Opportunity' && jdFirstLines[0]) {
    detectedTitle = jdFirstLines[0].split(/[—\-|]/)[0].trim();
  }

  // Detect skills mentioned in JD
  const evaluatedSkills: SkillEvaluation[] = [];
  const lowerJd = jdText.toLowerCase();

  for (const def of CANONICAL_SKILLS) {
    const isRequiredInJd = def.aliases.some(alias => {
      const rx = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return rx.test(lowerJd);
    });

    if (!isRequiredInJd) continue;

    // Determine importance
    const isPreferred = lowerJd.includes('preferred') || lowerJd.includes('nice to have') || lowerJd.includes('bonus');
    const importance = isPreferred && (def.canonical === 'Tableau' || def.canonical === 'A/B Testing & Experimentation' || def.canonical === 'Generative AI & LLM Tools') 
      ? 'preferred' 
      : 'required';

    // Find snippet from JD
    let jdRequirement = `Demonstrated knowledge and experience with ${def.canonical}.`;
    for (const line of jdFirstLines) {
      if (def.aliases.some(a => line.toLowerCase().includes(a))) {
        jdRequirement = line.replace(/^[•\-\*]\s*/, '');
        break;
      }
    }

    // Extract evidence from resume
    const { evidence, evidenceType } = extractSkillEvidence(resumeText, def.canonical);

    let status: 'strong' | 'partial' | 'not_demonstrated' = 'not_demonstrated';
    let explanation = '';

    if (evidenceType === 'demonstrated_project_work') {
      status = 'strong';
      explanation = `The resume contains direct practical evidence of ${def.canonical} usage, which aligns directly with the job requirement.`;
    } else if (evidenceType === 'mention_only' || evidenceType === 'operational_experience') {
      status = 'partial';
      explanation = `${def.canonical} is mentioned or referenced with limited detail, but lacks comprehensive project or metric evidence.`;
    } else {
      status = 'not_demonstrated';
      explanation = `The submitted resume does not currently demonstrate practical evidence of ${def.canonical}.`;
    }

    evaluatedSkills.push({
      id: `eval-${def.canonical.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      skill: def.canonical,
      canonical_skill: def.canonical,
      category: def.category,
      importance,
      status,
      job_requirement: jdRequirement,
      resume_evidence: evidence,
      evidence_type: evidenceType,
      explanation
    });
  }

  // Ensure we have at least 5 skills evaluated for a thorough analysis
  if (evaluatedSkills.length < 5) {
    const defaultCanonicalList = ['SQL', 'Python', 'Microsoft Excel', 'Data Visualization & BI', 'Stakeholder Communication'];
    for (const name of defaultCanonicalList) {
      if (!evaluatedSkills.some(e => e.canonical_skill === name)) {
        const { evidence, evidenceType } = extractSkillEvidence(resumeText, name);
        const status = evidenceType === 'demonstrated_project_work' ? 'strong' : evidenceType === 'mention_only' ? 'partial' : 'not_demonstrated';
        evaluatedSkills.push({
          id: `eval-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          skill: name,
          canonical_skill: name,
          category: 'Technical',
          importance: 'required',
          status,
          job_requirement: `Practical proficiency with ${name} for core day-to-day analytics workflows.`,
          resume_evidence: evidence,
          evidence_type: evidenceType,
          explanation: status === 'not_demonstrated' 
            ? `${name} is not demonstrated in the submitted resume.`
            : `Resume provides ${status === 'strong' ? 'direct operational' : 'introductory'} evidence of ${name}.`
        });
      }
    }
  }

  // Prioritized Skill Gaps
  const gaps: SkillGap[] = [];
  const missingOrPartial = evaluatedSkills.filter(s => s.status !== 'strong');
  for (const s of missingOrPartial) {
    const priority = s.importance === 'required' ? 'high' : 'medium';
    gaps.push({
      id: `gap-${s.canonical_skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      skill: s.skill,
      priority,
      importance: s.importance,
      why_it_matters: s.importance === 'required' 
        ? `The job description highlights ${s.skill} as a core competency required for day-to-day analytical tasks.`
        : `Preferred qualification that strengthens candidate competitiveness during review.`,
      missing_evidence: s.status === 'partial' 
        ? `The skill is referenced in the resume, but lacks descriptive evidence of metrics, specific project tasks, or business outcomes.`
        : `No direct evidence of ${s.skill} was found in the submitted resume document.`,
      recommended_action: `Build a concrete case study or project demonstrating ${s.skill} and prepare to speak to practical application in interviews.`
    });
  }

  // Interview Questions
  const interviewQuestions: InterviewQuestion[] = [
    {
      question: `Can you walk us through the most complex project on your resume, describing the technical architecture, data hurdles encountered, and the final business takeaway?`,
      category: 'resume_based',
      rationale: 'Evaluates authentic ownership and technical depth of candidate projects mentioned in the resume.',
      expected_evidence_to_share: 'Be prepared to break down specific data sources, table joins, business logic, and communication with partners.'
    },
    {
      question: `How do you structure an exploratory data analysis when a business partner approaches you with a broad question like "Why did our core conversion rate drop last month?"`,
      category: 'role_specific',
      rationale: 'Tests structured diagnostic methodology and stakeholder translation required by the role.',
      expected_evidence_to_share: 'Detail an analytical decision tree: segmenting cohorts, isolating traffic sources, examining technical errors, and synthesizing insights.'
    },
    {
      question: `Several positions in this domain benefit from experimentation and A/B testing. Even if your daily work focused on descriptive reporting, how would you design an experiment to test a new product feature?`,
      category: 'gap_based',
      rationale: 'Probes conceptual readiness for growth and experimentation initiatives where direct resume evidence was light.',
      expected_evidence_to_share: 'Speak candidly about hypothesis formulation, control and treatment groups, sample sizing, and statistical confidence.'
    },
    {
      question: `Describe a situation where an analytical finding contradicted what leadership expected to hear. How did you present your analysis and navigate the discussion?`,
      category: 'behavioral',
      rationale: 'Assesses stakeholder communication and integrity in data reporting.',
      expected_evidence_to_share: 'Focus on transparent assumptions, mutual goals, and presenting ranges of outcomes with intellectual humility.'
    }
  ];

  // Learning Roadmap
  const roadmap: LearningRoadmapItem[] = gaps.slice(0, 3).map((g, idx) => ({
    id: `roadmap-${idx + 1}`,
    skill: g.skill,
    timeframe: `Phase ${idx + 1}: ${idx === 0 ? 'High-Priority Focus (Weeks 1–2)' : 'Applied Deep Dive (Weeks 3–4)'}`,
    progression_step: `Transition from conceptual familiarity with ${g.skill} to reproducible portfolio implementation.`,
    practical_action: `Study key industry frameworks and design patterns for ${g.skill}. Practice end-to-end data manipulation and querying.`,
    hands_on_project: `Develop an open-source analytical case study demonstrating ${g.skill} solving a realistic business problem.`,
    measurable_outcome: `Ability to articulate trade-offs, write code/queries live, and present project findings convincingly during technical interviews.`
  }));

  // Career Insights
  const careerInsights: ResumeInsightItem[] = [
    {
      id: 'insight-1',
      type: 'strength',
      title: 'Identified Core Technical Alignment',
      current_evidence: evaluatedSkills.filter(s => s.status === 'strong').map(s => s.skill).join(', ') || 'Demonstrated analytical problem solving',
      improvement_recommendation: 'Position these demonstrated strengths prominently during initial recruiter screens to establish immediate role qualification.',
      caution_note: 'Ensure you can discuss the exact data volumes, methodologies, and tools used in these bullet points without hesitation.'
    },
    {
      id: 'insight-2',
      type: 'underarticulated',
      title: 'Articulate Business Impact Without Fabricating Data',
      current_evidence: 'Current bullet points describe operational actions and technical execution.',
      improvement_recommendation: 'Consider clarifying what decision was made, who used the analysis, or what operational process improved — but only if truthful and supported by your actual experience.',
      caution_note: 'Never invent percentages, revenue figures, or metrics that you did not actually measure.'
    },
    {
      id: 'insight-3',
      type: 'transferable',
      title: 'Leverage Transferable Analytical Rigor',
      current_evidence: 'Previous role responsibilities demonstrate data auditing, reporting, and team collaboration.',
      improvement_recommendation: 'Frame cross-departmental documentation and stakeholder presentations as core product analyst capabilities.',
      caution_note: 'Acknowledge differences in domain context candidly while emphasizing consistent problem-solving rigor.'
    }
  ];

  const strong_count = evaluatedSkills.filter(s => s.status === 'strong').length;
  const partial_count = evaluatedSkills.filter(s => s.status === 'partial').length;
  const not_demonstrated_count = evaluatedSkills.filter(s => s.status === 'not_demonstrated').length;

  return {
    id,
    title: `${detectedTitle} — ${detectedCompany}`,
    company: detectedCompany,
    created_at: createdAt,
    role: {
      title: detectedTitle,
      seniority: 'Mid-Level',
      experience_required: '1–3+ years of relevant experience',
      department: 'Analytics & Product'
    },
    candidate: {
      name: candidateName,
      total_experience: 'Demonstrated experience in submitted resume',
      relevant_experience: 'Direct analytical work documented in experience section',
      current_summary: 'Analytical professional with demonstrated hands-on technical skills and reporting background.'
    },
    role_understanding: {
      summary: `The role involves extracting data, performing exploratory diagnostics, and partnering with team stakeholders to inform operational and strategic decisions for ${detectedCompany}.`,
      key_missions: [
        'Query, clean, and validate analytical data models for decision support.',
        'Collaborate with cross-functional partners to understand business requirements.',
        'Synthesize findings into executive reporting dashboards and strategic presentations.'
      ],
      business_context: `This team requires rigorous analytical fidelity to support evidence-based execution and minimize operational friction.`
    },
    experience_alignment: {
      stated_requirement: 'Relevant background in data, product, or business analysis.',
      demonstrated_experience: 'Demonstrated hands-on experience in submitted resume bullet points.',
      evaluation: 'The candidate demonstrates direct hands-on experience in core data extraction and analysis. Transferable problem-solving and documentation experience provides additional capability.',
      transferable_analysis: 'Reporting cadence, cross-functional partner communication, and exploratory data checks transfer directly to the core responsibilities of this opportunity.'
    },
    skills_summary: {
      strong_count,
      partial_count,
      not_demonstrated_count,
      total: evaluatedSkills.length
    },
    skill_evaluations: evaluatedSkills,
    skill_gaps: gaps,
    career_insights: careerInsights,
    interview_questions: interviewQuestions,
    learning_roadmap: roadmap,
    raw_resume_text: resumeText,
    raw_jd_text: jdText
  };
}

/**
 * Handle "Ask CareerInsight" follow-up questions anchored strictly in analysis context
 */
export async function askCareerInsight(
  analysis: Analysis,
  question: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    return generateFallbackChatAnswer(analysis, question);
  }

  try {
    const contextPrompt = `
You are the CareerInsight AI conversational advisor.
The user is asking a follow-up question regarding their completed career analysis for:
Target Role: "${analysis.role.title}" at "${analysis.company}"
Candidate: "${analysis.candidate.name}"

CURRENT ANALYSIS SUMMARY:
- Strong Matches: ${analysis.skill_evaluations.filter(s => s.status === 'strong').map(s => s.skill).join(', ')}
- Partial Matches: ${analysis.skill_evaluations.filter(s => s.status === 'partial').map(s => s.skill).join(', ')}
- Not Demonstrated: ${analysis.skill_evaluations.filter(s => s.status === 'not_demonstrated').map(s => s.skill).join(', ')}
- Top Priority Gaps: ${analysis.skill_gaps.map(g => `${g.skill} (${g.priority} priority - ${g.why_it_matters})`).join('; ')}
- Stated Experience: ${analysis.experience_alignment.stated_requirement}
- Candidate Experience: ${analysis.experience_alignment.demonstrated_experience}

RULES:
1. STRICTLY GROUND YOUR ANSWER in the specific resume, job description, skill evaluations, and gaps above.
2. NEVER INVENT experience, tools, projects, or metrics not present in the candidate's resume.
3. If the user asks something that cannot be answered from the submitted data, state clearly: "Based on the submitted resume and job description, that information is not available..."
4. Be actionable, encouraging, and honest. Avoid generic chatbot pleasantries; provide concrete, direct career intelligence.
`;

    const chatContents: any[] = [
      { role: 'user', parts: [{ text: contextPrompt }] },
      { role: 'model', parts: [{ text: `I am ready. I will answer all questions strictly grounded in the candidate's actual resume evidence, job requirements, and skill analysis for ${analysis.title}.` }] }
    ];

    for (const msg of history.slice(-6)) {
      chatContents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    }

    chatContents.push({
      role: 'user',
      parts: [{ text: question }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatContents,
      config: {
        systemInstruction: 'You are CareerInsight AI, providing specific, evidence-backed career answers without hallucination or generic advice.'
      }
    });

    return response.text || generateFallbackChatAnswer(analysis, question);
  } catch (err) {
    console.error('Gemini chat error:', err);
    return generateFallbackChatAnswer(analysis, question);
  }
}

function generateFallbackChatAnswer(analysis: Analysis, question: string): string {
  const q = question.toLowerCase();
  
  if (q.includes('which skill') || q.includes('what should i learn') || q.includes('learn first') || q.includes('biggest gap')) {
    const topGap = analysis.skill_gaps[0];
    if (topGap) {
      return `Based on the job requirements for ${analysis.role.title}, your highest-priority focus should be **${topGap.skill}**.\n\n` +
        `**Why it matters:** ${topGap.why_it_matters}\n\n` +
        `**Current evidence status:** ${topGap.missing_evidence}\n\n` +
        `**Recommended action:** ${topGap.recommended_action}`;
    }
  }

  if (q.includes('why') && (q.includes('partial') || q.includes('python') || q.includes('match'))) {
    const partials = analysis.skill_evaluations.filter(s => s.status === 'partial');
    if (partials.length > 0) {
      return `Skills marked as **Partial Match** (such as ${partials.map(p => p.skill).join(', ')}) are classified that way because the submitted resume mentions them (e.g., in a skills list) or contains preliminary context, but does not provide detailed evidence of practical projects, specific tools, or measurable business outcomes.\n\n` +
        `CareerInsight maintains a strict distinction between **skill mention** and **demonstrated practical evidence** to reflect how hiring managers evaluate candidate profiles.`;
    }
  }

  if (q.includes('resume') || q.includes('improve')) {
    return `To strengthen your resume for **${analysis.role.title}** without inventing details:\n\n` +
      `1. **Clarify Operational Tasks:** For skills you actively used, specify the problem addressed and tools utilized rather than only listing keywords.\n` +
      `2. **Address Core Gaps Honestly:** If you have unlisted experience with ${analysis.skill_gaps.map(g => g.skill).slice(0, 2).join(' or ')}, add truthful bullet points detailing relevant projects.\n` +
      `3. **Strict Truthfulness:** Never invent metrics like "boosted revenue by 25%" unless you actually measured and validated that outcome in your prior work.`;
  }

  return `Regarding your analysis for **${analysis.role.title}**:\n\n` +
    `Your profile currently demonstrates strong evidence for: **${analysis.skill_evaluations.filter(s => s.status === 'strong').map(s => s.skill).join(', ')}**.\n\n` +
    `Key areas to develop or better articulate include: **${analysis.skill_gaps.map(g => g.skill).slice(0, 3).join(', ')}**.\n\n` +
    `Would you like tailored advice on structuring an interview answer or detailing a specific project to demonstrate these competencies?`;
}
