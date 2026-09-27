export type MatchStatus = 'strong' | 'partial' | 'not_demonstrated';
export type SkillImportance = 'required' | 'preferred';
export type SkillCategory = 
  | 'Technical' 
  | 'Analytical' 
  | 'Business & Domain' 
  | 'Soft Skills & Leadership' 
  | 'Tools & Platforms';

export type EvidenceType = 
  | 'demonstrated_project_work' 
  | 'operational_experience' 
  | 'mention_only' 
  | 'none';

export interface SkillEvaluation {
  id: string;
  skill: string;
  canonical_skill: string;
  category: SkillCategory;
  importance: SkillImportance;
  status: MatchStatus;
  job_requirement: string;
  resume_evidence: string;
  evidence_type: EvidenceType;
  explanation: string;
  transferable_notes?: string;
}

export interface SkillGap {
  id: string;
  skill: string;
  priority: 'high' | 'medium' | 'low';
  importance: SkillImportance;
  why_it_matters: string;
  missing_evidence: string;
  recommended_action: string;
}

export interface InterviewQuestion {
  question: string;
  category: 'technical' | 'role_specific' | 'behavioral' | 'resume_based' | 'gap_based';
  rationale: string;
  expected_evidence_to_share: string;
  targeted_skill_or_gap?: string;
}

export interface LearningRoadmapItem {
  id: string;
  skill: string;
  timeframe: string;
  progression_step: string;
  practical_action: string;
  hands_on_project: string;
  measurable_outcome: string;
}

export interface ResumeInsightItem {
  id: string;
  type: 'strength' | 'underarticulated' | 'transferable' | 'caution';
  title: string;
  current_evidence: string;
  improvement_recommendation: string;
  caution_note: string;
}

export interface Analysis {
  id: string;
  title: string;
  company: string;
  created_at: string;
  role: {
    title: string;
    seniority: string;
    experience_required: string;
    department?: string;
  };
  candidate: {
    name: string;
    total_experience: string;
    relevant_experience: string;
    current_summary: string;
  };
  role_understanding: {
    summary: string;
    key_missions: string[];
    business_context: string;
  };
  experience_alignment: {
    stated_requirement: string;
    demonstrated_experience: string;
    evaluation: string;
    transferable_analysis: string;
  };
  skills_summary: {
    strong_count: number;
    partial_count: number;
    not_demonstrated_count: number;
    total: number;
  };
  skill_evaluations: SkillEvaluation[];
  skill_gaps: SkillGap[];
  career_insights: ResumeInsightItem[];
  interview_questions: InterviewQuestion[];
  learning_roadmap: LearningRoadmapItem[];
  raw_resume_text?: string;
  raw_jd_text?: string;
}

export interface ChatMessage {
  id: string;
  analysis_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}
