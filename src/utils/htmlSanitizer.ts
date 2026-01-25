// Simple HTML sanitizer to prevent XSS attacks
// This is a basic implementation - in production, use a proper library like DOMPurify

const allowedTags = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'a', 'img', 'div', 'span', 'pre', 'code', 'blockquote',
  'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr'
];

const allowedAttributes = [
  'href', 'src', 'alt', 'title', 'class', 'id', 'style', 'width', 'height', 'target'
];

const sanitizeHTML = (dirtyHTML: string): string => {
  // Basic sanitization to prevent XSS
  // This is a simplified version - in production, use a proper library like DOMPurify
  
  if (!dirtyHTML || typeof dirtyHTML !== 'string') {
    return '';
  }

  // Remove script tags and their content
  let cleanHTML = dirtyHTML.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handlers
  cleanHTML = cleanHTML.replace(/on\w+="[^"]*"/gi, '');
  cleanHTML = cleanHTML.replace(/on\w+='[^']*'/gi, '');
  cleanHTML = cleanHTML.replace(/javascript:/gi, '');
  
  // Remove iframe tags
  cleanHTML = cleanHTML.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  
  // Remove form tags
  cleanHTML = cleanHTML.replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '');
  
  return cleanHTML;
};

export default sanitizeHTML;