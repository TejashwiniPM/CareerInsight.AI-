import { Analysis } from '../types/career';

export const SAMPLE_RESUME_TEXT = `
ALEX MORGAN
San Francisco, CA | alex.morgan.analytics@example.com | (555) 382-9012 | linkedin.com/in/alexmorgan-data

PROFESSIONAL SUMMARY
Data Analyst with 2 years of experience transforming complex transactional and operational data into actionable business recommendations. Proven background writing advanced SQL queries, automating data pipelines in Python, and building executive spreadsheets. Strong communicator experienced in partnering with product managers, finance, and marketing teams to solve operational bottlenecks.

EXPERIENCE
GrowthFlow Technologies — San Francisco, CA
Junior Data Analyst | June 2024 – Present (1.5 years)
• Built and optimized complex SQL queries with CTEs, window functions, and multi-table joins across 500k+ customer records, reducing weekly analytics query runtimes by 35%.
• Automated data extraction and cleaning scripts in Python (using Pandas and NumPy) for weekly churn reporting, saving 6 hours of manual data entry per sprint.
• Conducted exploratory data analysis on user signup drop-offs, identifying a critical onboarding friction step that helped the team adjust registration flow.
• Designed and maintained monthly financial forecast models and dynamic pivot dashboards in Microsoft Excel for leadership review.
• Collaborated closely with cross-functional stakeholders in product and marketing to synthesize customer engagement metrics for monthly reviews.

Beacon Retail Group — Oakland, CA
Operations & Analytics Intern | June 2023 – May 2024 (1 year)
• Queried PostgreSQL inventory databases to track fulfillment cycle times and stock discrepancies across 14 distribution centers.
• Created weekly operational summary decks and spreadsheets tracking vendor on-time delivery rates.
• Documented data definitions and metric calculation methodologies in team Confluence wiki to ensure cross-department consistency.

EDUCATION
University of California, Davis
B.S. in Economics & Minor in Statistics | Graduated May 2023

SKILLS & TOOLS
• Languages & Databases: SQL (PostgreSQL, BigQuery), Python (Pandas, NumPy)
• Analytics & BI: Microsoft Excel (VLOOKUP, INDEX/MATCH, Pivot Tables), Power BI, Exploratory Data Analysis, Data Cleansing
• Soft Skills: Cross-Functional Collaboration, Stakeholder Communication, Structured Problem Solving, Technical Documentation
`.trim();

export const SAMPLE_JOB_DESCRIPTION = `
FinTech Horizon — San Francisco, CA (Hybrid)
Role: Product / Data Analyst (FinTech Platform)
Experience Required: 1–3 years of hands-on experience in product or data analytics

ABOUT THE ROLE:
FinTech Horizon is scaling our digital payments and automated savings platform. We are seeking a curious, detail-oriented Product / Data Analyst to uncover user insights, optimize our product activation funnel, and partner directly with our product managers and engineering teams to make evidence-based product decisions.

RESPONSIBILITIES:
• Write production-grade SQL queries to extract, transform, and analyze high-volume customer transaction and behavior data.
• Partner with Product Managers to define and track core product engagement metrics, including user activation, feature retention, and onboarding cohort retention.
• Develop Python scripts and data workflows to automate recurring analytics and data quality validation checks.
• Translate quantitative product discoveries into structured, actionable recommendations presented directly to product and engineering leadership.
• Collaborate with growth squads on experimentation initiatives and analyzing product iterations.
• Build reliable executive reports and spreadsheets to monitor week-over-week platform health.

MINIMUM REQUIREMENTS (MUST HAVE):
• 1 to 3 years of hands-on experience in a product analytics, business analytics, or data analysis role.
• Advanced SQL proficiency: Demonstrated ability to write complex queries using CTEs, window functions, and subqueries on large datasets.
• Practical Python skills: Ability to clean, reshape, and analyze structured datasets using Pandas and NumPy.
• Spreadsheet excellence: Strong proficiency with Microsoft Excel (advanced formulas, modeling, pivot tables).
• Clear stakeholder communication: Strong verbal and written communication skills with the ability to explain analytical findings to non-technical partners.
• Analytical Problem Solving: Demonstrated ability to break down ambiguous business questions into measurable analytical frameworks.

PREFERRED QUALIFICATIONS (NICE TO HAVE):
• Experience with A/B testing & experimentation frameworks (hypothesis drafting, sample sizing, p-values, test evaluation).
• Exposure to Business Intelligence tools such as Power BI or Tableau for interactive dashboarding.
• Experience with user cohort analysis, activation funnels, and retention curves in a digital or consumer app.
• Familiarity with Generative AI tools and prompt workflows to accelerate data exploration.
`.trim();

