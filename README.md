
AI Research Assistant (AIRA)
Overview
AIRA (AI Research Assistant) is a web-based platform designed to assist students, researchers, and professionals in efficiently discovering scholarly papers, generating AI-assisted summaries, and interacting with PDFs through a retrieval-augmented AI system.
It combines semantic search, RAG (Retrieval-Augmented Generation), and pluggable AI provider integration (OpenAI) to create a seamless and intelligent research workflow. System Architecture Overview
AIRA follows a layered and microservices architecture pattern for modularity, scalability, and maintainability.

AIRA Architectural N-Layer Workflow
Frontend (Presentation Layer)	
Built with React, Vite, and Tailwind CSS. Manages UI, search interface, chat with PDF, and AI Writer workspace.	
Gateway / Application Layer	
Supabase Edge Function routes API requests, manages authentication (via Supabase), and connects frontend to backend services.	
Service Layer (AI + RAG)	
Handles PDF parsing, embedding, retrieval, and communication with AI models. Includes provider switching and caching.	
Data Layer (Supabase)	
Postgres + pgvector database for structured data, embeddings, and file storage. Implements Row-Level Security (RLS).	
Monitoring & Logging Layer	
Logs performance metrics, errors, and AI usage for reliability and observability.	
Features
Scholarly Paper Discovery – Search across APIs (Semantic Scholar, OpenAlex, Crossref).
Chat with PDFs & Paper Summarization – Upload and interact with documents using RAG-based question answering.
AI Writer Workspace – Compose structured academic content with auto-citations.
User Privacy and Control – Delete stored data and manage preferences securely.
Folder Structure
team3-aira-project/
│
├── src/                   # Source code for frontend and backend
│   ├── frontend/          # React + Vite + Tailwind UI
│   ├── backend/           # Supabase Edge Functions gateway API
│   └── utils/             # Shared utilities and helper scripts
│
├── data/                  # Sample datasets or test PDFs
│   └── sample_papers/
│
├── scripts/               # Utility and setup scripts
│   └── setup.sh
│
├── docs/                  # Documentation and architecture diagrams
│   ├── AIRA_Design_Architecture.pdf
│   ├── UML_Diagram.png
│   ├── Activity_Diagram.png
│   └── Architecture.png
│
├── .gitignore             # Ignored files
├── package.json           # Project dependencies
├── README.md              # Main documentation
└── LICENSE (optional)
Installation & Setup
1. Clone the Repository
git clone https://github.com/team3-aira-project.git
cd team3-aira-project
2. Install Dependencies
Note: Terminal in any IDE used
If using Node.js (Download Node.js in your local system):
npm install
3. Configure Environment Variables
Create a .env.local file in the root directory and add:
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-openai-key
4. Run the Development Server
For the frontend (Vite + React):
npm run dev
For backend (if using local edge function or Node server):
npm start
How to Use
Login / Authentication
Uses Supabase Auth (email or SSO login).
After logging in, the dashboard displays saved papers and chat history.
Search Papers
Enter a topic, author, or keyword.
Retrieve metadata, abstracts, and DOIs from integrated academic APIs.
Upload and Chat with PDFs
Upload your research paper.
AIRA parses, chunks, and embeds it in the database.
Ask questions: the AI responds with answers grounded in your document.
AI Writer
Generate literature reviews or summaries directly in the writing workspace.
Supports inline citations and reference formatting.
Delete Data
Use “Privacy → Delete Data” to permanently remove your stored documents, embeddings, and history.
Architecture Diagram

The diagram above illustrates how AIRA’s layers interact:
Frontend communicates through API Gateway.
RAG Service processes document embeddings.
Supabase handles storage and vector queries.
OpenAI provides reasoning and generation.
UML Diagrams

Activity Diagram

The activity diagram highlights both sequential and parallel workflows (login, search, chat, PDF processing), verifying runtime behavior across layers.
Testing the Project
Ensure Supabase project and API keys are configured.
Upload a sample PDF from /data/sample_papers.
Run queries in the chat interface to verify retrieval and AI output.
Test logout and “Delete Data” to confirm RLS compliance.
Contributors
Team member role and responsibilities
Ahmeed Yinusa	
Lead Developer: Architecture design, RAG pipeline, backend integration	
Shang Chen	
Frontend Developer: UI/UX, React components, Tailwind styling	
Dimitri Nanmejo: Systems Analyst, UML design, documentation, testing, and reporting.
Tech Stack
Frontend: React, Vite, Tailwind CSS
Backend: Supabase Edge Functions
Database: Supabase Postgres + pgvector
AI Providers: OpenAI
Embeddings: OpenAI
Parsing: PDF parsing using pdfjs-dist within the Supabase Edge Function
Hosting: Supabase + Vercel (recommended)
Security & Privacy
All authentication is managed through Supabase Auth.
Database enforces Row-Level Security (RLS).
API keys are never exposed on the client side.
Users can permanently delete data and revoke access.
Deployment
You can deploy AIRA easily via:
Vercel for frontend
Supabase Edge Functions for backend logic
Add environment variables in project settings for keys
License
This project is not licensed yet under the MIT License.
References
Supabase Documentation
OpenAI API
Semantic Scholar API
Tailwind CSS
React
