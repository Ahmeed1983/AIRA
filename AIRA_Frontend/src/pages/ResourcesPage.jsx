import React from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Database, Pencil, Book, Link as LinkIcon } from 'lucide-react';

const resources = [
  {
    category: 'Research Databases',
    icon: Database,
    color: 'text-blue-500',
    items: [
      { name: 'Google Scholar', url: 'https://scholar.google.com/', description: 'A comprehensive search engine for scholarly literature.' },
      { name: 'JSTOR', url: 'https://www.jstor.org/', description: 'A digital library of academic journals, books, and primary sources.' },
      { name: 'PubMed', url: 'https://pubmed.ncbi.nlm.nih.gov/', description: 'A free search engine for life sciences and biomedical topics.' },
      { name: 'arXiv', url: 'https://arxiv.org/', description: 'An open-access archive for scholarly articles in physics, mathematics, computer science, and more.' },
    ],
  },
  {
    category: 'Writing & Grammar Guides',
    icon: Pencil,
    color: 'text-green-500',
    items: [
      { name: 'Purdue Online Writing Lab (OWL)', url: 'https://owl.purdue.edu/', description: 'A leading resource for writing, research, and citation style guides.' },
      { name: 'Grammarly Handbook', url: 'https://www.grammarly.com/blog/handbook/', description: 'Grammar, style, and mechanics explanations and examples.' },
      { name: 'Hemingway App', url: 'http://www.hemingwayapp.com/', description: 'An app that makes your writing bold and clear.' },
    ],
  },
  {
    category: 'Citation Management',
    icon: Book,
    color: 'text-orange-500',
    items: [
      { name: 'Zotero', url: 'https://www.zotero.org/', description: 'A free, easy-to-use tool to help you collect, organize, cite, and share research.' },
      { name: 'Mendeley', url: 'https://www.mendeley.com/', description: 'A free reference manager and academic social network.' },
      { name: 'EndNote', url: 'https://endnote.com/', description: 'A commercial reference management software package.' },
    ],
  },
];

const ResourcesPage = () => {
  return (
    <>
      <Helmet>
        <title>Resources - AI Research Assistant</title>
        <meta name="description" content="A curated list of essential tools and resources for academic research and writing." />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-12 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Research Resources</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                A curated list of essential tools to supercharge your research and writing.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Accordion type="single" collapsible defaultValue="item-0" className="w-full max-w-4xl mx-auto">
                {resources.map((category, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-xl font-semibold">
                      <div className="flex items-center">
                        <category.icon className={`h-6 w-6 mr-3 ${category.color}`} />
                        {category.category}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        {category.items.map((item, itemIndex) => (
                          <Card key={itemIndex} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4 flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                              </div>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-sm text-primary hover:underline"
                              >
                                Visit <LinkIcon className="h-4 w-4 ml-1 text-blue-500" />
                              </a>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ResourcesPage;