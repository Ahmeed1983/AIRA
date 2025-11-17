import React from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - AI Study Assistant</title>
        <meta name="description" content="Read the Privacy Policy for AI Study Assistant." />
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
              <h1>Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: August 31, 2025</p>
              
              <p>Welcome to AI Study Assistant. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.</p>

              <h2>1. Information We Collect</h2>
              <p>We may collect personal information such as your name, email address, and payment information when you register for an account or subscribe to our services. We also collect data you provide directly, such as documents you upload or text you input into our tools.</p>
              
              <h2>2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                  <li>Provide, operate, and maintain our services</li>
                  <li>Improve, personalize, and expand our services</li>
                  <li>Understand and analyze how you use our services</li>
                  <li>Develop new products, services, features, and functionality</li>
                  <li>Communicate with you for customer service, updates, and marketing</li>
                  <li>Process your transactions</li>
                  <li>Find and prevent fraud</li>
              </ul>

              <h2>3. Data Security</h2>
              <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.</p>

              <h2>4. Your Data Rights</h2>
              <p>You have the right to access, update, or delete the information we have on you. If you wish to exercise these rights, please contact us through our settings page or support channels.</p>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicyPage;