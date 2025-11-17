import React from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ContactUsPage = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us - AI Study Assistant</title>
        <meta name="description" content="Get in touch with the AI Study Assistant support team." />
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
                Get in Touch
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
                We're here to help! Whether you have a question about our features, a billing inquiry, or a partnership proposal, please don't hesitate to reach out.
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-16 max-w-xl mx-auto"
            >
                <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="first-name">First name</Label>
                        <Input type="text" id="first-name" autoComplete="given-name" className="mt-2" />
                    </div>
                    <div>
                        <Label htmlFor="last-name">Last name</Label>
                        <Input type="text" id="last-name" autoComplete="family-name" className="mt-2" />
                    </div>
                    <div className="sm:col-span-2">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" autoComplete="email" className="mt-2" />
                    </div>
                     <div className="sm:col-span-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" rows={4} className="mt-2" />
                    </div>
                </div>
                <div className="mt-8">
                    <Button type="submit" className="w-full">Let's talk</Button>
                </div>
            </motion.form>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ContactUsPage;