import { SkillCategory, EvidenceType } from '../types/career';

export interface CanonicalSkillDefinition {
  canonical: string;
  aliases: string[];
  category: SkillCategory;
  description: string;
}

export const CANONICAL_SKILLS: CanonicalSkillDefinition[] = [
  {
    canonical: 'SQL',
    aliases: ['sql', 'structured query language', 'postgres', 'postgresql', 'mysql', 't-sql', 'pl/sql', 'bigquery', 'snowflake sql', 'sqlite'],
    category: 'Technical',
    description: 'Relational database querying, joins, aggregations, window functions, and CTEs.'
  },
  {
    canonical: 'Python',
    aliases: ['python', 'python3', 'pandas', 'numpy', 'scipy', 'python scripting', 'pydata'],
    category: 'Technical',
    description: 'General-purpose programming and data manipulation.'
  },
  {
    canonical: 'Product Analytics',
    aliases: ['product analytics', 'funnel analysis', 'cohort analysis', 'retention analysis', 'user activation', 'churn analysis', 'feature adoption', 'amplitude', 'mixpanel'],
    category: 'Analytical',
    description: 'Analyzing user behavior, conversion funnels, retention cohorts, and feature engagement.'
  },
  {
    canonical: 'A/B Testing & Experimentation',
    aliases: ['a/b testing', 'ab testing', 'split testing', 'experimentation', 'hypothesis testing', 'statistical significance', 'variant testing', 'optimizely'],
    category: 'Analytical',
    description: 'Designing, executing, and evaluating randomized controlled experiments.'
  },
  {
    canonical: 'Power BI',
    aliases: ['power bi', 'powerbi', 'dax', 'power query', 'microsoft power bi'],
    category: 'Tools & Platforms',
    description: 'Business intelligence reporting and dashboard creation in Microsoft Power BI.'
  },
  {
    canonical: 'Tableau',
    aliases: ['tableau', 'tableau desktop', 'tableau server', 'tableau prep'],
    category: 'Tools & Platforms',
    description: 'Visual data analytics and executive dashboard development in Tableau.'
  },
  {
    canonical: 'Microsoft Excel',
    aliases: ['excel', 'advanced excel', 'spreadsheets', 'vlookup', 'xlookup', 'pivot tables', 'financial modeling in excel', 'index match'],
    category: 'Tools & Platforms',
    description: 'Spreadsheet modeling, pivot analysis, advanced lookup formulas, and data reconciliation.'
  },
  {
    canonical: 'Data Visualization & BI',
    aliases: ['data visualization', 'dashboarding', 'bi visualization', 'business intelligence visualization', 'reporting dashboards', 'chart design'],
    category: 'Analytical',
    description: 'Synthesizing complex operational metrics into intuitive decision dashboards.'
  },
  {
    canonical: 'Generative AI & LLM Tools',
    aliases: ['generative ai', 'genai', 'llm', 'prompt engineering', 'chatgpt', 'claude', 'gemini api', 'large language models'],
    category: 'Technical',
    description: 'Leveraging modern LLMs and generative AI tools for productivity and workflow acceleration.'
  },
  {
    canonical: 'Data Warehousing & ETL',
    aliases: ['data warehousing', 'data warehouse', 'etl', 'elt', 'data pipelines', 'dbt', 'airflow', 'redshift', 'snowflake'],
    category: 'Technical',
    description: 'Transforming, staging, and maintaining structured analytical data models.'
  },
  {
    canonical: 'Stakeholder Communication',
    aliases: ['stakeholder management', 'stakeholder communication', 'cross-functional collaboration', 'executive presentations', 'business translation', 'presenting to leadership'],
    category: 'Soft Skills & Leadership',
    description: 'Translating technical insights into strategic business recommendations for cross-functional partners.'
  },
  {
    canonical: 'Problem Solving & Critical Thinking',
    aliases: ['problem solving', 'root cause analysis', 'analytical thinking', 'structured thinking', 'critical thinking', 'business diagnostics'],
    category: 'Soft Skills & Leadership',
    description: 'Deconstructing ambiguous business problems into measurable components.'
  },
  {
    canonical: 'Business Acumen & Domain Metrics',
    aliases: ['business acumen', 'unit economics', 'saas metrics', 'arr', 'clv', 'cac', 'conversion rate', 'margin analysis', 'financial metrics'],
    category: 'Business & Domain',
    description: 'Understanding organizational key performance indicators, revenue drivers, and commercial goals.'
  }
];

export function normalizeSkill(input: string): { canonical: string; category: SkillCategory } {
  const clean = input.trim().toLowerCase();
  for (const def of CANONICAL_SKILLS) {
    if (clean === def.canonical.toLowerCase()) {
      return { canonical: def.canonical, category: def.category };
    }
    for (const alias of def.aliases) {
      if (clean === alias || clean.includes(alias) || alias.includes(clean)) {
        return { canonical: def.canonical, category: def.category };
      }
    }
  }
  // Fallback
  return { canonical: input.trim(), category: 'Analytical' };
}

/**
 * Distinguishes between mere "skill mention" (e.g. "Skills: SQL, Python")
 * and "demonstrated evidence" (e.g. "Wrote SQL queries with window functions to reduce latency by 30%").
 */
export function extractSkillEvidence(
  resumeText: string,
  canonicalSkill: string
): { evidence: string; evidenceType: EvidenceType } {
  const lines = resumeText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const def = CANONICAL_SKILLS.find(s => s.canonical.toLowerCase() === canonicalSkill.toLowerCase());
  const searchTerms = def ? [def.canonical.toLowerCase(), ...def.aliases] : [canonicalSkill.toLowerCase()];

  const evidenceMatches: string[] = [];
  const mentionMatches: string[] = [];

  const actionVerbRegex = /\b(built|designed|developed|implemented|analyzed|engineered|automated|created|optimized|calculated|modeled|executed|wrote|queried|evaluated|led|managed|coordinated)\b/i;
  const skillsSectionHeaderRegex = /^(skills|technical skills|technologies|tools|competencies|core competencies|proficiencies)[:\s]/i;

  for (const line of lines) {
    const lower = line.toLowerCase();
    const hasTerm = searchTerms.some(term => {
      // Word boundary match
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(lower);
    });

    if (!hasTerm) continue;

    const isHeaderOrList = skillsSectionHeaderRegex.test(line) || (line.includes(',') && line.split(',').length >= 4 && !line.includes('.'));
    
    if (isHeaderOrList) {
      mentionMatches.push(line);
    } else if (actionVerbRegex.test(line) || line.length > 50) {
      evidenceMatches.push(line.replace(/^[•\-\*]\s*/, ''));
    } else {
      mentionMatches.push(line.replace(/^[•\-\*]\s*/, ''));
    }
  }

  if (evidenceMatches.length > 0) {
    return {
      evidence: evidenceMatches.slice(0, 2).join('; '),
      evidenceType: 'demonstrated_project_work'
    };
  }

  if (mentionMatches.length > 0) {
    return {
      evidence: mentionMatches[0],
      evidenceType: 'mention_only'
    };
  }

  return {
    evidence: 'No direct evidence found in the submitted resume.',
    evidenceType: 'none'
  };
}
