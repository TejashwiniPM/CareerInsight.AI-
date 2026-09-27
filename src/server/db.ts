import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { Analysis, ChatMessage, SkillEvaluation, SkillGap, ResumeInsightItem, InterviewQuestion, LearningRoadmapItem } from '../types/career';
import { SAMPLE_ANALYSIS } from './sample-data';

const DB_PATH = path.resolve(process.cwd(), 'careerinsight.sqlite');

let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs();
  let data: Uint8Array | null = null;
  if (fs.existsSync(DB_PATH)) {
    try {
      const fileBuffer = fs.readFileSync(DB_PATH);
      data = new Uint8Array(fileBuffer);
    } catch (err) {
      console.error('Failed reading existing SQLite file, creating new:', err);
    }
  }

  const db = data ? new SQL.Database(data) : new SQL.Database();
  dbInstance = db;

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS analyses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      created_at TEXT NOT NULL,
      role_json TEXT NOT NULL,
      candidate_json TEXT NOT NULL,
      role_understanding_json TEXT NOT NULL,
      experience_alignment_json TEXT NOT NULL,
      skills_summary_json TEXT NOT NULL,
      raw_resume_text TEXT,
      raw_jd_text TEXT
    );

    CREATE TABLE IF NOT EXISTS skill_evaluations (
      id TEXT PRIMARY KEY,
      analysis_id TEXT NOT NULL,
      skill TEXT NOT NULL,
      canonical_skill TEXT NOT NULL,
      category TEXT NOT NULL,
      importance TEXT NOT NULL,
      status TEXT NOT NULL,
      job_requirement TEXT NOT NULL,
      resume_evidence TEXT NOT NULL,
      evidence_type TEXT NOT NULL,
      explanation TEXT NOT NULL,
      transferable_notes TEXT,
      FOREIGN KEY (analysis_id) REFERENCES analyses (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS skill_gaps (
      id TEXT PRIMARY KEY,
      analysis_id TEXT NOT NULL,
      skill TEXT NOT NULL,
      priority TEXT NOT NULL,
      importance TEXT NOT NULL,
      why_it_matters TEXT NOT NULL,
      missing_evidence TEXT NOT NULL,
      recommended_action TEXT NOT NULL,
      FOREIGN KEY (analysis_id) REFERENCES analyses (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS career_insights (
      id TEXT PRIMARY KEY,
      analysis_id TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      current_evidence TEXT NOT NULL,
      improvement_recommendation TEXT NOT NULL,
      caution_note TEXT NOT NULL,
      FOREIGN KEY (analysis_id) REFERENCES analyses (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS interview_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      analysis_id TEXT NOT NULL,
      category TEXT NOT NULL,
      question TEXT NOT NULL,
      rationale TEXT NOT NULL,
      expected_evidence_to_share TEXT NOT NULL,
      targeted_skill_or_gap TEXT,
      FOREIGN KEY (analysis_id) REFERENCES analyses (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS learning_roadmaps (
      id TEXT PRIMARY KEY,
      analysis_id TEXT NOT NULL,
      skill TEXT NOT NULL,
      timeframe TEXT NOT NULL,
      progression_step TEXT NOT NULL,
      practical_action TEXT NOT NULL,
      hands_on_project TEXT NOT NULL,
      measurable_outcome TEXT NOT NULL,
      FOREIGN KEY (analysis_id) REFERENCES analyses (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      analysis_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (analysis_id) REFERENCES analyses (id) ON DELETE CASCADE
    );
  `);

  // Check if sample analysis is present; if not, seed it
  const checkSample = db.exec(`SELECT id FROM analyses WHERE id = '${SAMPLE_ANALYSIS.id}'`);
  if (!checkSample.length || !checkSample[0].values.length) {
    await saveAnalysis(SAMPLE_ANALYSIS, false);
  }

  saveDbToDisk();
  return db;
}

function saveDbToDisk() {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  } catch (err) {
    console.error('Error writing SQLite DB to disk:', err);
  }
}

export async function saveAnalysis(analysis: Analysis, persist = true): Promise<void> {
  const db = await getDb();

  // Delete previous children if exists
  db.run(`DELETE FROM analyses WHERE id = ?`, [analysis.id]);
  db.run(`DELETE FROM skill_evaluations WHERE analysis_id = ?`, [analysis.id]);
  db.run(`DELETE FROM skill_gaps WHERE analysis_id = ?`, [analysis.id]);
  db.run(`DELETE FROM career_insights WHERE analysis_id = ?`, [analysis.id]);
  db.run(`DELETE FROM interview_questions WHERE analysis_id = ?`, [analysis.id]);
  db.run(`DELETE FROM learning_roadmaps WHERE analysis_id = ?`, [analysis.id]);

  // Insert analysis
  db.run(
    `INSERT INTO analyses (
      id, title, company, created_at, role_json, candidate_json, 
      role_understanding_json, experience_alignment_json, skills_summary_json, 
      raw_resume_text, raw_jd_text
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      analysis.id,
      analysis.title,
      analysis.company,
      analysis.created_at,
      JSON.stringify(analysis.role),
      JSON.stringify(analysis.candidate),
      JSON.stringify(analysis.role_understanding),
      JSON.stringify(analysis.experience_alignment),
      JSON.stringify(analysis.skills_summary),
      analysis.raw_resume_text || '',
      analysis.raw_jd_text || ''
    ]
  );

  // Insert skill evaluations
  for (const s of analysis.skill_evaluations) {
    db.run(
      `INSERT INTO skill_evaluations (
        id, analysis_id, skill, canonical_skill, category, importance, 
        status, job_requirement, resume_evidence, evidence_type, explanation, transferable_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        s.id,
        analysis.id,
        s.skill,
        s.canonical_skill,
        s.category,
        s.importance,
        s.status,
        s.job_requirement,
        s.resume_evidence,
        s.evidence_type,
        s.explanation,
        s.transferable_notes || null
      ]
    );
  }

  // Insert skill gaps
  for (const g of analysis.skill_gaps) {
    db.run(
      `INSERT INTO skill_gaps (
        id, analysis_id, skill, priority, importance, why_it_matters, 
        missing_evidence, recommended_action
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        g.id,
        analysis.id,
        g.skill,
        g.priority,
        g.importance,
        g.why_it_matters,
        g.missing_evidence,
        g.recommended_action
      ]
    );
  }

  // Insert career insights
  for (const ci of analysis.career_insights) {
    db.run(
      `INSERT INTO career_insights (
        id, analysis_id, type, title, current_evidence, improvement_recommendation, caution_note
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        ci.id,
        analysis.id,
        ci.type,
        ci.title,
        ci.current_evidence,
        ci.improvement_recommendation,
        ci.caution_note
      ]
    );
  }

  // Insert interview questions
  for (const q of analysis.interview_questions) {
    db.run(
      `INSERT INTO interview_questions (
        analysis_id, category, question, rationale, expected_evidence_to_share, targeted_skill_or_gap
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        analysis.id,
        q.category,
        q.question,
        q.rationale,
        q.expected_evidence_to_share,
        q.targeted_skill_or_gap || null
      ]
    );
  }

  // Insert learning roadmap
  for (const lr of analysis.learning_roadmap) {
    db.run(
      `INSERT INTO learning_roadmaps (
        id, analysis_id, skill, timeframe, progression_step, practical_action, 
        hands_on_project, measurable_outcome
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        lr.id,
        analysis.id,
        lr.skill,
        lr.timeframe,
        lr.progression_step,
        lr.practical_action,
        lr.hands_on_project,
        lr.measurable_outcome
      ]
    );
  }

  if (persist) {
    saveDbToDisk();
  }
}

export async function getAllAnalyses(): Promise<Array<{
  id: string;
  title: string;
  company: string;
  created_at: string;
  role: { title: string; seniority: string; experience_required: string };
  skills_summary: { strong_count: number; partial_count: number; not_demonstrated_count: number; total: number };
}>> {
  const db = await getDb();
  const res = db.exec(`SELECT id, title, company, created_at, role_json, skills_summary_json FROM analyses ORDER BY created_at DESC`);
  if (!res.length || !res[0].values.length) return [];

  return res[0].values.map(row => {
    const [id, title, company, created_at, role_json, skills_summary_json] = row as string[];
    return {
      id,
      title,
      company,
      created_at,
      role: JSON.parse(role_json),
      skills_summary: JSON.parse(skills_summary_json)
    };
  });
}

export async function getAnalysisById(id: string): Promise<Analysis | null> {
  const db = await getDb();
  const res = db.exec(`SELECT * FROM analyses WHERE id = '${id.replace(/'/g, "''")}'`);
  if (!res.length || !res[0].values.length) return null;

  const row = res[0].values[0];
  const [
    analysisId, title, company, created_at, role_json, candidate_json,
    role_understanding_json, experience_alignment_json, skills_summary_json,
    raw_resume_text, raw_jd_text
  ] = row as string[];

  // Skill evaluations
  const skillsRes = db.exec(`SELECT * FROM skill_evaluations WHERE analysis_id = '${id.replace(/'/g, "''")}'`);
  const skill_evaluations: SkillEvaluation[] = (skillsRes[0]?.values || []).map(r => ({
    id: r[0] as string,
    skill: r[2] as string,
    canonical_skill: r[3] as string,
    category: r[4] as any,
    importance: r[5] as any,
    status: r[6] as any,
    job_requirement: r[7] as string,
    resume_evidence: r[8] as string,
    evidence_type: r[9] as any,
    explanation: r[10] as string,
    transferable_notes: (r[11] as string) || undefined
  }));

  // Skill gaps
  const gapsRes = db.exec(`SELECT * FROM skill_gaps WHERE analysis_id = '${id.replace(/'/g, "''")}'`);
  const skill_gaps: SkillGap[] = (gapsRes[0]?.values || []).map(r => ({
    id: r[0] as string,
    skill: r[2] as string,
    priority: r[3] as any,
    importance: r[4] as any,
    why_it_matters: r[5] as string,
    missing_evidence: r[6] as string,
    recommended_action: r[7] as string
  }));

  // Career insights
  const insightsRes = db.exec(`SELECT * FROM career_insights WHERE analysis_id = '${id.replace(/'/g, "''")}'`);
  const career_insights: ResumeInsightItem[] = (insightsRes[0]?.values || []).map(r => ({
    id: r[0] as string,
    type: r[2] as any,
    title: r[3] as string,
    current_evidence: r[4] as string,
    improvement_recommendation: r[5] as string,
    caution_note: r[6] as string
  }));

  // Interview questions
  const questionsRes = db.exec(`SELECT * FROM interview_questions WHERE analysis_id = '${id.replace(/'/g, "''")}'`);
  const interview_questions: InterviewQuestion[] = (questionsRes[0]?.values || []).map(r => ({
    category: r[2] as any,
    question: r[3] as string,
    rationale: r[4] as string,
    expected_evidence_to_share: r[5] as string,
    targeted_skill_or_gap: (r[6] as string) || undefined
  }));

  // Learning roadmaps
  const roadmapsRes = db.exec(`SELECT * FROM learning_roadmaps WHERE analysis_id = '${id.replace(/'/g, "''")}'`);
  const learning_roadmap: LearningRoadmapItem[] = (roadmapsRes[0]?.values || []).map(r => ({
    id: r[0] as string,
    skill: r[2] as string,
    timeframe: r[3] as string,
    progression_step: r[4] as string,
    practical_action: r[5] as string,
    hands_on_project: r[6] as string,
    measurable_outcome: r[7] as string
  }));

  return {
    id: analysisId,
    title,
    company,
    created_at,
    role: JSON.parse(role_json),
    candidate: JSON.parse(candidate_json),
    role_understanding: JSON.parse(role_understanding_json),
    experience_alignment: JSON.parse(experience_alignment_json),
    skills_summary: JSON.parse(skills_summary_json),
    skill_evaluations,
    skill_gaps,
    career_insights,
    interview_questions,
    learning_roadmap,
    raw_resume_text,
    raw_jd_text
  };
}

export async function deleteAnalysis(id: string): Promise<boolean> {
  const db = await getDb();
  db.run(`DELETE FROM analyses WHERE id = ?`, [id]);
  db.run(`DELETE FROM skill_evaluations WHERE analysis_id = ?`, [id]);
  db.run(`DELETE FROM skill_gaps WHERE analysis_id = ?`, [id]);
  db.run(`DELETE FROM career_insights WHERE analysis_id = ?`, [id]);
  db.run(`DELETE FROM interview_questions WHERE analysis_id = ?`, [id]);
  db.run(`DELETE FROM learning_roadmaps WHERE analysis_id = ?`, [id]);
  db.run(`DELETE FROM chat_messages WHERE analysis_id = ?`, [id]);
  saveDbToDisk();
  return true;
}

export async function getChatMessages(analysisId: string): Promise<ChatMessage[]> {
  const db = await getDb();
  const res = db.exec(`SELECT id, analysis_id, role, content, created_at FROM chat_messages WHERE analysis_id = '${analysisId.replace(/'/g, "''")}' ORDER BY created_at ASC`);
  if (!res.length || !res[0].values.length) return [];
  return res[0].values.map(r => ({
    id: r[0] as string,
    analysis_id: r[1] as string,
    role: r[2] as 'user' | 'assistant',
    content: r[3] as string,
    created_at: r[4] as string
  }));
}

export async function addChatMessage(analysisId: string, role: 'user' | 'assistant', content: string): Promise<ChatMessage> {
  const db = await getDb();
  const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const created_at = new Date().toISOString();
  db.run(
    `INSERT INTO chat_messages (id, analysis_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)`,
    [id, analysisId, role, content, created_at]
  );
  saveDbToDisk();
  return { id, analysis_id: analysisId, role, content, created_at };
}
