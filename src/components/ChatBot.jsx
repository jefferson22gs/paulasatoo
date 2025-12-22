import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { useSiteSettings } from '../lib/siteSettings.jsx';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { settings } = useSiteSettings();

    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: `Olá! 👋 Sou a assistente virtual da ${settings.business_name || 'Dra. Paula Satoo'}. Como posso ajudar você hoje?`,
        },
    ]);
    const [inputValue, setInputValue] = useState('');

    // Construir endereço completo
    const fullAddress = `${settings.address || 'Rua Almirante Tamandaré, 54'} - ${settings.neighborhood || 'Cidade Nova II'}, ${settings.city || 'Indaiatuba'} - ${settings.state || 'SP'}`;

    const quickReplies = [
        { text: 'Quero agendar', response: 'Ótimo! Para agendar sua avaliação, você pode clicar no botão abaixo para falar diretamente pelo WhatsApp com nossa equipe. Elas vão encontrar o melhor horário para você! 📅' },
        { text: 'Preços', response: 'Os valores variam de acordo com cada procedimento e são personalizados após a avaliação. Agende uma consulta sem compromisso para receber um orçamento personalizado! 💫' },
        { text: 'Procedimentos', response: 'Oferecemos diversos tratamentos: Harmonização Facial, Preenchimento Labial, Bioestimuladores, Toxina Botulínica, Skinbooster, Microagulhamento e mais! Qual te interessa? ✨' },
        { text: 'Localização', response: `Estamos na ${fullAddress}. Fácil acesso e estacionamento próximo! 📍` },
    ];

    const handleQuickReply = (reply) => {
        const userMessage = { id: Date.now(), type: 'user', text: reply.text };
        const botMessage = { id: Date.now() + 1, type: 'bot', text: reply.response };

        setMessages(prev => [...prev, userMessage]);

        setTimeout(() => {
            setMessages(prev => [...prev, botMessage]);
        }, 500);
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMessage = { id: Date.now(), type: 'user', text: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        setTimeout(() => {
            const botResponse = {
                id: Date.now() + 1,
                type: 'bot',
                text: 'Obrigada pela sua mensagem! Para um atendimento mais personalizado, recomendo falar diretamente com nossa equipe pelo WhatsApp. Elas vão adorar te ajudar! 💕',
            };
            setMessages(prev => [...prev, botResponse]);
        }, 800);
    };

    return (
        <>
            {/* Chat Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.5, type: 'spring' }}
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-20 lg:bottom-24 right-6 z-30 w-14 h-14 rounded-full 
                   bg-sage text-white shadow-lg flex items-center justify-center
                   hover:bg-sage-500 transition-colors ${isOpen ? 'hidden' : ''}`}
                aria-label="Abrir chat"
            >
                <Bot className="w-6 h-6" />
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-50 w-[calc(100%-2rem)] 
                     sm:w-96 bg-white dark:bg-charcoal rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-sage p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Assistente Virtual</h3>
                                    <p className="text-white/70 text-xs">Online agora</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                aria-label="Fechar chat"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="h-80 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-2 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                                ${message.type === 'user' ? 'bg-gold' : 'bg-sage/20'}`}>
                                        {message.type === 'user'
                                            ? <User className="w-4 h-4 text-white" />
                                            : <Bot className="w-4 h-4 text-sage" />
                                        }
                                    </div>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm
                                ${message.type === 'user'
                                            ? 'bg-gold text-white rounded-br-md'
                                            : 'bg-sage/10 dark:bg-white/10 text-charcoal dark:text-white rounded-bl-md'
                                        }`}>
                                        {message.text}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Quick Replies */}
                        <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
                            {quickReplies.map((reply, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuickReply(reply)}
                                    className="px-3 py-1.5 bg-sage/10 dark:bg-white/10 rounded-full text-xs 
                           text-charcoal dark:text-white whitespace-nowrap hover:bg-sage/20 
                           transition-colors flex-shrink-0"
                                >
                                    {reply.text}
                                </button>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-sage/10 dark:border-white/10">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Digite sua mensagem..."
                                    className="flex-1 px-4 py-2 rounded-full bg-sage/10 dark:bg-white/10 
                           text-charcoal dark:text-white placeholder:text-charcoal/40 
                           dark:placeholder:text-white/40 outline-none text-sm"
                                />
                                <button
                                    onClick={handleSend}
                                    className="w-10 h-10 rounded-full bg-gold text-white flex items-center 
                           justify-center hover:bg-gold-500 transition-colors"
                                    aria-label="Enviar mensagem"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>

                            {/* WhatsApp CTA */}
                            <a
                                href={`https://wa.me/${settings.whatsapp || '5519990037678'}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 w-full py-2 bg-green-500 text-white text-sm font-medium 
                         rounded-full flex items-center justify-center gap-2 hover:bg-green-600 
                         transition-colors"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Falar pelo WhatsApp
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatBot;
