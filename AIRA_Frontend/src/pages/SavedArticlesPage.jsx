
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Loader2, ExternalLink, Trash2, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

const SavedArticlesPage = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [savedPapers, setSavedPapers] = useState([]);
    const [filteredPapers, setFilteredPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        const fetchSavedPapers = async () => {
            if (!user) return;
            setLoading(true);
            const { data, error } = await supabase
                .from('user_saved_papers')
                .select(`
                    saved_at,
                    papers (
                        id,
                        title,
                        abstract,
                        year,
                        url,
                        open_access_pdf_url
                    )
                `)
                .eq('user_id', user.id)
                .order('saved_at', { ascending: false });

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Failed to load saved articles",
                    description: error.message,
                });
            } else {
                const papers = data.map(item => ({ ...item.papers, saved_at: item.saved_at }));
                setSavedPapers(papers);
                setFilteredPapers(papers);
            }
            setLoading(false);
        };

        fetchSavedPapers();
    }, [user, toast]);

    useEffect(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const filteredData = savedPapers.filter(paper => {
            return (
                paper.title?.toLowerCase().includes(lowercasedFilter) ||
                paper.abstract?.toLowerCase().includes(lowercasedFilter)
            );
        });
        setFilteredPapers(filteredData);
    }, [searchTerm, savedPapers]);

    const handleDelete = async (paperId) => {
        if (!user) return;
        setDeletingId(paperId);
        try {
            const { error } = await supabase
                .from('user_saved_papers')
                .delete()
                .eq('user_id', user.id)
                .eq('paper_id', paperId);
            
            if (error) throw error;

            setSavedPapers(prev => prev.filter(p => p.id !== paperId));
            toast({ title: "Article removed", description: "The article has been removed from your saved list." });

        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not remove the article." });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <>
            <Helmet>
                <title>Saved Articles - AI Research Assistant</title>
                <meta name="description" content="Access and manage your saved research articles." />
            </Helmet>
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-1 container mx-auto p-4 sm:p-6 md:p-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl font-bold mb-2">Saved Articles</h1>
                        <p className="text-muted-foreground mb-8">Your personal library of research papers.</p>

                        <Card>
                            <CardHeader>
                                <Input 
                                    placeholder="Search your saved articles..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="flex justify-center items-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredPapers.length > 0 ? filteredPapers.map((paper, index) => (
                                            <motion.div 
                                                key={paper.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                                className="p-4 border rounded-lg bg-card/50"
                                            >
                                                <a href={paper.url} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline">{paper.title}</a>
                                                <p className="text-sm text-muted-foreground mt-1">{paper.year}</p>
                                                <p className="text-sm mt-2 line-clamp-3">{paper.abstract}</p>
                                                <div className="flex items-center gap-2 mt-4">
                                                    <Button asChild variant="outline" size="sm" disabled={!paper.open_access_pdf_url}>
                                                        <a href={paper.open_access_pdf_url} target="_blank" rel="noopener noreferrer">
                                                            <Download className="mr-2 h-4 w-4 text-blue-500" /> Download PDF
                                                        </a>
                                                    </Button>
                                                     <Button asChild variant="outline" size="sm">
                                                        <a href={paper.url} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="mr-2 h-4 w-4 text-gray-500" /> Journal
                                                        </a>
                                                    </Button>
                                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(paper.id)} disabled={deletingId === paper.id}>
                                                        {deletingId === paper.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                                        Remove
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        )) : (
                                            <div className="text-center py-12">
                                                <Save className="mx-auto h-12 w-12 text-muted-foreground" />
                                                <h3 className="mt-4 text-lg font-medium">No saved articles</h3>
                                                <p className="mt-1 text-sm text-muted-foreground">Your saved articles will appear here.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </main>
            </div>
        </>
    );
};

export default SavedArticlesPage;
