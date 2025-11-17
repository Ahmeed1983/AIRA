import React, { useState, useRef, useEffect } from "react";
import { Helmet } from 'react-helmet';
import { Header } from "@/components/Header";
import * as pdfjsLib from "https://esm.sh/pdfjs-dist@4.9.155/legacy/build/pdf.mjs";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/customSupabaseClient';

// pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://esm.sh/pdfjs-dist@4.9.155/legacy/build/pdf.worker.min.js";

const FN_URL = "https://xxavorqrhvvblnbkecjk.supabase.co/functions/v1/pdf-rag";

async function extractPdfText(file) {
  const ab = await file.arrayBuffer();
  const task = pdfjsLib.getDocument({ data: new Uint8Array(ab), disableFontFace: true });
  const doc = await task.promise;
  const pages = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const p = await doc.getPage(i);
    const tc = await p.getTextContent();
    pages.push({ page: i, text: tc.items.map((it) => it.str).join(" ") });
  }
  return pages;
}

export default function ChatWithPdfPage() {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [summary, setSummary] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [doc, setDoc] = useState(null);
  const [thread, setThread] = useState([]);
  const [q, setQ] = useState("");
  const [fileName, setFileName] = useState("");

  const fileRef = useRef(null);
  const threadRef = useRef(null);

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [thread]);

  const addBubble = (role, text) => setThread((t) => [...t, { role, text }]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  async function handleUpload() {
    const file = fileRef.current?.files?.[0];
    if (!file) return setUploadMsg("Please select a PDF.");
    try {
      setBusy(true);
      setUploadMsg("Parsing PDF locally…");
      const pages = await extractPdfText(file);

      setUploadMsg("Uploading & indexing… (this may take 10-30 s)");
      const res = await fetch(`${FN_URL}/stage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_name: file.name, pages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setDoc(data);
      setSummary(`Indexed ${data.pages} pages of "${data.file_name}".`);
      setSuggestions(data.suggested_questions || []);
      setUploadMsg("Done.");
    } catch (e) {
      console.error(e);
      setUploadMsg(`Error: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }

  async function handleAsk(text) {
    const query = text.trim();
    if (!query) return;
    if (!doc) return setUploadMsg("Please upload a PDF first.");
    addBubble("user", query);
    setQ("");
    setBusy(true);
    try {
      const r = await fetch(`${FN_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc_id: doc.doc_id, query }),
      });
      const out = await r.json();
      if (!r.ok) throw new Error(out.error);
      addBubble("assistant", out.answer);

      if (user) {
        await supabase.from('activity_history').insert({
            user_id: user.id,
            activity_type: 'CHAT_WITH_PDF',
            content: { query: query, doc_name: doc.file_name }
        });
      }
    } catch (e) {
      addBubble("assistant", `Error: ${e.message}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Chat with PDF - AI Research Assistant</title>
        <meta name="description" content="Upload a PDF and chat with an AI to get answers, summaries, and insights from your documents." />
      </Helmet>
      <div className="min-h-screen bg-[#020817] text-zinc-100 flex flex-col">
        <Header />
        <main className="flex-1 mx-auto w-full max-w-4xl p-6 space-y-8 pb-20 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-2">Chat with PDF</h1>

          {/* Upload panel */}
          <div className="border border-zinc-700 p-4 rounded-[2rem] space-y-3 flex justify-between items-center">
            <div className="flex-1 mr-4">
                <label htmlFor="pdf-upload" className="px-4 py-2 rounded-[2rem] disabled:opacity-50 bg-[#6328D0] hover:bg-[#5221B0] cursor-pointer inline-block">
                    Browse...
                </label>
                <input id="pdf-upload" type="file" accept="application/pdf" ref={fileRef} disabled={busy} className="hidden" onChange={handleFileChange} />
                {fileName && <span className="ml-4 text-sm text-zinc-400">{fileName}</span>}
            </div>
            <button
              onClick={handleUpload}
              disabled={busy}
              className="px-4 py-2 rounded-[2rem] disabled:opacity-50 bg-[#6328D0] hover:bg-[#5221B0] flex-shrink-0"
            >
              {busy ? "Working…" : "Upload & Index"}
            </button>
          </div>
          {uploadMsg && <p className="text-sm text-zinc-400 -mt-4 ml-4">{uploadMsg}</p>}


          {/* Summary & suggestions */}
          {summary && (
            <div className="border border-zinc-700 p-4 rounded-[2rem] space-y-3">
              <p>{summary}</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleAsk(s)}
                    className="px-3 py-1 rounded-[2rem] text-sm bg-zinc-700 hover:bg-zinc-600"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat box */}
          <div className="border border-zinc-700 p-4 rounded-[2rem] flex flex-col h-[500px]">
            <div ref={threadRef} className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin">
              {thread.map((m, i) => (
                <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                  <span
                    className={`inline-block px-3 py-2 rounded-[1.5rem] ${
                      m.role === "user" ? "bg-[#6328D0]" : "bg-zinc-800"
                    }`}
                  >
                    {m.text}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 bg-[#020817] border border-white rounded-[2rem] px-3 py-2"
                placeholder="Ask a question about your PDF…"
                value={q}
                disabled={busy}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAsk(q)}
              />
              <button
                onClick={() => handleAsk(q)}
                disabled={busy}
                className="px-4 py-2 rounded-[2rem] disabled:opacity-50 bg-[#6328D0] hover:bg-[#5221B0]"
              >
                Ask
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}