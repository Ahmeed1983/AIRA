import React from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from 'framer-motion';

const faqItems = [
  {
    question: "What is this AI-powered platform?",
    answer: "It is an all-in-one platform designed to supercharge your research and writing. It uses artificial intelligence to help you find academic papers, check grammar, paraphrase text, manage citations, and much more."
  },
  {
    question: "Who can benefit from using this platform?",
    answer: "Students, academics, researchers, and writers at all levels can benefit. Whether you're working on a term paper, a dissertation, or a professional research article, our tools are designed to streamline your workflow and improve the quality of your work."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes! When you sign up, you automatically get a trial period with access to all our premium features. This allows you to explore the full power of the platform before committing to a subscription."
  },
  {
    question: "How does the 'Chat with PDF' feature work?",
    answer: "You can upload any PDF document, and our AI will process it, allowing you to ask questions directly about the content. You can ask for summaries, explanations of complex topics, or to find specific information within the document."
  },
  {
    question: "What citation styles are supported?",
    answer: "Our Reference Manager supports a wide range of citation styles, including APA, MLA, Chicago, Harvard, and many more. You can easily format your bibliographies and in-text citations to match your requirements."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We prioritize your privacy and data security. All your documents and personal information are encrypted and stored securely. We do not share your data with third parties."
  }
];

const FaqPage = () => {
  return (
    <>
      <Helmet>
        <title>FAQ - AI Research Assistant</title>
        <meta name="description" content="Find answers to frequently asked questions about the AI research platform." />
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
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Frequently Asked Questions
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Can't find the answer you're looking for? Reach out to our support team.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-12 max-w-3xl"
            >
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
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

export default FaqPage;