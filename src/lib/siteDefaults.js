// Padrões do site e valores antigos que ainda podem existir no Supabase e não devem voltar ao site.
// Qualquer texto novo salvo pelo Admin continua tendo prioridade normalmente.
// ponytail: lista fixa por chave; remover quando a migração atualizar-conteudo-2026-10.sql rodar em produção.

export const LEGACY_CONTENT = {
    hero_title: /transformando|em confian[çc]a/i,
    about_badge: /^sobre$/i,
    about_title: /^Dra\. Paula Satoo$/,
    about_paragraph_1: /^Farmacêutica Esteta apaixonada/,
    about_paragraph_2: /^Acredito que a estética vai além da aparência/,
};

export const LEGACY_SETTINGS = {
    address: /Almirante Tamandar/i,
    neighborhood: /^Cidade Nova II$/i,
    postal_code: /^13334-100$/,
};

// FAQ e depoimentos de exemplo criados pelos scripts SQL iniciais
const LEGACY_FAQ_QUESTION = /quanto tempo dur(a|am) o?s? ?resultados?/i;
const SAMPLE_TESTIMONIALS = new Set([
    'Experiência incrível! A Dra. Paula é extremamente profissional e cuidadosa. O resultado ficou natural e harmonioso.',
    'Adorei o atendimento personalizado. Ela realmente entende o que cada pessoa precisa.',
    'Resultados surpreendentes! Recomendo para todas as minhas amigas.',
]);

export const dropLegacy = (obj, rules) =>
    Object.fromEntries(Object.entries(obj).filter(([key, value]) => !rules[key]?.test(String(value ?? ''))));

export const isLegacyFaq = (faq) => LEGACY_FAQ_QUESTION.test(faq.question || '');

export const isSampleTestimonial = (t) => SAMPLE_TESTIMONIALS.has((t.content || '').trim());

// Valores padrão (usados quando o banco não tem a chave)
export const DEFAULT_CONTENT = {
    hero_badge: 'Estética Avançada',
    hero_title: 'Dra. Paula Satoo',
    hero_subtitle: 'Realce sua beleza natural com procedimentos estéticos personalizados e resultados que transformam',
    hero_cta_primary: 'Agendar Avaliação',
    hero_cta_secondary: 'Conhecer Tratamentos',
    about_badge: 'Dra. Paula Satoo',
    about_title: 'Sobre mim',
    about_paragraph_1: 'Acredito que a verdadeira estética vai muito além da superfície: ela é sobre resgatar a autoestima, cuidar da saúde da pele e respeitar a individualidade de cada rosto.',
    about_paragraph_2: 'Sou farmacêutica, graduada pela Universidade Presbiteriana Mackenzie, e encontrei na estética avançada a minha verdadeira vocação. Ao longo da minha trajetória, busquei unir o rigor científico da minha formação ao olhar artístico para os detalhes. Sou especialista com pós-graduação em Farmácia Estética pelo Instituto Icosmetologia, além de manter-me em constante atualização através de cursos e imersões nas técnicas mais modernas e seguras do mercado, com foco em rejuvenescimento natural, harmonização facial e tratamentos regenerativos.',
    about_experience_years: '8',
    about_experience_label: 'Anos de Experiência',
    about_procedures_count: '2000',
    about_procedures_label: 'Procedimentos',
    about_satisfaction_percent: '98',
    about_satisfaction_label: 'Satisfação',
    services_badge: 'TRATAMENTOS',
    services_title: 'Procedimentos Estéticos',
    services_subtitle: 'Conheça os tratamentos que vão realçar sua beleza natural',
    results_badge: 'RESULTADOS',
    results_title: 'Transformações Reais',
    results_subtitle: 'Veja os resultados dos nossos procedimentos',
    testimonials_badge: 'DEPOIMENTOS',
    testimonials_title: 'O Que Dizem Nossos Clientes',
    testimonials_subtitle: 'Experiências reais de transformação e satisfação',
    faq_badge: 'DÚVIDAS',
    faq_title: 'Perguntas Frequentes',
    faq_subtitle: 'Tire suas dúvidas sobre os procedimentos',
    footer_brand: 'Dra. Paula Satoo',
    footer_tagline: 'Estética Avançada',
    footer_description: 'Farmacêutica Esteta especializada em harmonização facial e procedimentos estéticos.',
    footer_copyright: 'Dra. Paula Satoo - Estética Avançada. Todos os direitos reservados.'
};

// Endereço completo num único campo, editável em Admin > Configurações
export const DEFAULT_ADDRESS = {
    address: 'Rua Homero Paulo Lourenço Barnabé, 105 – Pq. São Lourenço',
    neighborhood: '',
    city: 'Indaiatuba',
    state: 'SP',
};

// Formata endereço ignorando partes vazias. O Admin grava city como "Indaiatuba - SP",
// então não repete o estado quando ele já está na cidade.
export function formatAddress(s) {
    const city = s.city && s.state && !s.city.includes(s.state) ? `${s.city} - ${s.state}` : (s.city || s.state || '');
    const street = [s.address, s.neighborhood].filter(Boolean).join(' – ');
    return { street, city, full: [street, city].filter(Boolean).join(', ') };
}
