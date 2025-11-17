import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import HomePage from '@/pages/HomePage';
import DashboardPage from '@/pages/DashboardPage';
import WriterPage from '@/pages/WriterPage';
import HistoryPage from '@/pages/HistoryPage';
import SettingsPage from '@/pages/SettingsPage';
import FaqPage from '@/pages/FaqPage';
import ResourcesPage from '@/pages/ResourcesPage';
import ReferencesPage from '@/pages/ReferencesPage';
import AboutPage from '@/pages/company/AboutPage';
import HelpCenterPage from '@/pages/support/HelpCenterPage';
import ContactUsPage from '@/pages/support/ContactUsPage';
import PrivacyPolicyPage from '@/pages/legal/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/legal/TermsOfServicePage';
import SavedArticlesPage from '@/pages/SavedArticlesPage';
import LibraryPage from '@/pages/LibraryPage';
import ChatWithPdfPage from '@/pages/ChatWithPdfPage';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

const LOGO_URL = 'https://horizons-cdn.hostinger.com/ddb0dda0-2996-4a30-8929-470aefbbab9a/d3df106fc9bbdd4ed2982bc9768871e4.png';

function App() {
  return (
    <AuthProvider>
      <Helmet
        bodyAttributes={{
            class: 'dark'
        }}
      >
        <title>AI Research Assistant</title>
        <meta name="description" content="Your all-in-one AI-powered research and study partner. Get answers, analyze papers, and streamline your work." />
        <meta property="og:title" content="AI Research Assistant" />
        <meta property="og:description" content="Your all-in-one AI-powered research and study partner." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" href={LOGO_URL} type="image/png" />
      </Helmet>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        
        {/* Company Pages */}
        <Route path="/about" element={<AboutPage />} />

        {/* Support Pages */}
        <Route path="/help" element={<HelpCenterPage />} />
        <Route path="/contact" element={<ContactUsPage />} />

        {/* Legal Pages */}
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/writer" element={<ProtectedRoute><WriterPage /></ProtectedRoute>} />
        <Route path="/references" element={<ProtectedRoute><ReferencesPage /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/saved-articles" element={<ProtectedRoute><SavedArticlesPage /></ProtectedRoute>} />
        <Route path="/library" element={<ProtectedRoute><LibraryPage /></ProtectedRoute>} />
        <Route path="/chat-with-pdf" element={<ProtectedRoute><ChatWithPdfPage /></ProtectedRoute>} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;