// Aceita links de post/reel do Instagram e devolve a URL de incorporação oficial
export const getInstagramEmbedUrl = (url = '') => {
    const match = url.match(/instagram\.com\/(?:[\w.]+\/)?(reel|reels|p|tv)\/([\w-]+)/i);
    if (!match) return null;
    const type = match[1].toLowerCase() === 'p' ? 'p' : 'reel';
    return `https://www.instagram.com/${type}/${match[2]}/embed`;
};
