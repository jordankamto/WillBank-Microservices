import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiEye } from 'react-icons/fi';
import { customerService } from '../../services/customerService';
import { getStatusBadge } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function CustomerSearch() {
  const [searchType, setSearchType] = useState('email'); // email, phone
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const params = {};
      if (searchType === 'email') params.email = searchValue;
      if (searchType === 'phone') params.phone = searchValue;

      const response = await customerService.search(params);
      
      // La recherche peut retourner un seul client ou une liste
      if (Array.isArray(response.data)) {
        setResults(response.data);
      } else if (response.data) {
        setResults([response.data]);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Erreur recherche:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Recherche Client</h1>

      <div className="card">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type de recherche</label>
              <select
                value={searchType}
                onChange={(e) => {
                  setSearchType(e.target.value);
                  setSearchValue('');
                  setResults([]);
                  setSearched(false);
                }}
                className="input-field"
              >
                <option value="email">Email</option>
                <option value="phone">Téléphone</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                {searchType === 'email' ? 'Adresse Email' : 'Numéro de Téléphone'}
              </label>
              <div className="flex gap-2">
                <input
                  type={searchType === 'email' ? 'email' : 'tel'}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="input-field"
                  placeholder={searchType === 'email' ? 'exemple@email.com' : '+237...'}
                  required
                />
                <button type="submit" className="btn-primary flex items-center gap-2 whitespace-nowrap">
                  <FiSearch /> Rechercher
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {loading && <LoadingSpinner />}

      {searched && !loading && (
        <div className="card">
          <h3 className="text-lg font-bold mb-4">
            Résultats de recherche ({results.length})
          </h3>

          {results.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aucun client trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="pb-3">Nom</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Téléphone</th>
                    <th className="pb-3">Statut</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((customer) => {
                    const statusBadge = getStatusBadge(customer.status);
                    return (
                      <tr key={customer.id} className="table-row border-b">
                        <td className="py-4">{customer.firstName} {customer.lastName}</td>
                        <td className="py-4">{customer.email}</td>
                        <td className="py-4">{customer.phone}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${statusBadge.bg} ${statusBadge.text}`}>
                            {statusBadge.label}
                          </span>
                        </td>
                        <td className="py-4">
                          <Link
                            to={`/customers/${customer.id}/dashboard`}
                            className="btn-primary inline-flex items-center gap-2"
                          >
                            <FiEye /> Voir Dashboard
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
