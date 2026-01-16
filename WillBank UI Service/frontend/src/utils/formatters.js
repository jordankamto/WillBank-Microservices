export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString('fr-FR');
};

export const getStatusBadge = (status) => {
  const badges = {
    ACTIVE: { bg: 'bg-green-100', text: 'text-green-800', label: 'Actif' },
    PENDING_KYC: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'KYC En attente' },
    SUSPENDED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Suspendu' },
    FROZEN: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Gelé' },
    BLOCKED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Bloqué' },
    CLOSED: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Fermé' },
    SUCCESS: { bg: 'bg-green-100', text: 'text-green-800', label: 'Réussi' },
    FAILED: { bg: 'bg-red-100', text: 'text-red-800', label: 'Échoué' }
  };
  return badges[status] || badges.ACTIVE;
};