import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Library, Loader2, ExternalLink, Trash2, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

const LibraryPage = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [libraryItems, setLibraryItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        const fetchLibraryItems = async () => {
            if (!user) return;
            setLoading(true);
            const { data, error } = await supabase
                .from('library')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Failed to load library",
                    description: error.message,
                });
            } else {
                setLibraryItems(data);
                setFilteredItems(data);
            }
            setLoading(false);
        };

        fetchLibraryItems();
    }, [user, toast]);

    useEffect(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const filteredData = libraryItems.filter(item => {
            return (
                item.citation?.toLowerCase().includes(lowercasedFilter) ||
                item.snippet?.toLowerCase().includes(lowercasedFilter)
            );
        });
        setFilteredItems(filteredData);
    }, [searchTerm, libraryItems]);

    const handleDelete = async (itemId) => {
        if (!user) return;
        setDeletingId(itemId);
        try {
            const { error } = await supabase
                .from('library')
                .delete()
                .eq('user_id', user.id)
                .eq('id', itemId);
            
            if (error) throw error;

            setLibraryItems(prev => prev.filter(p => p.id !== itemId));
            toast({ title: "Item removed", description: "The reference has been removed from your library." });

        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Could not remove the item." });
        } finally {
            setDeletingId(null);
        }
    };

    const handleCopyCitation = (citation) => {
        navigator.clipboard.writeText(citation);
        toast({ title: 'Copied!', description: 'Citation copied to clipboard.' });
    };

    return (
        <>
            <Helmet>
                <title>Library - AI Research Assistant</title>
                <meta name="description" content="Access and manage your saved references and citations." />
            </Helmet>
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-1 container mx-auto p-4 sm:p-6 md:p-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl font-bold mb-2">My Library</h1>
                        <p className="text-muted-foreground mb-8">Your personal collection of saved references from the AI Writer.</p>

                        <Card>
                            <CardHeader>
                                <Input 
                                    placeholder="Search your library..." 
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
                                        {filteredItems.length > 0 ? filteredItems.map((item, index) => (
                                            <motion.div 
                                                key={item.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                                className="p-4 border rounded-lg bg-card/50"
                                            >
                                                <p className="font-semibold">{item.citation}</p>
                                                <p className="text-sm text-muted-foreground mt-1 italic">"{item.snippet}"</p>
                                                <div className="flex items-center gap-2 mt-4">
                                                    <Button asChild variant="outline" size="sm" disabled={!item.url}>
                                                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="mr-2 h-4 w-4 text-blue-500" /> View Source
                                                        </a>
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleCopyCitation(item.citation)}>
                                                        <Copy className="mr-2 h-4 w-4 text-green-500" /> Copy
                                                    </Button>
                                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)} disabled={deletingId === item.id}>
                                                        {deletingId === item.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                                        Remove
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        )) : (
                                            <div className="text-center py-12">
                                                <Library className="mx-auto h-12 w-12 text-muted-foreground" />
                                                <h3 className="mt-4 text-lg font-medium">Your Library is Empty</h3>
                                                <p className="mt-1 text-sm text-muted-foreground">Items you save from the AI Writer will appear here.</p>
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

export default LibraryPage;