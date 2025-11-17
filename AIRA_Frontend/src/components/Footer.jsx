
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Github } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '@/components/AuthModal';

const LOGO_URL = 'https://horizons-cdn.hostinger.com/ddb0dda0-2996-4a30-8929-470aefbbab9a/d3df106fc9bbdd4ed2982bc9768871e4.png';

const footerLinks = {
  solutions: [
    { name: 'AI Writer', href: '/writer' },
    { name: 'Chat with PDF', href: '/chat-with-pdf' },
    { name: 'Research Paper Finder', href: '/dashboard' },
    { name: 'Resources', href: '/resources' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
  ],
  company: [
    { name: 'About', href: '/about' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

export function Footer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    if (user) {
      navigate(href);
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <footer className="bg-card border-t" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8">
              <Link to="/" className="flex items-center space-x-3">
                  <img className="h-12 w-auto" src={LOGO_URL} alt="AIRA Logo" />
                  <span className="font-bold text-xl text-foreground">AIRA</span>
              </Link>
              <p className="text-sm leading-6 text-muted-foreground">
                Your all-in-one AI-powered research and study partner. Get answers, analyze papers, and streamline your academic workflow with cutting-edge artificial intelligence.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <p className="text-sm font-semibold leading-6 text-foreground">Solutions</p>
                  <ul className="mt-6 space-y-4">
                    {footerLinks.solutions.map((item) => (
                      <li key={item.name}>
                        <a href={item.href} onClick={(e) => handleLinkClick(e, item.href)} className="text-sm leading-6 text-muted-foreground hover:text-foreground">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <p className="text-sm font-semibold leading-6 text-foreground">Support</p>
                  <ul className="mt-6 space-y-4">
                    {footerLinks.support.map((item) => (
                      <li key={item.name}>
                        <Link to={item.href} className="text-sm leading-6 text-muted-foreground hover:text-foreground">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <p className="text-sm font-semibold leading-6 text-foreground">Company</p>
                  <ul className="mt-6 space-y-4">
                    {footerLinks.company.map((item) => (
                      <li key={item.name}>
                        <Link to={item.href} className="text-sm leading-6 text-muted-foreground hover:text-foreground">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <p className="text-sm font-semibold leading-6 text-foreground">Legal</p>
                  <ul className="mt-6 space-y-4">
                    {footerLinks.legal.map((item) => (
                      <li key={item.name}>
                        <Link to={item.href} className="text-sm leading-6 text-muted-foreground hover:text-foreground">
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 border-t pt-8 sm:mt-20 lg:mt-24 flex justify-between items-center">
            <p className="text-xs leading-5 text-muted-foreground">&copy; 2025 AIRA. All rights reserved.</p>
            <div className="flex space-x-6">
                <a href="https://github.com/dimsonMba/AIRA" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">GitHub</span>
                  <Github className="h-6 w-6" />
                </a>
              </div>
          </div>
        </div>
      </footer>
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
}
