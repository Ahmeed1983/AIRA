import React from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { Users, Lightbulb, Target } from 'lucide-react';

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us - AI Research Assistant</title>
        <meta name="description" content="Learn about the mission and vision behind the AI Research Assistant." />
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
                Empowering the Next Generation of Thinkers
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
                We are dedicated to building tools that revolutionize the way students and researchers approach their work. We believe that by harnessing the power of artificial intelligence, we can unlock human potential and accelerate discovery.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-500/10 text-red-500 mb-4">
                  <Target className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
                <p className="mt-2 text-muted-foreground">To provide intelligent, intuitive, and accessible tools that streamline the research and writing process, enabling users to focus on critical thinking and innovation.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-yellow-500/10 text-yellow-500 mb-4">
                  <Lightbulb className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold">Our Vision</h2>
                <p className="mt-2 text-muted-foreground">To become the indispensable digital partner for every student and researcher worldwide, fostering a global community of efficient and effective scholars.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-500/10 text-blue-500 mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold">Our Team</h2>
                <p className="mt-2 text-muted-foreground">We are a passionate team of developers, designers, and academics committed to creating a product that makes a real impact on education and research.</p>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AboutPage;