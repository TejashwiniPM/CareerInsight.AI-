import express, { Request, Response } from 'express';
import multer from 'multer';
import { extractTextFromBuffer } from './document-parser';
import { runCareerInsightAnalysis, askCareerInsight } from './analyzer';
import { 
  getAllAnalyses, 
  getAnalysisById, 
  saveAnalysis, 
  deleteAnalysis, 
  getChatMessages, 
  addChatMessage,
  getDb
} from './db';
import { SAMPLE_ANALYSIS, SAMPLE_RESUME_TEXT, SAMPLE_JOB_DESCRIPTION } from './sample-data';

export const apiRouter = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Health check
apiRouter.get('/health', async (_req: Request, res: Response) => {
  try {
    await getDb();
    res.json({ status: 'ok', time: new Date().toISOString() });
  } catch (err: any) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Sample analysis endpoint
apiRouter.get('/sample', async (_req: Request, res: Response) => {
  res.json({
    analysis: SAMPLE_ANALYSIS,
    sampleResume: SAMPLE_RESUME_TEXT,
    sampleJobDescription: SAMPLE_JOB_DESCRIPTION
  });
});

// Parse resume document (PDF, DOCX, TXT)
apiRouter.post('/parse-resume', upload.single('resume'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No resume file uploaded.' });
      return;
    }

    const { buffer, mimetype, originalname } = req.file;
    const extractedText = await extractTextFromBuffer(buffer, mimetype, originalname);

    if (!extractedText || extractedText.trim().length < 25) {
      res.status(400).json({ 
        error: 'The uploaded document has very little selectable text. If this is an image scan, please switch to the "Paste Text" tab or export your resume directly as PDF/DOCX.' 
      });
      return;
    }

    res.json({
      text: extractedText,
      filename: originalname,
      characterCount: extractedText.length
    });
  } catch (err: any) {
    console.error('Resume upload parsing failed:', err);
    res.status(422).json({ error: err.message || 'Failed to extract text from resume document.' });
  }
});

// Run analysis
apiRouter.post('/analyze', async (req: Request, res: Response): Promise<void> => {
  try {
    const { resumeText, jobDescriptionText, company } = req.body;

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 50) {
      res.status(400).json({ 
        error: 'Resume text is too brief or missing. Please upload a comprehensive resume or paste at least 50 characters of experience details.' 
      });
      return;
    }

    if (!jobDescriptionText || typeof jobDescriptionText !== 'string' || jobDescriptionText.trim().length < 50) {
      res.status(400).json({ 
        error: 'Job description text is too brief. Please paste the full job description or key responsibilities and requirements (at least 50 characters) for meaningful career insight.' 
      });
      return;
    }

    const analysis = await runCareerInsightAnalysis(
      resumeText.trim(),
      jobDescriptionText.trim(),
      company?.trim()
    );

    await saveAnalysis(analysis);
    res.json(analysis);
  } catch (err: any) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: err.message || 'An error occurred while generating the career analysis.' });
  }
});

// List all analyses
apiRouter.get('/analyses', async (_req: Request, res: Response): Promise<void> => {
  try {
    const analyses = await getAllAnalyses();
    res.json(analyses);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to load analyses.' });
  }
});

// Get specific analysis
apiRouter.get('/analyses/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const analysis = await getAnalysisById(req.params.id);
    if (!analysis) {
      res.status(404).json({ error: 'Analysis not found.' });
      return;
    }
    res.json(analysis);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch analysis.' });
  }
});

// Delete analysis
apiRouter.delete('/analyses/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    await deleteAnalysis(req.params.id);
    res.json({ success: true, message: 'Analysis deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete analysis.' });
  }
});

// Ask CareerInsight follow-up chat
apiRouter.post('/ask', async (req: Request, res: Response): Promise<void> => {
  try {
    const { analysisId, question } = req.body;

    if (!analysisId || !question || typeof question !== 'string') {
      res.status(400).json({ error: 'analysisId and question are required.' });
      return;
    }

    const analysis = await getAnalysisById(analysisId);
    if (!analysis) {
      res.status(404).json({ error: 'Analysis record not found.' });
      return;
    }

    // Save user message
    await addChatMessage(analysisId, 'user', question.trim());

    // Fetch message history for context
    const allMessages = await getChatMessages(analysisId);
    const history = allMessages.slice(-10).map(m => ({ role: m.role, content: m.content }));

    // Generate answer
    const answer = await askCareerInsight(analysis, question.trim(), history);

    // Save assistant message
    await addChatMessage(analysisId, 'assistant', answer);

    const updatedMessages = await getChatMessages(analysisId);
    res.json({ answer, messages: updatedMessages });
  } catch (err: any) {
    console.error('Chat error:', err);
    res.status(500).json({ error: err.message || 'Failed to process follow-up question.' });
  }
});

// Get messages for an analysis
apiRouter.get('/analyses/:id/messages', async (req: Request, res: Response): Promise<void> => {
  try {
    const messages = await getChatMessages(req.params.id);
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch chat messages.' });
  }
});
