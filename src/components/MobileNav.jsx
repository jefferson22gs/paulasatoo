import { Home, Sparkles, Calendar, MessageCircle } from 'lucide-react';

const MobileNav = () => {
    const navItems = [
        { icon: Home, label: 'Início', href: '#inicio' },
        { icon: Sparkles, label: 'Serviços', href: '#tratamentos' },
        { icon: Calendar, label: 'Agendar', href: '#agendamento' },
        {
            icon: MessageCircle,
            label: 'WhatsApp',
            href: 'https://wa.me/5519990037678',
            external: true,
            highlight: true
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/90 dark:bg-charcoal/90 
                   backdrop-blur-lg border-t border-sage/10 dark:border-white/10 safe-area-bottom">
            <div className="flex items-center justify-around py-2">
                {navItems.map((item, index) => (
                    <a
                        key={index}
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all
                      ${item.highlight
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-charcoal/60 dark:text-white/60 hover:text-gold active:scale-95'
                            }`}
                    >
                        <div className={`p-2 rounded-xl transition-colors ${item.highlight
                                ? 'bg-green-100 dark:bg-green-900/30'
                                : 'hover:bg-sage/10 dark:hover:bg-white/5'
                            }`}>
                            <item.icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium">{item.label}</span>
                    </a>
                ))}
            </div>
        </nav>
    );
};

export default MobileNav;
