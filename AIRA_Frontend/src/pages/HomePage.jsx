
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { UserPlus, Book, Library, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/AuthModal';

const features = [
  {
    title: 'Reference & Citations',
    description: 'Instantly create citations in any format',
    icon: Book,
    color: 'bg-green-100 dark:bg-green-900/30',
    textColor: 'text-green-600 dark:text-green-400',
    link: '/writer'
  },
  {
    title: 'Resources',
    description: 'Access a vast library of academic resources',
    icon: Library,
    color: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-600 dark:text-blue-400',
    link: '/resources'
  },
  {
    title: 'Research Library',
    description: 'Organize and manage your personal research library',
    icon: Library,
    color: 'bg-purple-100 dark:bg-purple-900/30',
    textColor: 'text-purple-600 dark:text-purple-400',
    link: '/library'
  },
  {
    title: 'Saved Search',
    description: 'Save your searches and get notified of new papers',
    icon: Save,
    color: 'bg-orange-100 dark:bg-orange-900/30',
    textColor: 'text-orange-600 dark:text-orange-400',
    link: '/saved-articles'
  },
];

const FeatureCard = ({ feature, index, onClick }) => {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      onClick={() => onClick(feature.link)}
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
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleActionClick = (path) => {
    if (user) {
      navigate(path);
    } else {
      setShowAuthModal(true);
    }
  };

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
                    <Button size="lg" onClick={() => handleActionClick('/writer')}>
                      <UserPlus className="mr-2 h-5 w-5" />
                      Start Writing and Researching
                    </Button>
                  </div>
                </motion.div>
              </div>
              <div className="py-12 sm:py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                      <FeatureCard key={feature.title} feature={feature} index={index} onClick={handleActionClick} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
};

export default HomePage;
