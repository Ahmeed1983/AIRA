import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight, Feather, RefreshCw, Sparkles, MessagesSquare, Globe, ListChecks } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Footer } from '@/components/Footer';

const features = [
  {
    title: 'Grammar Checker',
    description: 'Ensure high-quality academic writing in minutes',
    icon: Feather,
    color: 'bg-green-900/30',
    textColor: 'text-green-400',
    link: '/writer'
  },
  {
    title: 'Paraphraser',
    description: 'Improve word choice, fluency, and academic tone',
    icon: RefreshCw,
    color: 'bg-blue-900/30',
    textColor: 'text-blue-400',
    link: '/writer'
  },
  {
    title: 'AI Writing Assistant',
    description: 'Write 2x faster with contextual text suggestions',
    icon: Sparkles,
    color: 'bg-purple-900/30',
    textColor: 'text-purple-400',
    link: '/writer'
  },
  {
    title: 'Chat with PDFs',
    description: 'Extract insights, summaries, and find related papers',
    icon: MessagesSquare,
    color: 'bg-orange-900/30',
    textColor: 'text-orange-400',
    link: '/dashboard'
  },
  {
    title: 'Online Translator',
    description: 'Get accurate academic translation in 50+ languages',
    icon: Globe,
    color: 'bg-teal-900/30',
    textColor: 'text-teal-400',
    link: '/writer'
  },
  {
    title: 'Submission Checks',
    description: 'Perfect your manuscript with 30+ essential checks',
    icon: ListChecks,
    color: 'bg-indigo-900/30',
    textColor: 'text-indigo-400',
    link: '/writer'
  },
];

const FeatureCard = ({ feature, index }) => {
  const navigate = useNavigate();
  const Icon = feature.icon;

  const handleClick = () => {
    navigate(feature.link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      onClick={handleClick}
      className="bg-card p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow cursor-pointer border flex flex-col"
    >
      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-4", feature.color)}>
        <Icon className={cn("w-6 h-6", feature.textColor)} />
      </div>
      <h3 className="font-bold text-lg mb-2 text-foreground">{feature.title}</h3>
      <p className="text-muted-foreground text-sm flex-grow">{feature.description}</p>
    </motion.div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>AIRA - Your All-in-One Research Platform</title>
        <meta name="description" content="Get research-backed answers, find & analyze research papers, streamline literature reviews, manage references, and write documents - faster with one AI-powered research platform." />
      </Helmet>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4">
            <div className="relative isolate pt-14">
              <div className="radial-gradient-background"></div>
              <div className="mx-auto max-w-4xl py-24 sm:py-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <h1 className="text-[70px] font-medium tracking-tight text-foreground leading-[74px]">
                    YOUR ALL-IN-ONE
                    <span className="block text-primary bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-primary py-2">AI RESEARCH ASSISTANT</span>
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                    Get research-backed answers, find & analyze research papers, streamline literature reviews, manage references, and write documents - faster with one AI-powered research platform.
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Button size="lg" onClick={() => navigate('/dashboard')}>
                      Start Writing and Researching
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                  <div className="mt-8 flex items-center justify-center gap-x-2">
                     <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Rated by 1000+ Researchers and Universities
                    </p>
                  </div>
                </motion.div>
              </div>
              <div className="py-12 sm:py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                      <FeatureCard key={feature.title} feature={feature} index={index} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;