export const SAMPLE_ANALYSIS: Analysis = {
  id: 'sample-fintech-product-analyst',
  title: 'Product / Data Analyst — FinTech Horizon',
  company: 'FinTech Horizon',
  created_at: new Date().toISOString(),
  role: {
    title: 'Product / Data Analyst',
    seniority: 'Mid-Level (1–3 years)',
    experience_required: '1–3 years of hands-on experience in product or data analytics',
    department: 'Product & Growth'
  },
  candidate: {
    name: 'Alex Morgan',
    total_experience: '2.5 years combined (1.5 years Junior Data Analyst + 1 year Operations Analytics Intern)',
    relevant_experience: '1.5 years direct data analysis in tech SaaS environment',
    current_summary: 'Data Analyst with hands-on transactional querying, Python pipeline automation, and cross-functional reporting experience.'
  },
  role_understanding: {
    summary: 'The Product / Data Analyst at FinTech Horizon is embedded within the core platform squads to transform digital payment and savings transaction logs into product growth insights. The position requires strong SQL and Python fluency to extract and clean large event streams, while collaborating closely with product managers to evaluate activation and retention funnels.',
    key_missions: [
      'Extract and transform customer transactional records using high-performance SQL.',
      'Establish and monitor product health indicators including user activation and cohort retention.',
      'Automate repetitive reporting pipelines using Python and maintain executive spreadsheets.',
      'Bridge quantitative telemetry with product strategy through clear stakeholder communication.'
    ],
    business_context: 'FinTech Horizon operates in consumer fintech where user drop-off in onboarding and payment checkout directly impacts unit economics. The team needs analytical rigor to pinpoint where users stall.'
  },
  experience_alignment: {
    stated_requirement: '1–3 years of hands-on experience in product or data analytics.',
    demonstrated_experience: '1.5 years of direct full-time data analytics experience at GrowthFlow Technologies, plus 1.0 year of operational data internship at Beacon Retail Group (2.5 years total analytical exposure).',
    evaluation: 'The candidate demonstrates experience that falls squarely within the stated 1–3 years range. While the candidate\'s direct product-specific funnel tenure is approximately 1.5 years, their operational analytics internship provided foundational database and reporting work that reinforces their analytical capability.',
    transferable_analysis: 'The candidate has demonstrable transferable experience in onboarding friction analysis, cross-departmental documentation, and vendor performance monitoring, which directly translates to product health tracking.'
  },
  skills_summary: {
    strong_count: 5,
    partial_count: 2,
    not_demonstrated_count: 3,
    total: 10
  },
  skill_evaluations: [
    {
      id: 'skill-sql',
      skill: 'SQL',
      canonical_skill: 'SQL',
      category: 'Technical',
      importance: 'required',
      status: 'strong',
      job_requirement: 'Advanced SQL proficiency: Demonstrated ability to write complex queries using CTEs, window functions, and subqueries on large datasets.',
      resume_evidence: 'Built and optimized complex SQL queries with CTEs, window functions, and multi-table joins across 500k+ customer records, reducing weekly analytics query runtimes by 35%.',
      evidence_type: 'demonstrated_project_work',
      explanation: 'The submitted resume provides explicit, high-quality evidence of advanced SQL capabilities, including specific techniques (CTEs, window functions) and a measurable operational outcome (-35% runtime).'
    },
    {
      id: 'skill-python',
      skill: 'Python',
      canonical_skill: 'Python',
      category: 'Technical',
      importance: 'required',
      status: 'strong',
      job_requirement: 'Practical Python skills: Ability to clean, reshape, and analyze structured datasets using Pandas and NumPy.',
      resume_evidence: 'Automated data extraction and cleaning scripts in Python (using Pandas and NumPy) for weekly churn reporting, saving 6 hours of manual data entry per sprint.',
      evidence_type: 'demonstrated_project_work',
      explanation: 'Direct operational evidence found. The candidate clearly demonstrates using Python, Pandas, and NumPy for automated data extraction and data manipulation.'
    },
    {
      id: 'skill-excel',
      skill: 'Microsoft Excel',
      canonical_skill: 'Microsoft Excel',
      category: 'Tools & Platforms',
      importance: 'required',
      status: 'strong',
      job_requirement: 'Spreadsheet excellence: Strong proficiency with Microsoft Excel (advanced formulas, modeling, pivot tables).',
      resume_evidence: 'Designed and maintained monthly financial forecast models and dynamic pivot dashboards in Microsoft Excel for leadership review.',
      evidence_type: 'demonstrated_project_work',
      explanation: 'The resume shows hands-on application of financial modeling and pivot table dashboards in Excel for executive stakeholders.'
    },
    {
      id: 'skill-stakeholder-comm',
      skill: 'Stakeholder Communication',
      canonical_skill: 'Stakeholder Communication',
      category: 'Soft Skills & Leadership',
      importance: 'required',
      status: 'strong',
      job_requirement: 'Clear stakeholder communication: Strong verbal and written communication skills with ability to explain analytical findings to non-technical partners.',
      resume_evidence: 'Collaborated closely with cross-functional stakeholders in product and marketing to synthesize customer engagement metrics for monthly reviews; documented metric methodologies in team wiki.',
      evidence_type: 'operational_experience',
      explanation: 'Demonstrated evidence of cross-functional synthesis with product and marketing leads, coupled with written documentation.'
    },
    {
      id: 'skill-problem-solving',
      skill: 'Analytical Problem Solving',
      canonical_skill: 'Problem Solving & Critical Thinking',
      category: 'Soft Skills & Leadership',
      importance: 'required',
      status: 'strong',
      job_requirement: 'Analytical Problem Solving: Demonstrated ability to break down ambiguous business questions into measurable analytical frameworks.',
      resume_evidence: 'Conducted exploratory data analysis on user signup drop-offs, identifying a critical onboarding friction step that helped the team adjust registration flow.',
      evidence_type: 'demonstrated_project_work',
      explanation: 'Direct evidence of diagnosing an ambiguous user friction issue and isolating actionable registration drop-off causes.'
    },
    {
      id: 'skill-powerbi',
      skill: 'Power BI',
      canonical_skill: 'Power BI',
      category: 'Tools & Platforms',
      importance: 'preferred',
      status: 'partial',
      job_requirement: 'Exposure to Business Intelligence tools such as Power BI or Tableau for interactive dashboarding.',
      resume_evidence: 'Skills & Tools: Power BI, Exploratory Data Analysis, Data Cleansing',
      evidence_type: 'mention_only',
      explanation: 'Power BI is listed in the candidate\'s Skills section, but the resume does not describe a specific dashboard built, data model created, or business outcome achieved with Power BI. It is classified as a partial match based on keyword mention without practical project evidence.'
    },
    {
      id: 'skill-product-analytics',
      skill: 'Product Analytics (Funnel & Retention)',
      canonical_skill: 'Product Analytics',
      category: 'Analytical',
      importance: 'required',
      status: 'partial',
      job_requirement: 'Partner with Product Managers to define and track core product engagement metrics, including user activation, feature retention, and onboarding cohort retention.',
      resume_evidence: 'Conducted exploratory data analysis on user signup drop-offs... weekly churn reporting...',
      evidence_type: 'operational_experience',
      explanation: 'The candidate demonstrates foundational work in signup drop-offs and churn reporting. However, the resume contains limited explicit evidence of formal user activation metrics, cohort retention curves, or feature adoption funnels emphasized in the job description.'
    },
    {
      id: 'skill-ab-testing',
      skill: 'A/B Testing & Experimentation',
      canonical_skill: 'A/B Testing & Experimentation',
      category: 'Analytical',
      importance: 'preferred',
      status: 'not_demonstrated',
      job_requirement: 'Experience with A/B testing & experimentation frameworks (hypothesis drafting, sample sizing, p-values, test evaluation).',
      resume_evidence: 'No direct evidence found in the submitted resume.',
      evidence_type: 'none',
      explanation: 'A/B testing is listed as a preferred qualification in the job description, but the submitted resume does not mention experimentation, hypothesis testing, or statistical testing frameworks.'
    },
    {
      id: 'skill-tableau',
      skill: 'Tableau',
      canonical_skill: 'Tableau',
      category: 'Tools & Platforms',
      importance: 'preferred',
      status: 'not_demonstrated',
      job_requirement: 'Exposure to Business Intelligence tools such as Power BI or Tableau for interactive dashboarding.',
      resume_evidence: 'No direct evidence found in the submitted resume.',
      evidence_type: 'none',
      explanation: 'While the candidate demonstrates Power BI in their skills list, Tableau is not demonstrated in the submitted resume.'
    },
    {
      id: 'skill-genai',
      skill: 'Generative AI & LLM Tools',
      canonical_skill: 'Generative AI & LLM Tools',
      category: 'Technical',
      importance: 'preferred',
      status: 'not_demonstrated',
      job_requirement: 'Familiarity with Generative AI tools and prompt workflows to accelerate data exploration.',
      resume_evidence: 'No direct evidence found in the submitted resume.',
      evidence_type: 'none',
      explanation: 'The job description welcomes familiarity with Generative AI tools, but no direct evidence of LLM or prompt workflow usage appears in the submitted resume.'
    }
  ],
  skill_gaps: [
    {
      id: 'gap-product-funnels',
      skill: 'Product Funnel & Cohort Retention Analytics',
      priority: 'high',
      importance: 'required',
      why_it_matters: 'The job description emphasizes tracking product activation, feature adoption, and onboarding cohort retention as day-to-day responsibilities alongside product managers.',
      missing_evidence: 'The resume shows general drop-off analysis and churn reports, but lacks explicit project evidence of cohort retention curves, activation milestones, or event-level telemetry.',
      recommended_action: 'Build a focused product analytics case study analyzing user session logs to calculate N-day retention cohorts and funnel conversion drops.'
    },
    {
      id: 'gap-ab-testing',
      skill: 'A/B Testing & Experimentation Frameworks',
      priority: 'medium',
      importance: 'preferred',
      why_it_matters: 'FinTech Horizon runs product iterations on growth squads where hypothesis testing, sample sizing, and statistical confidence validation are preferred.',
      missing_evidence: 'No mention of hypothesis definition, control vs variant splits, p-values, or experiment analysis exists in the submitted resume.',
      recommended_action: 'Familiarize yourself with two-sample proportion tests, minimum detectable effect (MDE) sizing, and practical experimentation pitfalls like peeking.'
    },
    {
      id: 'gap-powerbi-depth',
      skill: 'Power BI Practical Dashboard Depth',
      priority: 'low',
      importance: 'preferred',
      why_it_matters: 'Preferred for cross-functional reporting and stakeholder self-service dashboards.',
      missing_evidence: 'Power BI is only noted in the Skills list without description of semantic models, DAX measures, or executive reports.',
      recommended_action: 'Publish a clean interactive Power BI report or describe a truthful operational dashboard built in previous work if applicable.'
    }
  ],
  career_insights: [
    {
      id: 'insight-technical-core',
      type: 'strength',
      title: 'Technical Core (SQL & Python) is Above Baseline',
      current_evidence: 'Wrote CTEs/window functions across 500k records (-35% latency) and built automated Pandas churn pipelines.',
      improvement_recommendation: 'Highlight these specific technical optimizations during technical screening; they validate that you will ramp up rapidly without engineering handholding.',
      caution_note: 'Be ready to write live SQL window functions (e.g., RANK, DENSE_RANK, LEAD/LAG) during interview stages.'
    },
    {
      id: 'insight-funnel-articulation',
      type: 'underarticulated',
      title: 'Underarticulated Product Metrics in Signup Analysis',
      current_evidence: 'Conducted exploratory data analysis on user signup drop-offs, identifying a critical onboarding friction step.',
      improvement_recommendation: 'If truthful to your actual work, clarify the metric framing: was this an activation drop, a time-to-first-value bottleneck, or a form field exit rate? Connecting your analysis to product terminology significantly elevates perceived role alignment.',
      caution_note: 'Never invent metrics or conversion lifts that you did not actually observe.'
    },
    {
      id: 'insight-transferable',
      type: 'transferable',
      title: 'Retail Operations Experience Transferred to Digital Funnels',
      current_evidence: 'Fulfillment cycle times and vendor on-time delivery tracking at Beacon Retail Group.',
      improvement_recommendation: 'Frame this operational tracking as pipeline latency and SLA monitoring. The disciplined measurement of multi-stage operational funnels transfers directly to multi-step digital product funnels.',
      caution_note: 'Acknowledge the physical vs digital context transparently while highlighting identical diagnostic methodology.'
    }
  ],
  interview_questions: [
    {
      question: 'In your resume, you mention writing SQL queries with CTEs and window functions across 500k records. How would you use window functions to calculate 7-day rolling active users or identify the top 3 transactions per customer?',
      category: 'resume_based',
      rationale: 'Validates the candidate\'s direct claim regarding window function proficiency using a common fintech product analytics scenario.',
      expected_evidence_to_share: 'Explain the difference between ROW_NUMBER(), RANK(), and DENSE_RANK(), and demonstrate syntax using PARTITION BY and ORDER BY with frame clauses.'
    },
    {
      question: 'How do you structure an analysis when a Product Manager informs you that user activation dropped by 12% following a recent mobile release?',
      category: 'role_specific',
      rationale: 'Evaluates systematic product diagnostics and structured problem solving in response to core job duties.',
      expected_evidence_to_share: 'Outline a step-by-step diagnostic tree: segmenting by app version, operating system, acquisition channel, step-by-step funnel drop-off, and checking data pipeline health.'
    },
    {
      question: 'Your resume notes Power BI in your skills list. Can you describe an interactive dashboard you designed, the data model behind it, and the decision it supported?',
      category: 'gap_based',
      rationale: 'Probes the depth of a listed skill that lacks project description on the resume, giving the candidate an opportunity to provide context honestly.',
      expected_evidence_to_share: 'Be completely honest: if you built personal prototypes or team reports, detail the star schema, DAX measures, and user audience. If experience is basic, clarify your level and focus on rapid learning.'
    },
    {
      question: 'While your resume does not explicitly list A/B testing, how would you approach determining whether a new one-click payment checkout button outperformed the standard flow?',
      category: 'gap_based',
      rationale: 'Tests conceptual understanding of experimentation even if the resume lacks formal A/B testing evidence.',
      expected_evidence_to_share: 'Define primary metric (checkout completion rate), guardrail metric (payment failure rate, refund requests), randomization unit, and hypothesis statement.'
    },
    {
      question: 'Describe a situation where an analytical conclusion you delivered contradicted a stakeholder’s intuition. How did you present the data and reach alignment?',
      category: 'behavioral',
      rationale: 'Tests cross-functional collaboration and communication skills, which are required in the job description.',
      expected_evidence_to_share: 'Share a concrete past experience focusing on empathetic listening, walking through the underlying data assumptions, and focusing on shared business objectives.'
    }
  ],
  learning_roadmap: [
    {
      id: 'roadmap-product-metrics',
      skill: 'Product Activation & Retention Analytics',
      timeframe: 'Week 1–2: Conceptual & Practical Deep Dive',
      progression_step: 'Master cohort retention curves, user activation definitions, and feature adoption funnels.',
      practical_action: 'Study standard product analytics frameworks (e.g., Amplitude/Mixpanel retention playbooks). Practice writing SQL queries that bucket users into weekly acquisition cohorts and calculate day 1, 7, and 30 retention rates.',
      hands_on_project: 'Build a GitHub portfolio project using a public SaaS/e-commerce event log dataset. Write reproducible SQL and Python notebooks showing cohort retention curves and funnel drop-off analysis.',
      measurable_outcome: 'Able to fluently explain cohort survival curves and demonstrate an analytical SQL script calculating rolling retention in an interview.'
    },
    {
      id: 'roadmap-ab-testing',
      skill: 'Experimentation & A/B Testing Foundations',
      timeframe: 'Week 3: Statistical Rigor & Sizing',
      progression_step: 'Understand statistical testing, sample size calculation, and experimentation pitfalls.',
      practical_action: 'Learn two-sample z-test / t-test mechanics, statistical power (80%), alpha (5%), and minimum detectable effect (MDE). Practice calculating required sample sizes using Python scipy.stats.',
      hands_on_project: 'Write an experiment design document for a hypothetical fintech checkout optimization: formulate hypothesis, calculate sample size, define primary/secondary metrics, and evaluate mock test results.',
      measurable_outcome: 'Confidently answer product interview questions on variance estimation, p-values, and why stopping tests early introduces false positive bias.'
    },
    {
      id: 'roadmap-bi-depth',
      skill: 'Power BI / Dashboard Storytelling',
      timeframe: 'Week 4: Applied Dashboarding',
      progression_step: 'Elevate Power BI from a listed keyword to a portfolio showcase with star schemas and DAX.',
      practical_action: 'Design a clean 2-page dashboard: Page 1 Executive Summary (KPI cards, trend lines), Page 2 Diagnostic Drilldown (funnel stages, cohort matrix). Implement measures using CALCULATE and DIVIDE.',
      hands_on_project: 'Publish a clean, public Power BI report on web/GitHub showcasing the product analytics data from Week 1.',
      measurable_outcome: 'An accessible interactive link to demonstrate during interviews when asked about dashboarding proficiency.'
    }
  ],
  raw_resume_text: SAMPLE_RESUME_TEXT,
  raw_jd_text: SAMPLE_JOB_DESCRIPTION
};
