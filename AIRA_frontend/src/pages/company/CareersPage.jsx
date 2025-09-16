import React from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const jobOpenings = [
    { title: "Senior Frontend Engineer (React)", location: "Remote", type: "Full-time" },
    { title: "AI/ML Research Scientist", location: "Remote", type: "Full-time" },
    { title: "Product Designer (UI/UX)", location: "Remote", type: "Contract" },
    { title: "DevOps Engineer", location: "Remote", type: "Full-time" },
];

const CareersPage = () => {
  return (
    <>
      <Helmet>
        <title>Careers - AI Study Assistant</title>
        <meta name="description" content="Join our team and help us build the future of academic research." />
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
                Join Our Mission
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
                We're looking for passionate individuals who want to redefine the academic landscape. If you're excited by challenges and driven by impact, we'd love to hear from you.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-20 max-w-3xl mx-auto"
            >
                <h2 className="text-3xl font-bold text-center mb-10">Current Openings</h2>
                <div className="space-y-6">
                    {jobOpenings.map((job, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle>{job.title}</CardTitle>
                                <CardDescription>{job.location} &middot; {job.type}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button>
                                    Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CareersPage;