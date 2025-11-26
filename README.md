

# **AI Research Assistant (AIRA)**

AIRA (AI Research Assistant) is a web-based platform designed to help students, researchers, and professionals efficiently discover scholarly papers, generate AI-assisted summaries, and interact with PDFs through a Retrieval-Augmented Generation (RAG) system.
It integrates semantic search, vector retrieval, and pluggable AI providers (OpenAI) to create a streamlined research workflow.

---

## **System Overview**

AIRA is structured using a layered and modular architecture for scalability, maintainability, and clean separation of concerns.

### **N-Layer Architecture**

| Layer                             | Description                                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Frontend – Presentation Layer** | Built with React, Vite, and Tailwind CSS. Handles UI, search, chat with PDF, and AI Writer workspace.        |
| **Gateway / Application Layer**   | Supabase Edge Functions manage routing, authentication, and communication between layers.                    |
| **Service Layer (AI + RAG)**      | Performs PDF parsing, embedding, chunk retrieval, and AI inference. Supports provider switching and caching. |
| **Data Layer (Supabase)**         | Postgres + pgvector for metadata, file storage, and vector search. Enforces Row-Level Security (RLS).        |
| **Monitoring & Logging**          | Tracks performance, errors, and AI usage.                                                                    |

---

## **Features**

* Scholarly paper discovery via Semantic Scholar, OpenAlex, Crossref.
* Chat with PDFs through a RAG pipeline.
* AI Writer workspace for summaries, literature reviews, and structured writing.
* Privacy controls for deleting stored data, embeddings, and history.

---

## **Folder Structure**

```
team3-aira-project/
│
├── src/
│   ├── frontend/          # React + Vite + Tailwind UI
│   ├── backend/           # Supabase Edge Functions / API Gateway
│   └── utils/             # Shared utilities
│
├── data/
│   └── sample_papers/     # Test PDFs
│
├── docs/                  # Architecture + UML diagrams
│   ├── AIRA_Design_Architecture.pdf
│   ├── UML_Diagram.png
│   ├── Activity_Diagram.png
│   └── Architecture.png
│
├── scripts/
│   └── setup.sh
│
├── .gitignore
├── package.json
├── README.md
└── LICENSE (optional)
```

---

## **Installation & Setup**

### 1. Clone the repository

```bash
git clone https://github.com/team3-aira-project.git
cd team3-aira-project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-openai-key
```

### 4. Run the development server

**Frontend**

```bash
npm run dev
```

**Backend (optional local Edge Function / Node)**

```bash
npm start
```

---

## **How to Use**

### Login / Authentication

* Uses Supabase Auth (Email, OAuth, SSO).
* Displays saved papers and chat history after login.

### Search Papers

* Enter keywords, authors, or topics.
* Retrieves abstracts, metadata, and DOIs.

### Upload & Chat with PDFs

1. Upload a PDF.
2. AIRA parses, chunks, and embeds the document.
3. Ask questions and receive grounded answers based on your document.

### AI Writer Workspace

* Generate structured, citable academic content.
* Supports inline citations and summaries.

### Delete Your Data

* Use the Privacy → Delete Data option to permanently remove:

  * Uploaded PDFs
  * Embeddings
  * Metadata
  * Chat logs

---

## **Architecture Diagram**

*(Insert the architecture image once uploaded)*

---

## **UML & Activity Diagrams**

The activity diagram outlines:

* Login flow
* Searching papers
* PDF upload
* RAG interaction

---

## **Testing the Project**

* Ensure your Supabase project keys are set correctly.
* Upload sample PDFs from `/data/sample_papers`.
* Check:

  * Retrieval accuracy
  * PDF-chat functionality
  * Delete Data security
  * Authentication workflow

---

## **Contributors**

| Name                | Role                                                             |
| ------------------- | ---------------------------------------------------------------- |
| **Ahmeed Yinusa**   | Lead Developer — Architecture, RAG Pipeline, Backend Integration |
| **Shang Chen**      | Frontend Developer — UI and Tailwind styling                     |
| **Dimitri Nanmejo** | Systems Analyst — UML design, documentation, testing             |

---

## **Tech Stack**

* Frontend: React, Vite, Tailwind CSS
* Backend: Supabase Edge Functions
* Database: Supabase Postgres + pgvector
* AI Providers: OpenAI
* Embeddings: OpenAI
* PDF Parsing: pdfjs-dist
* Hosting: Supabase + Vercel

---

## **Security & Privacy**

* Authentication: Supabase Auth
* Row-Level Security (RLS) active
* API keys stored securely in environment variables
* Full user data deletion supported

---

## **Deployment**

### Frontend Deployment

* Deploy via **Vercel**.

### Backend Deployment

* Deploy Supabase Edge Functions.

### Environment Variables

Add them in:

* Vercel project settings
* Supabase function settings

---

## **References**

* Supabase Docs – [https://supabase.com/docs](https://supabase.com/docs)
* OpenAI API – [https://platform.openai.com](https://platform.openai.com)
* Semantic Scholar API – [https://api.semanticscholar.org](https://api.semanticscholar.org)
* React – [https://react.dev](https://react.dev)
* Tailwind CSS – [https://tailwindcss.com](https://tailwindcss.com)



Just tell me the style you want.
