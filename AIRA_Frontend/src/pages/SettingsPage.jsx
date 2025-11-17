import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Shield, Bell, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const SettingsPage = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notificationSettings, setNotificationSettings] = useState({
        product_updates: true,
        weekly_summary: false,
        mention_notifications: true,
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('notification_settings')
                .eq('id', user.id)
                .single();
            
            if (data && data.notification_settings) {
                setNotificationSettings(prev => ({ ...prev, ...data.notification_settings }));
            }
            setLoading(false);
        };
        fetchProfile();
    }, [user]);

    const handleNotificationChange = (key) => {
        setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSaveChanges = async () => {
        if (!user) return;
        setSaving(true);
        const { error } = await supabase
            .from('profiles')
            .update({ notification_settings: notificationSettings })
            .eq('id', user.id);
        
        if (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save notification settings.' });
        } else {
            toast({ title: 'Success', description: 'Notification settings saved.' });
        }
        setSaving(false);
    };

    return (
        <>
            <Helmet>
                <title>Settings - AI Research Assistant</title>
                <meta name="description" content="Manage your account and application settings." />
            </Helmet>
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-1 container mx-auto p-4 sm:p-6 md:p-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl font-bold mb-2">Settings</h1>
                        <p className="text-muted-foreground mb-8">Manage your account and preferences.</p>
                        
                        <Tabs defaultValue="profile" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="profile"><User className="mr-2 h-4 w-4 text-blue-500" /> Profile</TabsTrigger>
                                <TabsTrigger value="security"><Shield className="mr-2 h-4 w-4 text-green-500" /> Security</TabsTrigger>
                                <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4 text-orange-500" /> Notifications</TabsTrigger>
                            </TabsList>

                            <TabsContent value="profile" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Profile Information</CardTitle>
                                        <CardDescription>Update your personal details here.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input id="firstName" defaultValue={user?.user_metadata?.name?.split(' ')[0] || ''} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input id="lastName" defaultValue={user?.user_metadata?.name?.split(' ')[1] || ''} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input id="email" type="email" defaultValue={user?.email} disabled />
                                        </div>
                                        <div className="flex justify-end">
                                            <Button>Save Changes</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                             <TabsContent value="security" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Security Settings</CardTitle>
                                        <CardDescription>Manage your password and account security.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="currentPassword">Current Password</Label>
                                            <Input id="currentPassword" type="password" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">New Password</Label>
                                            <Input id="newPassword" type="password" />
                                        </div>
                                        <div className="flex justify-end">
                                            <Button>Update Password</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                             <TabsContent value="notifications" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Notifications</CardTitle>
                                        <CardDescription>Choose how you want to be notified.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {loading ? (
                                            <div className="flex justify-center items-center p-8">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between space-x-2">
                                                    <Label htmlFor="product_updates" className="flex flex-col space-y-1">
                                                        <span>Product Updates</span>
                                                        <span className="font-normal leading-snug text-muted-foreground">
                                                            Receive emails about new features and updates.
                                                        </span>
                                                    </Label>
                                                    <Switch id="product_updates" checked={notificationSettings.product_updates} onCheckedChange={() => handleNotificationChange('product_updates')} />
                                                </div>
                                                <div className="flex items-center justify-between space-x-2">
                                                    <Label htmlFor="weekly_summary" className="flex flex-col space-y-1">
                                                        <span>Weekly Summary</span>
                                                        <span className="font-normal leading-snug text-muted-foreground">
                                                            Get a weekly summary of your activities and progress.
                                                        </span>
                                                    </Label>
                                                    <Switch id="weekly_summary" checked={notificationSettings.weekly_summary} onCheckedChange={() => handleNotificationChange('weekly_summary')} />
                                                </div>
                                                <div className="flex items-center justify-between space-x-2">
                                                    <Label htmlFor="mention_notifications" className="flex flex-col space-y-1">
                                                        <span>Mentions</span>
                                                        <span className="font-normal leading-snug text-muted-foreground">
                                                            Be notified when someone mentions you in a document.
                                                        </span>
                                                    </Label>
                                                    <Switch id="mention_notifications" checked={notificationSettings.mention_notifications} onCheckedChange={() => handleNotificationChange('mention_notifications')} />
                                                </div>
                                                <div className="flex justify-end pt-4">
                                                    <Button onClick={handleSaveChanges} disabled={saving}>
                                                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                        Save Preferences
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </motion.div>
                </main>
            </div>
        </>
    );
};

export default SettingsPage;