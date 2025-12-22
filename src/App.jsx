import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import InstallPWA from './components/InstallPWA';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import StatsSection from './components/StatsSection';
import ServicesSection from './components/ServicesSection';
import BeforeAfterSection from './components/BeforeAfterSection';
import TestimonialsSection from './components/TestimonialsSection';
import ProcedureCalculator from './components/ProcedureCalculator';
import SchedulingSection from './components/SchedulingSection';
import VideoSection from './components/VideoSection';
import InstagramSection from './components/InstagramSection';
import BlogSection from './components/BlogSection';
import FAQSection from './components/FAQSection';
import CertificationsSection from './components/CertificationsSection';
import NewsletterSection from './components/NewsletterSection';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import MobileNav from './components/MobileNav';
import CustomCursor from './components/CustomCursor';
import ThemeToggle from './components/ThemeToggle';
import ChatBot from './components/ChatBot';

// Admin components
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import SettingsPage from './pages/admin/SettingsPage';
import ServicesPage from './pages/admin/ServicesPage';
import AppointmentsPage from './pages/admin/AppointmentsPage';
import GalleryPage from './pages/admin/GalleryPage';
import SchedulesPage from './pages/admin/SchedulesPage';
import SiteImagesPage from './pages/admin/SiteImagesPage';
import NotificationsPage from './pages/admin/NotificationsPage';
import ReferralPage from './pages/admin/ReferralPage';
import SiteContentPage from './pages/admin/SiteContentPage';

// Public components for new features
import ReferralSection from './components/ReferralSection';
import PushNotificationPrompt from './components/PushNotificationPrompt';

// Site Images Provider
import { SiteImagesProvider } from './lib/siteImages.jsx';

// Site Settings Provider
import { SiteSettingsProvider } from './lib/siteSettings.jsx';

// Site Content Provider
import { SiteContentProvider } from './lib/siteContent.jsx';

import './App.css';

// Public site component
const PublicSite = () => (
  <SiteSettingsProvider>
    <SiteContentProvider>
      <SiteImagesProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-cream dark:bg-charcoal transition-colors duration-300">
            {/* Custom Cursor removido - usando cursor padrão do sistema */}

            {/* Header */}
            <Header />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Main Content */}
            <main className="pb-16 lg:pb-0">
              {/* Hero with Parallax */}
              <HeroSection />

              {/* About Section */}
              <AboutSection />

              {/* Stats with Animated Counters */}
              <StatsSection />

              {/* Services Grid */}
              <ServicesSection />

              {/* Before/After Comparison */}
              <BeforeAfterSection />

              {/* Testimonials Carousel */}
              <TestimonialsSection />

              {/* Procedure Calculator */}
              <ProcedureCalculator />

              {/* Scheduling Form */}
              <SchedulingSection />

              {/* Video Content */}
              <VideoSection />

              {/* Instagram Feed */}
              <InstagramSection />

              {/* Blog Preview */}
              <BlogSection />

              {/* FAQ Accordion */}
              <FAQSection />

              {/* Referral Program - Indique e Ganhe */}
              <ReferralSection />

              {/* Certifications & Brands */}
              <CertificationsSection />

              {/* Newsletter Signup */}
              <NewsletterSection />
            </main>

            {/* Footer */}
            <Footer />

            {/* Floating Elements */}
            <WhatsAppButton />
            <ChatBot />
            <InstallPWA />
            <PushNotificationPrompt />
            <MobileNav />
          </div>
        </ThemeProvider>
      </SiteImagesProvider>
    </SiteContentProvider>
  </SiteSettingsProvider>
);

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Site */}
        <Route path="/" element={<PublicSite />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="schedules" element={<SchedulesPage />} />
          <Route path="site-images" element={<SiteImagesPage />} />
          <Route path="site-content" element={<SiteContentPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="referrals" element={<ReferralPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
