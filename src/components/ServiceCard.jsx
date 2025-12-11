import { motion } from 'framer-motion';

const ServiceCard = ({ service, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-soft 
                 hover:shadow-card transition-all duration-500"
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 
                   group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />

                {/* Icon */}
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm 
                      rounded-xl flex items-center justify-center shadow-soft">
                    <service.icon className="w-6 h-6 text-gold" />
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="font-serif text-xl font-semibold text-charcoal mb-2 
                     group-hover:text-gold transition-colors">
                    {service.title}
                </h3>
                <p className="text-charcoal/70 text-sm leading-relaxed mb-4">
                    {service.description}
                </p>

                {/* Tags */}
                {service.tags && (
                    <div className="flex flex-wrap gap-2">
                        {service.tags.map((tag, i) => (
                            <span
                                key={i}
                                className="text-xs px-3 py-1 bg-sage/10 text-sage-500 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Hover Border Effect */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/30 
                    rounded-2xl transition-colors duration-300 pointer-events-none" />
        </motion.div>
    );
};

export default ServiceCard;
