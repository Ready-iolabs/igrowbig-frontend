import { useState, useEffect } from 'react';
import useTenantApi from '../../hooks/useTenantApi';
import { useParams } from 'react-router-dom';

const DomainSetup = () => {
  const { tenantId } = useParams();
  const { getAll, put } = useTenantApi();
  const [formData, setFormData] = useState({
    domain_type: 'sub_domain',
    sub_domain: '',
    primary_domain_name: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    getAll(`/tenant/${tenantId}/settings`).then((response) =>
      setFormData({
        domain_type: response.settings.domain_type || 'sub_domain',
        sub_domain: response.settings.sub_domain || '',
        primary_domain_name: response.settings.primary_domain_name || '',
      })
    );
  }, [tenantId, getAll]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await put(`/tenant/${tenantId}/settings`, formData);
      setMessage('Domain settings updated. Verification in progress.');
    } catch (error) {
      setMessage('Failed to update settings.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Domain Setup</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Domain Type</label>
          <select
            value={formData.domain_type}
            onChange={(e) => setFormData({ ...formData, domain_type: e.target.value })}
            className="border p-2 w-full"
          >
            <option value="sub_domain">Subdomain</option>
            <option value="custom_domain">Custom Domain</option>
          </select>
        </div>
        {formData.domain_type === 'sub_domain' ? (
          <div>
            <label className="block">Subdomain</label>
            <input
              type="text"
              value={formData.sub_domain}
              onChange={(e) => setFormData({ ...formData, sub_domain: e.target.value })}
              placeholder="e.g., khushi"
              className="border p-2 w-full"
            />
            <p className="text-sm">Your store: {formData.sub_domain}.begrat.com</p>
          </div>
        ) : (
          <div>
            <label className="block">Custom Domain</label>
            <input
              type="text"
              value={formData.primary_domain_name}
              onChange={(e) => setFormData({ ...formData, primary_domain_name: e.target.value })}
              placeholder="e.g., khushistore.com"
              className="border p-2 w-full"
            />
            <p className="text-sm">
              Set an A record pointing to {process.env.REACT_APP_SERVER_IP || '139.59.3.58'}.
            </p>
          </div>
        )}
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Save Domain
        </button>
        {message && <p className="mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default DomainSetup;