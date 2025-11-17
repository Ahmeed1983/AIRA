import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { History, Sparkles, FileText, Bot, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

const activityIcons = {
  'AI_SEARCH': { icon: Sparkles, color: 'text-purple-500' },
  'RESEARCH_PAPER_SEARCH': { icon: FileText, color: 'text-orange-500' },
  'CHAT_WITH_PDF': { icon: Bot, color: 'text-green-500' },
};

const activityLabels = {
  'AI_SEARCH': 'AI Search',
  'RESEARCH_PAPER_SEARCH': 'Research Paper Finder',
  'CHAT_WITH_PDF': 'Chat with PDF'
};

const formatTimestamp = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays === 1) return `1 day ago`;
    return `${diffInDays} days ago`;
};


const HistoryPage = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [history, setHistory] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;
            setLoading(true);
            const { data, error } = await supabase
                .from('activity_history')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Failed to load history",
                    description: error.message,
                });
            } else {
                setHistory(data);
                setFilteredHistory(data);
            }
            setLoading(false);
        };

        fetchHistory();
    }, [user, toast]);

    useEffect(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        const filteredData = history.filter(item => {
            return (
                item.content?.query?.toLowerCase().includes(lowercasedFilter) ||
                activityLabels[item.activity_type]?.toLowerCase().includes(lowercasedFilter)
            );
        });
        setFilteredHistory(filteredData);
    }, [searchTerm, history]);

    return (
        <>
            <Helmet>
                <title>Recent Activities - AI Research Assistant</title>
                <meta name="description" content="Review your past searches, chats, and generated content." />
            </Helmet>
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-1 container mx-auto p-4 sm:p-6 md:p-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl font-bold mb-2">Recent Activities</h1>
                        <p className="text-muted-foreground mb-8">Review your past activity and resume your work.</p>

                        <Card>
                            <CardHeader>
                                <Input 
                                    placeholder="Search your activities..." 
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
                                    <ul className="space-y-4">
                                        {filteredHistory.length > 0 ? filteredHistory.map((item, index) => {
                                            const { icon: Icon, color } = activityIcons[item.activity_type] || { icon: History, color: 'text-muted-foreground' };
                                            return (
                                                <motion.li 
                                                    key={item.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent/50 transition-colors"
                                                >
                                                    <Icon className={`h-5 w-5 mt-1 flex-shrink-0 ${color}`} />
                                                    <div className="flex-1">
                                                        <p className="font-medium text-foreground">{item.content.query}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge variant="secondary">{activityLabels[item.activity_type] || 'General'}</Badge>
                                                            <span className="text-xs text-muted-foreground">{formatTimestamp(item.created_at)}</span>
                                                        </div>
                                                    </div>
                                                </motion.li>
                                            );
                                        }) : (
                                            <div className="text-center py-12">
                                                <History className="mx-auto h-12 w-12 text-muted-foreground" />
                                                <h3 className="mt-4 text-lg font-medium">No recent activity</h3>
                                                <p className="mt-1 text-sm text-muted-foreground">Your recent activity will appear here.</p>
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

export default HistoryPage;