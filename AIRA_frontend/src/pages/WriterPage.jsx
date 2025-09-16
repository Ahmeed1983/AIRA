import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Sparkles, Book, FileText, Loader2, Plus, CornerUpLeft, CornerUpRight, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify as Justify, List, ListOrdered, Image, Table, ChevronDown, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';

const WriterPage = () => {
    const { user } = useAuth();
    const { toast } = useToast();

    const [documents, setDocuments] = useState([]);
    const [currentDocument, setCurrentDocument] = useState(null);
    const [editorContent, setEditorContent] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [history, setHistory] = useState(['']);
    const [historyIndex, setHistoryIndex] = useState(0);
    
    const editorRef = useRef(null);

    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [isChatting, setIsChatting] = useState(false);

    const updateEditorContent = (newContent, addToHistory = true) => {
        setEditorContent(newContent);
        if (editorRef.current) {
            editorRef.current.innerHTML = newContent;
        }

        if (addToHistory) {
            const newHistory = history.slice(0, historyIndex + 1);
            newHistory.push(newContent);
            setHistory(newHistory);
            setHistoryIndex(newHistory.length - 1);
        }
    };
    
    const fetchDocuments = useCallback(async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('documents')
            .select('id,title')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });
        if (error) {
            toast({ variant: 'destructive', title: 'Error fetching documents', description: error.message });
        } else {
            setDocuments(data);
            if (data.length > 0 && !currentDocument) {
                loadDocument(data[0].id);
            } else if (data.length === 0 && !currentDocument) {
                handleNewDocument();
            }
        }
    }, [user, toast]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const loadDocument = async (docId) => {
        const { data, error } = await supabase.from('documents').select('*').eq('id', docId).single();
        if (error) {
            toast({ variant: 'destructive', title: 'Error loading document', description: error.message });
        } else {
            setCurrentDocument(data);
            const content = data.content ? JSON.parse(data.content) : '';
            updateEditorContent(content);
            setHistory([content]);
            setHistoryIndex(0);
        }
    };

    const handleNewDocument = async () => {
        const newDoc = {
            user_id: user.id,
            title: 'Untitled Document',
            content: JSON.stringify('')
        };
        const { data, error } = await supabase.from('documents').insert(newDoc).select().single();
        if (error) {
            toast({ variant: 'destructive', title: 'Error creating document', description: error.message });
        } else {
            setCurrentDocument(data);
            updateEditorContent('');
            setHistory(['']);
            setHistoryIndex(0);
            fetchDocuments();
        }
    };
    
    const handleSaveDocument = async () => {
        if (!currentDocument) return;
        setIsSaving(true);
        const content = editorRef.current.innerHTML;
        const { error } = await supabase
            .from('documents')
            .update({ content: JSON.stringify(content), title: currentDocument.title })
            .eq('id', currentDocument.id);

        setIsSaving(false);
        if (error) {
            toast({ variant: 'destructive', title: 'Error saving document', description: error.message });
        } else {
            toast({ title: 'Document Saved', description: 'Your changes have been saved.' });
        }
    };

    const handleContentChange = () => {
        const content = editorRef.current.innerHTML;
        const text = editorRef.current.innerText;
        setWordCount(text.trim().split(/\s+/).filter(Boolean).length);

        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(content);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const handleToolbarCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current.focus();
        handleContentChange();
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            updateEditorContent(history[newIndex], false);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            updateEditorContent(history[newIndex], false);
        }
    };
    
    const getSelectedText = () => {
        const selection = window.getSelection();
        return selection.toString();
    };

    const handleAskAI = () => {
        const selectedText = getSelectedText();
        if (selectedText) {
            setChatInput(`Regarding the selected text: "${selectedText}", `);
        } else {
            setChatInput('');
        }
        toast({ title: 'Ready to Assist!', description: 'Ask a question about your selected text in the AI Assistant panel.' });
    };

    const handleCite = () => {
        toast({ title: 'Citation Added', description: 'A placeholder citation has been added. Connect your sources!' });
        document.execCommand('insertHTML', false, ` <span style="color: var(--primary-color); background: var(--secondary-color); padding: 2px 4px; border-radius: 4px;">[citation needed]</span>&nbsp;`);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const newMessages = [...chatMessages, { role: 'user', content: chatInput }];
        setChatMessages(newMessages);
        setChatInput('');
        setIsChatting(true);

        try {
            const prompt = `You are an AI research assistant. The user is writing a document. Here is the current content of their document:\n\n---\n${editorRef.current.innerText}\n---\n\nNow, please respond to the following request: ${chatInput}`;
            const { data, error } = await supabase.functions.invoke('summarize', { body: { prompt } });
            
            if (error || data.error) throw new Error(error?.message || data.error);
            
            setChatMessages([...newMessages, { role: 'assistant', content: data.text }]);
        } catch (error) {
            toast({ variant: "destructive", title: "AI Chat Error", description: error.message });
            setChatMessages(newMessages); 
        } finally {
            setIsChatting(false);
        }
    };
    
    return (
        <>
            <Helmet>
                <title>AI Writer - AI Research Assistant</title>
                <meta name="description" content="A powerful and intuitive writing environment for researchers." />
            </Helmet>
            <div className="flex flex-col h-screen bg-background">
                <Header />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full bg-card border-b p-2 flex items-center justify-between text-sm flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={handleNewDocument}>
                                <Plus className="h-4 w-4 mr-1 text-green-500" /> New
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <FileText className="h-4 w-4 mr-1 text-blue-500" />
                                        {currentDocument?.title || 'Untitled Document'}
                                        <ChevronDown className="h-4 w-4 ml-1" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {documents.map(doc => (
                                        <DropdownMenuItem key={doc.id} onClick={() => loadDocument(doc.id)}>{doc.title}</DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="flex items-center gap-1 px-4 border-x h-full">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleUndo}><CornerUpLeft className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRedo}><CornerUpRight className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" onClick={handleAskAI}><Sparkles className="h-4 w-4 mr-1 text-purple-500" /> Ask AI</Button>
                            <Button variant="ghost" size="sm" onClick={handleCite}><Book className="h-4 w-4 mr-1 text-orange-500" /> Cite</Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="w-28 justify-start">Body Text <ChevronDown className="h-4 w-4 ml-auto" /></Button></DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleToolbarCommand('formatBlock', 'p')}>Body</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleToolbarCommand('formatBlock', 'h1')}>Heading 1</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleToolbarCommand('formatBlock', 'h2')}>Heading 2</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarCommand('bold')}><Bold className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarCommand('italic')}><Italic className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarCommand('underline')}><Underline className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarCommand('justifyLeft')}><AlignLeft className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarCommand('justifyCenter')}><AlignCenter className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarCommand('justifyRight')}><AlignRight className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarCommand('justifyFull')}><Justify className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarCommand('insertUnorderedList')}><List className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToolbarCommand('insertOrderedList')}><ListOrdered className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({ title: '🚧 This feature isn\'t implemented yet—but don\'t worry! You can request it in your next prompt! 🚀' })}><Image className="h-4 w-4 text-teal-500" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({ title: '🚧 This feature isn\'t implemented yet—but don\'t worry! You can request it in your next prompt! 🚀' })}><Table className="h-4 w-4 text-indigo-500" /></Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">{wordCount} Words</span>
                            <Button variant="ghost" size="sm" onClick={handleSaveDocument} disabled={isSaving}>
                                {isSaving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1 text-blue-500" />}
                                {isSaving ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </motion.div>

                    <main className="flex-1 grid grid-cols-12 gap-2 p-2 overflow-hidden">
                        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="col-span-3">
                            <Card className="h-full flex flex-col">
                                <Tabs defaultValue="notes" className="w-full flex flex-col flex-1">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="notes"><Book className="h-4 w-4 mr-2 text-orange-500"/>Notes</TabsTrigger>
                                        <TabsTrigger value="source"><FileText className="h-4 w-4 mr-2 text-blue-500"/>Source</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="notes" className="flex-1 p-2"><Textarea placeholder="Your research notes go here..." className="h-full w-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"/></TabsContent>
                                    <TabsContent value="source" className="flex-1 p-2"><div className="text-center p-4 text-muted-foreground"><p>Source content will be displayed here.</p></div></TabsContent>
                                </Tabs>
                            </Card>
                        </motion.div>
                        
                        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="col-span-6">
                            <Card className="h-full flex flex-col">
                                <CardContent className="p-4 flex-1 overflow-y-auto">
                                    <div
                                        ref={editorRef}
                                        contentEditable={true}
                                        onInput={handleContentChange}
                                        className="h-full w-full outline-none text-lg"
                                        dangerouslySetInnerHTML={{ __html: editorContent }}
                                    />
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="col-span-3">
                            <Card className="h-full flex flex-col">
                                <div className="p-4 border-b flex items-center"><Sparkles className="h-5 w-5 mr-2 text-purple-500" /><h2 className="font-semibold">AI Assistant</h2></div>
                                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                                    {chatMessages.map((msg, i) => (
                                        <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                            {msg.role === 'assistant' && <Bot className="h-6 w-6 text-purple-500 flex-shrink-0" />}
                                            <div className={`p-3 rounded-lg max-w-[90%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}><p className="text-sm whitespace-pre-wrap">{msg.content}</p></div>
                                        </div>
                                    ))}
                                    {isChatting && <div className="flex justify-start"><Loader2 className="h-5 w-5 animate-spin text-purple-500" /></div>}
                                </div>
                                <div className="p-4 border-t">
                                    <form onSubmit={handleSendMessage}>
                                        <Textarea placeholder="Ask AI to help you write..." className="resize-none" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}/>
                                        <Button type="submit" className="w-full mt-2" disabled={isChatting}>{isChatting ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Send'}</Button>
                                    </form>
                                </div>
                            </Card>
                        </motion.div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default WriterPage;