import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import InstallPWA from './components/InstallPWA';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import TestimonialsSection from './components/TestimonialsSection';
import SchedulingSection from './components/SchedulingSection';
import VideoSection from './components/VideoSection';
import InstagramSection from './components/InstagramSection';
import FAQSection from './components/FAQSection';
import CertificationsSection from './components/CertificationsSection';
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
import TestimonialsPage from './pages/admin/TestimonialsPage';
import FAQPage from './pages/admin/FAQPage';
import SEOThemePage from './pages/admin/SEOThemePage';
import ReportsPage from './pages/admin/ReportsPage';
import VideosPage from './pages/admin/VideosPage';

// Public components for new features
import PushNotificationPrompt from './components/PushNotificationPrompt';

// Site Images Provider
import { SiteImagesProvider } from './lib/siteImages.jsx';

// Site Settings Provider
import { SiteSettingsProvider } from './lib/siteSettings.jsx';

// Site Content Provider
import { SiteContentProvider } from './lib/siteContent.jsx';

// Dynamic Data Provider
import { DynamicDataProvider } from './lib/dynamicData.jsx';
import { hasBackend } from './lib/supabase';

import './App.css';

// Public site component
const PublicSite = () => (
  <SiteSettingsProvider>
    <SiteContentProvider>
      <DynamicDataProvider>
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

                {/* Services Grid */}
                <ServicesSection />

                {/* Testimonials Carousel */}
                <TestimonialsSection />

                {/* Scheduling Form */}
                <SchedulingSection />

                {/* Video Content */}
                <VideoSection />

                {/* Galeria com 4 resultados */}
                <InstagramSection />

                {/* FAQ Accordion */}
                <FAQSection />

                {/* Certifications & Brands */}
                <CertificationsSection />
              </main>

              {/* Footer */}
              <Footer />

              {/* Floating Elements */}
              <WhatsAppButton />
              <ChatBot />
              <InstallPWA />
              {hasBackend && <PushNotificationPrompt />}
              <MobileNav />
            </div>
          </ThemeProvider>
        </SiteImagesProvider>
      </DynamicDataProvider>
    </SiteContentProvider>
  </SiteSettingsProvider>
);

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Site */}
        <Route path="/" element={<PublicSite />} />

        {/* Admin Routes (somente com backend ligado) */}
        {hasBackend && <Route path="/admin/login" element={<LoginPage />} />}
        {hasBackend && <Route
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
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="videos" element={<VideosPage />} />
          <Route path="seo-theme" element={<SEOThemePage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="referrals" element={<ReferralPage />} />
        </Route>}

        {/* Rotas desconhecidas (inclui /admin sem backend) voltam para o site */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
