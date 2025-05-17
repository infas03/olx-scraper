export function hashString(str) {
  let hash = 0;
  
  if (str.length === 0) return hash.toString();
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = Math.abs(hash);
  }
  
  const urlPart = str.split('/').filter(Boolean).pop() || '';
  return `${hash}${urlPart}`.replace(/\D+/g, '').slice(0, 12);
}