import React from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Lightbulb, PlusCircle, ArrowUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const popularRequests = [
    { title: "Integration with Zotero/Mendeley", votes: 128 },
    { title: "Mobile App for iOS and Android", votes: 97 },
    { title: "Advanced project management features", votes: 65 },
];

const FeatureRequestsPage = () => {
  return (
    <>
      <Helmet>
        <title>Feature Requests - AI Study Assistant</title>
        <meta name="description" content="Suggest new features and vote on existing ideas to help shape the future of our platform." />
      </Helmet>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-16 sm:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                Shape Our Roadmap
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
                Have a great idea? We want to hear it! Submit your feature requests and vote on your favorites. Your feedback directly influences what we build next.
              </p>
            </motion.div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="md:col-span-2"
                >
                    <h2 className="text-2xl font-bold mb-6">Popular Requests</h2>
                    <div className="space-y-4">
                        {popularRequests.map((req, index) => (
                            <Card key={index}>
                                <CardContent className="p-4 flex items-center justify-between">
                                    <p className="font-medium">{req.title}</p>
                                    <Button variant="outline" size="sm">
                                        <ArrowUp className="mr-2 h-4 w-4 text-green-500" />
                                        {req.votes}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <PlusCircle className="mr-2 h-5 w-5 text-green-500" />
                                Submit a Request
                            </CardTitle>
                            <CardDescription>Share your brilliant idea with us.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-4">
                                <div>
                                    <Label htmlFor="request-idea">Your Idea</Label>
                                    <Textarea id="request-idea" placeholder="e.g., I would love to see..." className="mt-2" />
                                </div>
                                <Button type="submit" className="w-full">Submit</Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default FeatureRequestsPage;