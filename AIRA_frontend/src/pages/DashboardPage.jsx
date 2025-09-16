import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, FileText, Bot, ArrowRight, Upload, Loader2, CheckCircle, XCircle, ExternalLink, Bookmark, Layers, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/customSupabaseClient';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.js`;

function DashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
    const fileInputRef = useRef(null);
    const [uploadStatus, setUploadStatus] = useState('idle');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [litReviewQuery, setLitReviewQuery] = useState('');
    const [litReviewResults, setLitReviewResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summary, setSummary] = useState('');
    const [pdfText, setPdfText] = useState('');
    const [isExtracting, setIsExtracting] = useState(false);
    const [extractionMessage, setExtractionMessage] = useState('Processing...');
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isChatting, setIsChatting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(null);

    const handleCardClick = (path) => {
        navigate(path);
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const extractTextFromPdf = async (file) => {
        setIsExtracting(true);
        setPdfText('');
        setExtractionMessage('Parsing PDF...');

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = "";

            for (let i = 1; i <= pdf.numPages; i++) {
                setExtractionMessage(`Processing page ${i} of ${pdf.numPages}...`);
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(" ");
                fullText += `\n\n[Page ${i}]\n` + pageText;
            }
            
            const finalText = fullText.trim();
            if (!finalText) {
                throw new Error("Could not extract text from this PDF. It might be an image-only file.");
            }

            setPdfText(finalText);
            toast({ title: "PDF Processed", description: "You can now chat with your document." });
            return true;
        } catch (error) {
            console.error("PDF Processing Error:", error);
            toast({ variant: "destructive", title: "PDF Error", description: error.message || "Could not extract text from PDF. It may be corrupted or an unsupported format." });
            return false;
        } finally {
            setIsExtracting(false);
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            toast({ variant: "destructive", title: "Invalid File Type", description: "Please upload a PDF file." });
            return;
        }

        setUploadStatus('processing');
        setChatMessages([]);

        const success = await extractTextFromPdf(file);

        if (success) {
            setUploadedFile(file);
            setUploadStatus('success');
            toast({ title: "Ready to Go!", description: `${file.name} is processed and ready.` });
        } else {
            setUploadedFile(null);
            setUploadStatus('error');
            setTimeout(() => setUploadStatus('idle'), 3000);
        }
    };
    
    const handleSendChatMessage = async () => {
        if (!chatInput.trim() || !pdfText.trim()) {
            toast({ variant: "destructive", title: "Cannot send message", description: "Please upload a PDF and type a question." });
            return;
        }

        const newMessages = [...chatMessages, { role: 'user', content: chatInput }];
        setChatMessages(newMessages);
        const question = chatInput;
        setChatInput('');
        setIsChatting(true);

        try {
            const { data, error } = await supabase.functions.invoke('chat', { body: { question, context: pdfText } });
            if (error || data.error) throw new Error(error?.message || data.error);
            
            setChatMessages([...newMessages, { role: 'assistant', content: data.answer }]);
        } catch (error) {
            toast({ variant: "destructive", title: "AI Chat Error", description: error.message });
            setChatMessages(newMessages); // Keep user message on error
        } finally {
            setIsChatting(false);
        }
    };

    const handleGenerateFromPDF = async (type) => {
        if (!pdfText.trim()) {
            toast({ variant: "destructive", title: "No PDF Content", description: "Please upload a PDF first." });
            return;
        }
        setIsGenerating(type);
        
        try {
            let result;
            let resultText = '';
            
            if (type === 'flashcards') {
                const { data, error } = await supabase.functions.invoke('flashcards', { body: { text: pdfText, count: 10 } });
                if (error || data.error) throw new Error(error?.message || data.error);
                result = data.flashcards;
                resultText = result.map(fc => `Q: ${fc.question}\nA: ${fc.answer}`).join('\n\n');
            } else if (type === 'quiz') {
                const { data, error } = await supabase.functions.invoke('quiz', { body: { text: pdfText, count: 5 } });
                 if (error || data.error) throw new Error(error?.message || data.error);
                result = data.quiz;
                resultText = result.map(q => `Q: ${q.question}\nOptions: ${q.options.join(', ')}\nAnswer: ${q.answer}`).join('\n\n');
            }
            
            const title = type.charAt(0).toUpperCase() + type.slice(1);
            setChatMessages(prev => [...prev, { role: 'assistant', content: `**Generated ${title}:**\n\n${resultText}` }]);
            toast({ title: `${title} Generated!`, description: `Scroll down to see the results.` });

        } catch (error) {
            toast({ variant: "destructive", title: `Failed to generate ${type}`, description: error.message });
        } finally {
            setIsGenerating(null);
        }
    };

    const handleLitReviewSearch = async () => {
        if (!litReviewQuery.trim()) {
            toast({ variant: "destructive", title: "Empty Query", description: "Please enter a topic to search for." });
            return;
        }
        setIsSearching(true);
        setLitReviewResults([]);
        setSummary('');
        try {
            const response = await fetch(`https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(litReviewQuery)}&limit=10&fields=title,authors,year,abstract,url`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setLitReviewResults(data.data || []);
            if (!data.data || data.data.length === 0) {
                toast({ title: "No Results", description: "No papers found for your query. Try a different topic." });
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Search Failed", description: "Could not fetch results from Semantic Scholar." });
        } finally {
            setIsSearching(false);
        }
    };

    const handleSaveSearch = async () => {
        if (!litReviewQuery.trim()) return;
        setIsSaving(true);
        const { error } = await supabase.from('activity_history').insert({
            user_id: user.id, activity_type: 'RESEARCH_PAPER_SEARCH', content: { query: litReviewQuery }
        });
        
        if (error) {
            toast({ variant: "destructive", title: "Failed to save search", description: error.message });
        } else {
            toast({ title: "Search Saved!", description: "You can find this search in your history." });
        }
        setIsSaving(false);
    };

    const handleSummarizeAbstracts = async () => {
        const abstracts = litReviewResults.map(p => p.abstract).filter(Boolean);
        if (abstracts.length === 0) {
            toast({ variant: "destructive", title: "No Abstracts", description: "Cannot generate summary as no abstracts were found." });
            return;
        }
        setIsSummarizing(true);
        setSummary('');
        try {
            const { data, error } = await supabase.functions.invoke('summarize', { body: { abstracts } });
            if (error || data.error) throw new Error(error?.message || data.error);
            setSummary(data.text);
            toast({ title: "Summary Generated!", description: "AI-powered summary is ready below." });
        } catch (error) {
            toast({ variant: "destructive", title: "Summarization Failed", description: error.message });
        } finally {
            setIsSummarizing(false);
        }
    };

    const renderUploadState = () => {
        switch (uploadStatus) {
            case 'processing': return <div className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin text-blue-500" /> {extractionMessage}</div>;
            case 'success': return <div className="flex items-center justify-center gap-2 text-green-500"><CheckCircle className="h-4 w-4" /> Ready!</div>;
            case 'error': return <div className="flex items-center justify-center gap-2 text-destructive"><XCircle className="h-4 w-4" /> Error!</div>;
            default: return <><Upload className="mr-2 h-4 w-4 text-blue-500" /> Upload PDF</>;
        }
    };

    return (
        <>
            <Helmet>
                <title>Dashboard - AI Research Assistant</title>
                <meta name="description" content="Your personal AI research dashboard. Chat with AI, summarize notes, and manage your research." />
            </Helmet>
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 container mx-auto p-6 sm:p-8 md:p-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <h1 className="text-3xl font-bold">Hello, {userName} 👋</h1>
                        <Tabs defaultValue="paper-finder" className="w-full mt-8">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="paper-finder"><FileText className="mr-2 h-4 w-4 text-orange-500" /> Research Paper Finder</TabsTrigger>
                                <TabsTrigger value="chat-pdf"><Bot className="mr-2 h-4 w-4 text-purple-500" /> Chat with PDF</TabsTrigger>
                            </TabsList>
                            <TabsContent value="paper-finder" className="mt-6">
                                <div className="relative max-w-2xl mx-auto">
                                    <Input type="text" placeholder="Enter a topic for your research..." className="h-12 pl-4 pr-24 rounded-full" value={litReviewQuery} onChange={(e) => setLitReviewQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLitReviewSearch()} />
                                    <Button onClick={handleLitReviewSearch} disabled={isSearching} className="absolute right-2 top-1/2 -translate-y-1/2">{isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}</Button>
                                </div>
                                <AnimatePresence>
                                {litReviewResults.length > 0 && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8 max-w-3xl mx-auto">
                                        <div className="flex justify-end gap-2 mb-4">
                                            <Button variant="outline" size="sm" onClick={handleSaveSearch} disabled={isSaving}>{isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bookmark className="mr-2 h-4 w-4 text-blue-500" />} Save Search</Button>
                                            <Button variant="default" size="sm" onClick={handleSummarizeAbstracts} disabled={isSummarizing}>{isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-yellow-300" />} Summarize Abstracts</Button>
                                        </div>
                                        {summary && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 border rounded-lg bg-card text-sm">
                                                <h3 className="font-bold text-lg mb-2 flex items-center"><Sparkles className="h-5 w-5 mr-2 text-yellow-400" /> AI Summary</h3>
                                                <p className="whitespace-pre-wrap leading-relaxed">{summary}</p>
                                            </motion.div>
                                        )}
                                        <div className="space-y-4">
                                            {litReviewResults.map(paper => (
                                                <div key={paper.paperId} className="p-4 border rounded-lg bg-card">
                                                    <a href={paper.url} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">{paper.title} <ExternalLink className="inline h-4 w-4 ml-1 text-blue-500" /></a>
                                                    <p className="text-sm text-muted-foreground mt-1">{(paper.authors || []).map(a => a.name).join(', ')} - {paper.year}</p>
                                                    <p className="text-sm mt-2 line-clamp-3">{paper.abstract}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </TabsContent>
                            <TabsContent value="chat-pdf" className="mt-6 max-w-3xl mx-auto">
                                {uploadedFile ? (
                                    <div className="border rounded-lg h-[70vh] flex flex-col">
                                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                            {chatMessages.map((msg, i) => (
                                                <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                                    {msg.role === 'assistant' && <Bot className="h-6 w-6 text-purple-500 flex-shrink-0" />}
                                                    <div className={`p-3 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {isChatting && <div className="flex justify-start"><Loader2 className="h-5 w-5 animate-spin text-purple-500" /></div>}
                                        </div>
                                        <div className="p-4 border-t space-y-3">
                                            <div className="flex flex-wrap gap-2">
                                                <Button variant="outline" size="sm" onClick={() => handleGenerateFromPDF('flashcards')} disabled={!pdfText || isGenerating}>
                                                    {isGenerating === 'flashcards' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Layers className="mr-2 h-4 w-4 text-orange-500" />}
                                                    Generate Flashcards
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => handleGenerateFromPDF('quiz')} disabled={!pdfText || isGenerating}>
                                                    {isGenerating === 'quiz' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <HelpCircle className="mr-2 h-4 w-4 text-green-500" />}
                                                    Generate Quiz
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => {fileInputRef.current.click()}}>
                                                    <Upload className="mr-2 h-4 w-4 text-blue-500" /> Change PDF
                                                </Button>
                                            </div>
                                            <div className="relative">
                                                <Input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendChatMessage()} placeholder="Ask a question about the document..." className="pr-12" disabled={isChatting || !pdfText} />
                                                <Button size="icon" onClick={handleSendChatMessage} disabled={isChatting || !pdfText || !chatInput.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"><ArrowRight className="h-4 w-4" /></Button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center max-w-lg mx-auto">
                                        <Bot className="mx-auto h-12 w-12 text-purple-500 mb-4" />
                                        <h2 className="text-xl font-semibold">Chat with PDF</h2>
                                        <p className="text-muted-foreground mt-2 mb-6">Upload your PDFs to get summaries, ask questions, and find related information instantly. All processing is done in your browser.</p>
                                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf" className="hidden" />
                                        <Button onClick={handleUploadClick} disabled={uploadStatus === 'processing'}>{renderUploadState()}</Button>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <motion.div whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }} className="bg-card p-6 rounded-lg border cursor-pointer" onClick={() => toast({ title: '🚧 This feature isn\'t implemented yet—but don\'t worry! You can request it in your next prompt! 🚀' })}>
                                <div className="flex justify-between items-start">
                                    <div><h3 className="font-bold text-lg">Reference Manager</h3><p className="text-muted-foreground mt-1">Manage, Annotate, Understand and Cite References</p></div>
                                    <ArrowRight className="text-muted-foreground" />
                                </div>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }} className="bg-card p-6 rounded-lg border cursor-pointer" onClick={() => handleCardClick('/writer')}>
                                <div className="flex justify-between items-start">
                                    <div><h3 className="font-bold text-lg">AI Writer</h3><p className="text-muted-foreground mt-1">Write, improve and Cite better and faster</p></div>
                                    <ArrowRight className="text-muted-foreground" />
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </>
    );
}

export default DashboardPage;