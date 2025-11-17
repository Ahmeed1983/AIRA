import React from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const blogPosts = [
    { title: "The Future of AI in Academic Research", description: "Exploring how AI is set to change the research landscape.", category: "AI & Research", date: "August 25, 2025" },
    { title: "5 Tips for Writing a Flawless Thesis", description: "Our top tips for students embarking on their thesis writing journey.", category: "Writing Tips", date: "August 18, 2025" },
    { title: "Introducing 'Chat with PDF': A Game Changer", description: "A deep dive into our newest feature and how it can help you.", category: "Product Updates", date: "August 10, 2025" },
];

const BlogPage = () => {
  return (
    <>
      <Helmet>
        <title>Blog - AI Study Assistant</title>
        <meta name="description" content="Stay updated with the latest news, tips, and product updates from AI Study Assistant." />
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
                Our Blog
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
                Insights, tutorials, and updates from the AI Study Assistant team.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {blogPosts.map((post, index) => (
                    <Card key={index} className="flex flex-col">
                        <CardHeader>
                            <div className="mb-4">
                               <Badge variant="secondary">{post.category}</Badge>
                            </div>
                            <CardTitle>{post.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col">
                            <CardDescription className="flex-grow">{post.description}</CardDescription>
                            <p className="text-xs text-muted-foreground mt-4">{post.date}</p>
                        </CardContent>
                    </Card>
                ))}
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BlogPage;