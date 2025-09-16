import React from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';

const TermsOfServicePage = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - AI Study Assistant</title>
        <meta name="description" content="Read the Terms of Service for AI Study Assistant." />
      </Helmet>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-16 sm:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto prose dark:prose-invert"
            >
              <h1>Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: August 31, 2025</p>
              
              <p>Please read these Terms of Service ("Terms") carefully before using the AI Study Assistant platform operated by us. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.</p>

              <h2>1. Accounts</h2>
              <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
              
              <h2>2. Use of Service</h2>
              <p>You agree not to use the service for any illegal or unauthorized purpose. You are responsible for your conduct and any data, text, files, information, usernames, images, graphics, photos, profiles, audio and video clips, sounds, musical works, works of authorship, applications, links and other content or materials that you submit, post or display on or via the Service.</p>

              <h2>3. Intellectual Property</h2>
              <p>The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of AI Study Assistant and its licensors. You retain all rights to the content you create or upload to the platform.</p>

              <h2>4. Termination</h2>
              <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

              <h2>5. Changes to Terms</h2>
              <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default TermsOfServicePage;