import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PlusCircle, Upload, Book, FileText, Loader2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const ReferencesPage = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [references, setReferences] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const fetchReferences = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('documents')
                .select('id, file_name, uploaded_at, file_size, file_path')
                .eq('user_id', user.id)
                .order('uploaded_at', { ascending: false });

            if (error) throw error;
            setReferences(data || []);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error fetching references',
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if(user) {
            fetchReferences();
        }
    }, [user, toast]);

    const handleImportClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const filePath = `${user.id}/${Date.now()}-${file.name}`;

        try {
            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(filePath, file);
            if (uploadError) throw uploadError;

            const { error: dbError } = await supabase.from('documents').insert({
                user_id: user.id,
                file_name: file.name,
                file_path: filePath,
                file_size: file.size,
                mime_type: file.type,
            });
            if (dbError) throw dbError;

            toast({
                title: 'Upload Successful',
                description: `${file.name} has been added to your library.`,
            });
            fetchReferences();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Upload Failed',
                description: error.message,
            });
        } finally {
            setIsUploading(false);
            event.target.value = null;
        }
    };
    
    const handleDelete = async (id, filePath) => {
        const originalReferences = [...references];
        setReferences(references.filter(ref => ref.id !== id));

        try {
            const { error: storageError } = await supabase.storage.from('documents').remove([filePath]);
            if (storageError) throw storageError;

            const { error: dbError } = await supabase.from('documents').delete().eq('id', id);
            if (dbError) throw dbError;

            toast({
                title: 'Reference Deleted',
                description: 'The reference has been removed from your library.',
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Deletion Failed',
                description: error.message,
            });
            setReferences(originalReferences);
        }
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const filteredReferences = references.filter(ref =>
        ref.file_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Helmet>
                <title>References - AI Research Assistant</title>
                <meta name="description" content="Manage, annotate, and cite your research references." />
            </Helmet>
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-1 container mx-auto p-4 sm:p-6 md:p-8">
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold">Reference Manager</h1>
                            <div className="flex gap-2">
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="application/pdf" />
                                <Button variant="outline" onClick={handleImportClick} disabled={isUploading}>
                                    {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                    Import PDF
                                </Button>
                                <Button onClick={() => toast({ title: 'Coming Soon!', description: 'Manual entry will be available shortly.' })}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add New
                                </Button>
                            </div>
                        </div>

                        <Card>
                            <CardHeader>
                               <Input placeholder="Search your library..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="flex justify-center items-center py-20">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : (
                                    <ul className="space-y-2">
                                        {filteredReferences.length > 0 ? filteredReferences.map((ref, index) => (
                                            <motion.li
                                                key={ref.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                                className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
                                            >
                                                <FileText className="h-6 w-6 text-primary flex-shrink-0" />
                                                <div className="flex-1">
                                                    <p className="font-medium text-foreground truncate">{ref.file_name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {new Date(ref.uploaded_at).toLocaleDateString()} - {formatBytes(ref.file_size)}
                                                    </p>
                                                </div>
                                                <Button variant="ghost" size="icon" className="text-muted-foreground opacity-0 group-hover:opacity-100" onClick={() => handleDelete(ref.id, ref.file_path)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </motion.li>
                                        )) : (
                                            <div className="text-center py-20">
                                                <Book className="mx-auto h-12 w-12 text-muted-foreground" />
                                                <h3 className="mt-4 text-lg font-medium">Your Library is Empty</h3>
                                                <p className="mt-1 text-sm text-muted-foreground">Import your first PDF to get started.</p>
                                            </div>
                                        )}
                                    </ul>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </main>
            </div>
        </>
    );
};

export default ReferencesPage;