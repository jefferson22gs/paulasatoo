import { MapPin, Phone, Mail, Clock, Instagram, MessageCircle } from 'lucide-react';
import { useSiteSettings } from '../lib/siteSettings.jsx';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const { settings } = useSiteSettings();

    const quickLinks = [
        { name: 'Início', href: '#inicio' },
        { name: 'Sobre', href: '#sobre' },
        { name: 'Tratamentos', href: '#tratamentos' },
        { name: 'Resultados', href: '#resultados' },
        { name: 'Agendar', href: '#agendamento' },
    ];

    const services = [
        'Harmonização Facial',
        'Preenchimento Labial',
        'Bioestimuladores',
        'Toxina Botulínica',
        'Skinbooster',
        'Microagulhamento',
    ];

    return (
        <footer id="contato" className="bg-sage-600 text-white">
            {/* Main Footer */}
            <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-20">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <div className="mb-6">
                            <span className="font-serif text-3xl font-semibold text-gold">PS</span>
                            <p className="text-xl font-serif mt-2">{settings.business_name || 'Dra. Paula Satoo'}</p>
                            <p className="text-white/60 text-sm tracking-widest uppercase">
                                {settings.tagline || 'Estética Avançada'}
                            </p>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed mb-6">
                            Farmacêutica Esteta especializada em harmonização facial e
                            procedimentos estéticos que realçam sua beleza natural.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            <a
                                href={`https://instagram.com/${(settings.instagram || '@dra.paulasatoo').replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center 
                         hover:bg-gold transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href={`https://wa.me/${settings.whatsapp || '5519990037678'}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center 
                         hover:bg-gold transition-colors"
                                aria-label="WhatsApp"
                            >
                                <MessageCircle className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-serif text-lg font-semibold mb-6 text-gold">
                            Links Rápidos
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-white/70 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-serif text-lg font-semibold mb-6 text-gold">
                            Tratamentos
                        </h3>
                        <ul className="space-y-3">
                            {services.map((service) => (
                                <li key={service}>
                                    <a
                                        href="#tratamentos"
                                        className="text-white/70 hover:text-white transition-colors"
                                    >
                                        {service}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-serif text-lg font-semibold mb-6 text-gold">
                            Contato
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                                <span className="text-white/70 text-sm">
                                    {settings.address || 'Rua Almirante Tamandaré, 54'}<br />
                                    {settings.neighborhood || 'Cidade Nova II'}, {settings.city || 'Indaiatuba'} - {settings.state || 'SP'}
                                </span>
                            </li>
                            <li>
                                <a
                                    href={`https://wa.me/${settings.whatsapp || '5519990037678'}`}
                                    className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
                                >
                                    <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                                    <span className="text-sm">{settings.phone || '(19) 99003-7678'}</span>
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                                <span className="text-white/70 text-sm">
                                    {settings.hours_weekdays || 'Seg - Sex: 9h às 20h'}<br />
                                    {settings.hours_saturday || 'Sábado: 9h às 14h'}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Google Maps */}
                <div className="mt-12 rounded-2xl overflow-hidden shadow-lg">
                    <iframe
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                            `${settings.address || 'Rua Almirante Tamandaré, 54'}, ${settings.neighborhood || 'Cidade Nova II'}, ${settings.city || 'Indaiatuba'} - ${settings.state || 'SP'}, Brasil`
                        )}`}
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Localização ${settings.business_name || 'Dra. Paula Satoo'}`}
                        className="grayscale hover:grayscale-0 transition-all duration-500"
                    />
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="container mx-auto px-4 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
                        <p>
                            © {currentYear} Dra. Paula Satoo - Estética Avançada. Todos os direitos reservados.
                        </p>
                        <p>
                            Desenvolvido com <span className="text-gold">♥</span> para realçar sua beleza natural.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
