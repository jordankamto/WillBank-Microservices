export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, type = 'danger' }) {
  if (!isOpen) return null;
  
  const colors = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    primary: 'bg-primary-600 hover:bg-primary-700'
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary">
            Annuler
          </button>
          <button onClick={onConfirm} className={`px-4 py-2 text-white rounded-lg transition-colors ${colors[type]}`}>
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}
