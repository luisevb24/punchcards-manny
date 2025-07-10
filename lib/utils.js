// lib/utils.js

// Generar slug único para usuarios (6 caracteres alfanuméricos)
export function generateUserSlug() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let slug = '';
  for (let i = 0; i < 6; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
}

// Formatear fecha en español
export function formatDate(date) {
  return new Date(date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Validar si un usuario puede canjear una recompensa
export function canRedeemReward(userPunches, requiredPunches) {
  return userPunches >= requiredPunches;
}