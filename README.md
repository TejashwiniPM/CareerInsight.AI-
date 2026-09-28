# CareerInsight AI

> **AI-powered evidence-based career intelligence platform that maps resumes to job descriptions with explainable skill gap analysis and interview roadmaps.**

🔗 **Direct Live Link:** [https://ais-pre-na6zyzocdqdx4kxd5wenpy-484792846399.asia-southeast1.run.app](https://ais-pre-na6zyzocdqdx4kxd5wenpy-484792846399.asia-southeast1.run.app)


CareerInsight AI is an explainable career intelligence platform designed to replace opaque ATS keyword scores with verified evidence mapping. It analyzes candidate resumes against target job descriptions to categorize competencies into strong, partial, and unobserved matches, while generating targeted interview questions and actionable learning roadmaps.

---

## 🌟 Core Features

- **Evidence-Based Skill Mapping**: Compares authentic resume evidence directly against job criteria. Categorizes skills into:
  - 🟢 **Strong Match**: Directly demonstrated with project and operational impact.
  - 🟡 **Partial Match**: Contextually mentioned or theoretical exposure without direct execution evidence.
  - ⚪ **Not Demonstrated**: Stated in the job description but unobserved in submitted materials.
- **Explainable Reasoning**: Detailed reasoning for each match to help candidates understand how their experience maps to job requirements.
- **Prioritized Skill Gaps**: Distinguishes between critical required competencies and preferred bonus qualifications.
- **Personalized Interview Prep**: Generates role-specific, behavioral, and gap-targeted interview questions with preparation tips and expected evidence.
- **Actionable Learning Roadmap**: Step-by-step milestones with portfolio project suggestions to bridge missing competencies.
- **Interactive Grounded Assistant**: Ask follow-up questions anchored strictly to your resume and the target role.
- **Document Support**: Parses PDF (`.pdf`), Word (`.docx`), Markdown (`.md`), and plain text (`.txt`) resumes.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend**: Express.js, TypeScript, TSX
- **AI / LLM**: `@google/genai` (Google Gemini 2.5 Flash)
- **Document Processing**: `pdf-parse`, `mammoth`
- **Database**: SQLite (via `sql.js`)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm, yarn, or pnpm
- Gemini API Key from Google AI Studio

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/TejashwiniPM/CareerInsight.AI.git
   cd CareerInsight.AI
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

---

## 📄 License

MIT License.
