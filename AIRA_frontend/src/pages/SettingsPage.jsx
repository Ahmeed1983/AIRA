import React from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Shield, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

const SettingsPage = () => {
    const { user } = useAuth();

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
                                        <p className="text-center text-muted-foreground p-8">Notification settings are coming soon!</p>
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