import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Sparkles, Book, Loader2, Download, Save, ExternalLink, Copy, Plus, Search, AlignLeft, FileDown, Library, ClipboardType } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Textarea } from '@/components/ui/textarea';

const WriterPage = () => {
    const { user } = useAuth();
    const { toast } = useToast();

    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [lastPayload, setLastPayload] = useState({ html: "", markdown: "", references: [] });
    const [headings, setHeadings] = useState([]);
    const [highlightedRef, setHighlightedRef] = useState(null);
    const [isSavingRef, setIsSavingRef] = useState(null);

    const responseLogRef = useRef(null);

    const showComingSoonToast = (feature) => {
        toast({
            title: 'Research',
            description: `The ${feature} Research`,
        });
    };

    const handleGenerate = async () => {
        const topic = prompt.trim();
        if (!topic) {
            toast({ variant: 'destructive', title: 'Prompt is empty', description: 'Please enter a prompt to generate content.' });
            return;
        }
        
        setIsGenerating(true);
        setLastPayload({ html: "", markdown: "", references: [] });
        setHeadings([]);

        const FN_URL = "https://xxavorqrhvvblnbkecjk.functions.supabase.co/writer-generate";
        try {
            const response = await fetch(FN_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic: topic, topN: 6 })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(errorText);
                throw new Error("Request failed. Check console for details.");
            }

            const data = await response.json();
            setLastPayload(data);

            if (user) {
                await supabase.from('activity_history').insert({
                    user_id: user.id,
                    activity_type: 'AI_SEARCH',
                    content: { query: topic }
                });
            }
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data.html || '';
            const extractedHeadings = Array.from(tempDiv.querySelectorAll('h1, h2, h3')).map(h => h.textContent);
            setHeadings(extractedHeadings);

            toast({ title: 'Content Generated', description: 'AI response has been loaded.' });

        } catch (error) {
            toast({ variant: 'destructive', title: 'Request Failed', description: error.message });
            setLastPayload({ html: "<p>No content.</p>", markdown: "", references: [] });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCitationClick = (refId) => {
        setHighlightedRef(refId);
        const refElement = document.querySelector(`[data-ref-id="${refId}"]`);
        if (refElement) {
            refElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        setTimeout(() => setHighlightedRef(null), 2000);
    };

    useEffect(() => {
        if (lastPayload.html && responseLogRef.current) {
            const el = responseLogRef.current;
            const citationChips = el.querySelectorAll('[data-cite-id]');
            citationChips.forEach(chip => {
                const refId = chip.getAttribute('data-cite-id');
                chip.onclick = () => handleCitationClick(refId);
            });
        }
    }, [lastPayload.html]);

    const handleCopyMarkdown = async () => {
        if (!lastPayload.markdown) {
            toast({ variant: 'destructive', title: 'Nothing to Copy', description: 'Generate content first.' });
            return;
        }
        await navigator.clipboard.writeText(lastPayload.markdown);
        toast({ title: 'Copied!', description: 'Markdown copied to clipboard.' });
    };

    const handleExportRefs = () => {
        if (lastPayload.references.length === 0) {
            toast({ variant: 'destructive', title: 'No References', description: 'There are no references to export.' });
            return;
        }
        const bibtexContent = lastPayload.references.map((ref) => {
            return `@article{ref${ref.index},\n  author  = "${ref.authors.join(' and ')}",\n  title   = "${ref.title}",\n  year    = ${ref.year}\n}`;
        }).join('\n\n');

        const blob = new Blob([bibtexContent], { type: 'application/x-bibtex' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'references.bib';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({ title: 'References Exported', description: 'A .bib file has been downloaded.' });
    };

    const handleSaveStrategy = () => {
        toast({ title: 'Saved (mock)', description: 'Your search strategy has been saved.' });
    };

    const handleCopyCitation = (citation) => {
        navigator.clipboard.writeText(citation);
        toast({ title: 'Copied!', description: 'Citation copied to clipboard.' });
    };

    const handleAddToLibrary = async (ref) => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Not logged in', description: 'You must be logged in to save references.' });
            return;
        }
        const refId = ref.index;
        setIsSavingRef(refId);
        try {
            const { error } = await supabase
                .from('library')
                .insert({
                    user_id: user.id,
                    citation: `${ref.title} (${ref.year})`,
                    snippet: `${ref.authors.join(", ")}`,
                    url: ref.url,
                });
            if (error) {
                if (error.code === '23505') { // unique constraint violation
                    toast({ variant: "default", title: "Already Saved", description: "This reference is already in your library." });
                } else {
                    throw error;
                }
            } else {
                toast({ title: 'Reference Saved!', description: 'Added to your personal library.' });
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Save Failed', description: error.message });
        } finally {
            setIsSavingRef(null);
        }
    };

    const handleRerunSearch = () => {
        showComingSoonToast('Re-run Search');
    };

    const handleExportChat = () => {
        const input = responseLogRef.current;
        if (!input || !lastPayload.html) {
            toast({ variant: 'destructive', title: 'No Content', description: 'There is no content to export.' });
            return;
        }

        const isDarkMode = document.body.classList.contains('dark');
        const backgroundColor = isDarkMode ? '#0f172a' : '#ffffff';

        html2canvas(input, { backgroundColor, scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 10;
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save('ai-chat-export.pdf');
            toast({ title: 'Chat Exported', description: 'Your chat has been saved as a PDF.' });
        });
    };
    
    const handleTocClick = (e, heading) => {
        e.preventDefault();
        const id = heading.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleAddAllToLibrary = async () => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Not logged in', description: 'You must be logged in to save references.' });
            return;
        }
        if (lastPayload.references.length === 0) {
            toast({ variant: 'destructive', title: 'No References', description: 'There are no references to add.' });
            return;
        }

        const itemsToInsert = lastPayload.references.map(ref => ({
            user_id: user.id,
            citation: `${ref.title} (${ref.year})`,
            snippet: `${ref.authors.join(", ")}`,
            url: ref.url,
        }));

        try {
            const { error } = await supabase.from('library').insert(itemsToInsert, { onConflict: 'citation, user_id' });
            if (error) throw error;
            toast({ title: 'References Saved', description: 'All references have been added to your library.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save all references. Some may already exist.' });
        }
    };

    return (
        <>
            <Helmet>
                <title>AI Writer - Research Console</title>
                <meta name="description" content="A powerful three-column research console for writing and evidence gathering." />
            </Helmet>
            <div className="flex flex-col h-screen bg-background">
                <Header />
                <main className="flex-1 grid grid-cols-12 gap-4 p-4 overflow-hidden">
                    {/* Left Rail */}
                    <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="col-span-12 md:col-span-3 flex flex-col gap-4">
                        <Card className="flex-1">
                            <CardHeader>
                                <CardTitle className="flex items-center text-lg"><AlignLeft className="mr-2 h-5 w-5" />Table of Contents</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto max-h-[calc(100vh-250px)]"> {/* Added max-h and overflow-y-auto */}
                                {headings.length > 0 ? (
                                    <ul id="tocList" className="space-y-2 text-sm">
                                        {headings.map(heading => (
                                            <li key={heading}>
                                                <a href={`#${heading.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')}`} onClick={(e) => handleTocClick(e, heading)} className="text-muted-foreground hover:text-primary transition-colors">
                                                    {heading}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-muted-foreground">Generate content to see a table of contents.</p>
                                )}
                                <div className="flex flex-col gap-2 mt-4">
                                    <Button id="exportAllRefsBtn" variant="outline" className="w-full" onClick={handleExportRefs}><Download className="mr-2 h-4 w-4" /> Export References</Button>
                                    <Button variant="outline" className="w-full" onClick={handleExportChat}><FileDown className="mr-2 h-4 w-4" /> Export Chat</Button>
                                    <Button variant="outline" className="w-full" onClick={handleAddAllToLibrary}><Library className="mr-2 h-4 w-4" /> Add All to Library</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    
                    {/* Center Column */}
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="col-span-12 md:col-span-6 flex flex-col gap-4 h-full">
                        <div className="flex items-center gap-2">
                            <Input id="topic" placeholder="Type your research topic..." value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleGenerate()} />
                            <Button id="generateBtn" onClick={handleGenerate} disabled={isGenerating}>
                                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                <span className="ml-2">Generate</span>
                            </Button>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Button id="copyMdBtn" variant="outline" size="sm" onClick={handleCopyMarkdown}><ClipboardType className="mr-2 h-4 w-4"/>Copy as Markdown</Button>
                        </div>
                        <Card className="flex-1 flex flex-col overflow-hidden">
                            <CardContent className="p-6 flex-1 overflow-y-auto max-h-[calc(100vh-250px)]"> {/* Added max-h and overflow-y-auto */}
                                {isGenerating ? (
                                    <div className="prose dark:prose-invert max-w-none space-y-4">
                                        <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                                        <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                                        <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                                        <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                                        <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                                    </div>
                                ) : lastPayload.html ? (
                                    <div
                                        id="writer-pane"
                                        ref={responseLogRef}
                                        className="prose dark:prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: lastPayload.html }}
                                    />
                                ) : (
                                    <div className="text-center text-muted-foreground h-full flex flex-col justify-center items-center">
                                        <Bot className="h-12 w-12 mb-4" />
                                        <p>Your AI-generated content will appear here.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Right Rail */}
                    <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="col-span-12 md:col-span-3 flex flex-col">
                        <Card className="h-full flex flex-col">
                            <Tabs defaultValue="references" className="w-full flex flex-col flex-1">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger id="refsTabBtn" value="references" aria-controls="refsPanel"><Book className="h-4 w-4 mr-2 text-green-500"/>References</TabsTrigger>
                                    <TabsTrigger id="strategyTabBtn" value="strategy" aria-controls="strategyPanel"><Search className="h-4 w-4 mr-2 text-blue-500"/>Search Strategy</TabsTrigger>
                                </TabsList>
                                <TabsContent id="refs" value="references" className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[calc(100vh-250px)]"> {/* Added max-h and overflow-y-auto */}
                                    {lastPayload.references.length > 0 ? lastPayload.references.map((ref) => (
                                        <div key={ref.index} data-ref-id={ref.index} className={`p-3 rounded-lg border transition-all ${highlightedRef === ref.index ? 'bg-primary/20 border-primary shadow-lg' : 'bg-card'}`}>
                                            <p className="text-xs font-semibold"><b>[{ref.index}]</b> {ref.title} ({ref.year}) — {ref.authors.join(", ")}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Button asChild variant="outline" size="sm" className="text-xs h-7" disabled={!ref.url}>
                                                    <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline"><ExternalLink className="mr-1 h-3 w-3"/> link</a>
                                                </Button>
                                                <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => handleCopyCitation(`${ref.title} (${ref.year})`)}><Copy className="mr-1 h-3 w-3"/> Copy</Button>
                                                <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => handleAddToLibrary(ref)} disabled={isSavingRef === ref.index}>
                                                    {isSavingRef === ref.index ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Plus className="mr-1 h-3 w-3"/>}
                                                    Add
                                                </Button>
                                            </div>
                                        </div>
                                    )) : <p className="text-sm text-muted-foreground text-center pt-8">References will appear here.</p>}
                                </TabsContent>
                                <TabsContent id="strategyPanel" value="strategy" className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-250px)]"> {/* Added max-h and overflow-y-auto */}
                                    <div className="space-y-2">
                                        <Label htmlFor="strategyQuery">Query</Label>
                                        <Input id="strategyQuery" defaultValue="protein structure function" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="yearFrom">Year From</Label>
                                            <Input id="yearFrom" type="number" defaultValue="2018" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="yearTo">Year To</Label>
                                            <Input id="yearTo" type="number" defaultValue="2025" />
                                        </div>
                                    </div>
                                    <div id="strategyFilters" className="space-y-2">
                                        <Label>Filters</Label>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="filter-oa" defaultChecked />
                                            <Label htmlFor="filter-oa" className="text-sm font-normal">Open Access</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="filter-review" defaultChecked />
                                            <Label htmlFor="filter-review" className="text-sm font-normal">Review Article</Label>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="strategyNotes">Notes</Label>
                                        <Textarea id="strategyNotes" placeholder="e.g., focused on crystallography methods" />
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button id="saveStrategyBtn" className="flex-1" onClick={handleSaveStrategy}><Save className="mr-2 h-4 w-4"/> Save Strategy</Button>
                                        <Button id="rerunStrategyBtn" variant="secondary" className="flex-1" onClick={handleRerunSearch}><Search className="mr-2 h-4 w-4"/> Re-run Search</Button>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </Card>
                    </motion.div>
                </main>
            </div>
        </>
    );
};

export default WriterPage;
