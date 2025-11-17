import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PenSquare, FileText, Bot, Loader2, Save, ExternalLink } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/customSupabaseClient';

function DashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
    const [litReviewQuery, setLitReviewQuery] = useState('');
    const [litReviewResults, setLitReviewResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSaving, setIsSaving] = useState(null);
    const [activeTab, setActiveTab] = useState('paper-finder');

    useEffect(() => {
        const hash = location.hash.replace('#', '');
        if (hash) {
            setActiveTab(hash);
        }
    }, [location]);

    const handleLitReviewSearch = async () => {
        if (!litReviewQuery.trim()) {
            toast({ variant: "destructive", title: "Empty Query", description: "Please enter a topic to search for." });
            return;
        }
        setIsSearching(true);
        setLitReviewResults([]);
        try {
            const response = await fetch(`https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(litReviewQuery)}&limit=10&fields=title,authors,year,abstract,url,openAccessPdf`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setLitReviewResults(data.data || []);
            
            // Log activity
            if (user) {
                await supabase.from('activity_history').insert({
                    user_id: user.id,
                    activity_type: 'RESEARCH_PAPER_SEARCH',
                    content: { query: litReviewQuery }
                });
            }

            if (!data.data || data.data.length === 0) {
                toast({ title: "No Results", description: "No papers found for your query. Try a different topic." });
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Search Failed", description: "Could not fetch results from Semantic Scholar." });
        } finally {
            setIsSearching(false);
        }
    };

    const handleSaveArticle = async (paper) => {
        if (!user) return;
        setIsSaving(paper.paperId);

        try {
            const { data: paperData, error: paperError } = await supabase
                .from('papers')
                .upsert({
                    s2_paper_id: paper.paperId,
                    title: paper.title,
                    abstract: paper.abstract,
                    year: paper.year,
                    url: paper.url,
                    open_access_pdf_url: paper.openAccessPdf?.url,
                }, { onConflict: 's2_paper_id' })
                .select()
                .single();

            if (paperError) throw paperError;

            const { error: saveError } = await supabase
                .from('user_saved_papers')
                .insert({
                    user_id: user.id,
                    paper_id: paperData.id,
                });

            if (saveError) throw saveError;

            toast({ title: "Article Saved!", description: "You can find this in your Saved Articles." });
        } catch (error) {
            if (error.code === '23505') {
                toast({ variant: "default", title: "Already Saved", description: "This article is already in your saved list." });
            } else {
                toast({ variant: "destructive", title: "Failed to save article", description: error.message });
            }
        } finally {
            setIsSaving(null);
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
                        <h1 className="text-3xl font-bold">Hello, {userName}</h1>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-8">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="paper-finder"><FileText className="mr-2 h-4 w-4 text-orange-500" /> Research Paper Finder</TabsTrigger>
                                <TabsTrigger value="chat-pdf" onClick={() => navigate('/chat-with-pdf')}><Bot className="mr-2 h-4 w-4 text-purple-500" /> Chat with PDF</TabsTrigger>
                                <TabsTrigger value="ai-writer" onClick={() => navigate('/writer')}><PenSquare className="mr-2 h-4 w-4 text-green-500" /> AI Writer</TabsTrigger>
                            </TabsList>
                            <TabsContent value="paper-finder" className="mt-6">
                                <div className="relative max-w-2xl mx-auto">
                                    <Input type="text" placeholder="Enter a topic for your research..." className="h-12 pl-4 pr-24 rounded-full" value={litReviewQuery} onChange={(e) => setLitReviewQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLitReviewSearch()} />
                                    <Button onClick={handleLitReviewSearch} disabled={isSearching} className="absolute right-2 top-1/2 -translate-y-1/2">{isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}</Button>
                                </div>
                                <AnimatePresence>
                                {litReviewResults.length > 0 && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-8 max-w-3xl mx-auto">
                                        <div className="space-y-4">
                                            {litReviewResults.map(paper => (
                                                <div key={paper.paperId} className="p-4 border rounded-lg bg-card">
                                                    <a href={paper.url} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">{paper.title}</a>
                                                    <p className="text-sm text-muted-foreground mt-1">{(paper.authors || []).map(a => a.name).join(', ')} - {paper.year}</p>
                                                    <p className="text-sm mt-2 line-clamp-3">{paper.abstract}</p>
                                                    <div className="flex items-center gap-2 mt-4">
                                                        <Button asChild variant="outline" size="sm" disabled={!paper.openAccessPdf?.url}>
                                                            <a href={paper.openAccessPdf?.url} target="_blank" rel="noopener noreferrer">
                                                                <ExternalLink className="mr-2 h-4 w-4 text-blue-500" /> Download
                                                            </a>
                                                        </Button>
                                                        <Button variant="outline" size="sm" onClick={() => handleSaveArticle(paper)} disabled={isSaving === paper.paperId}>
                                                            {isSaving === paper.paperId ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4 text-green-500" />}
                                                            Save
                                                        </Button>
                                                        <Button asChild variant="outline" size="sm">
                                                            <a href={paper.url} target="_blank" rel="noopener noreferrer">
                                                                <ExternalLink className="mr-2 h-4 w-4 text-gray-500" /> Journal
                                                            </a>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </TabsContent>
                        </Tabs>
                    </motion.div>
                </main>
            </div>
        </>
    );
}

export default DashboardPage;