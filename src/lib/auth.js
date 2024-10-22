const SECRET_KEY = process.env.JWT_SECRET;

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

export function generateToken(user) {
  const payload = `${user._id}:${user.email}:${user.role}`;
  const hash = simpleHash(payload + SECRET_KEY);
  return `${payload}:${hash}`;
}

export function verifyToken(token) {
  const [id, email, role, hash] = token.split(':');
  const payload = `${id}:${email}:${role}`;
  const computedHash = simpleHash(payload + SECRET_KEY);
  
  if (hash === computedHash) {
    return { id, email, role };
  }
  return null;
}
