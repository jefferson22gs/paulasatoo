import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Settings,
    Image,
    Calendar,
    Clock,
    DollarSign,
    LogOut,
    Menu,
    X,
    ChevronRight,
    User,
    ImagePlus,
    Bell,
    Gift,
    FileText,
    MessageSquare,
    HelpCircle,
    Video,
    Palette,
    BarChart3
} from 'lucide-react';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/admin/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
        { name: 'Configurações', path: '/admin/settings', icon: Settings },
        { name: 'Conteúdo do Site', path: '/admin/site-content', icon: FileText },
        { name: 'Serviços & Preços', path: '/admin/services', icon: DollarSign },
        { name: 'Imagens do Site', path: '/admin/site-images', icon: ImagePlus },
        { name: 'Galeria', path: '/admin/gallery', icon: Image },
        { name: 'Depoimentos', path: '/admin/testimonials', icon: MessageSquare },
        { name: 'FAQ', path: '/admin/faq', icon: HelpCircle },
        { name: 'Vídeos', path: '/admin/videos', icon: Video },
        { name: 'Agendamentos', path: '/admin/appointments', icon: Calendar },
        { name: 'Horários', path: '/admin/schedules', icon: Clock },
        { name: 'SEO & Tema', path: '/admin/seo-theme', icon: Palette },
        { name: 'Relatórios', path: '/admin/reports', icon: BarChart3 },
        { name: 'Notificações', path: '/admin/notifications', icon: Bell },
        { name: 'Indicações', path: '/admin/referrals', icon: Gift },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 text-charcoal hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <h1 className="font-serif text-xl font-bold text-charcoal">
                    <span className="text-gold">PS</span> Admin
                </h1>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-50 
                   transform transition-transform duration-300 lg:translate-x-0
                   ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h1 className="font-serif text-2xl font-bold text-charcoal">
                                <span className="text-gold">PS</span> Admin
                            </h1>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden p-2 text-charcoal hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-xs text-charcoal/60 mt-1">Painel Administrativo</p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.end}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                        ? 'bg-sage text-white shadow-sm'
                                        : 'text-charcoal/70 hover:bg-gray-100 hover:text-charcoal'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.name}</span>
                                <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Info & Logout */}
                    <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl mb-3">
                            <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
                                <User className="w-5 h-5 text-sage" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-charcoal truncate">
                                    {user?.email || 'Admin'}
                                </p>
                                <p className="text-xs text-charcoal/60">Administrador</p>
                            </div>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 
                       text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                        >
                            <LogOut className="w-5 h-5" />
                            Sair
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-72 min-h-screen">
                <div className="p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
