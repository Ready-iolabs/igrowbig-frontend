import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useTenantApi from '@/hooks/useTenantApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { showErrorToast } from '../../ToastNotification';

const TenantStatusPage = () => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const { getAll } = useTenantApi();
  const [settings, setSettings] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Validate tenantId
    const normalizedTenantId = parseInt(tenantId, 10);
    if (isNaN(normalizedTenantId) || normalizedTenantId <= 0) {
      setError('Invalid tenant ID. Please select a valid tenant.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const settingsResponse = await getAll(`/admin/settings/${tenantId}`);
        if (!settingsResponse.settings) {
          throw new Error('No settings found for this tenant');
        }
        setSettings(settingsResponse.settings);

        const logsResponse = await getAll(`/admin/tenant/${tenantId}/domain-logs`);
        setLogs(logsResponse.logs || []);
      } catch (err) {
        setError(err.message || 'Failed to load tenant status');
        showErrorToast(err.message || 'Failed to load tenant status');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tenantId, getAll]);

  if (loading) {
    return (
      <div className="flex justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
            <button
              className="mt-4 text-blue-600 underline"
              onClick={() => navigate('/backoffice/tenants')}
            >
              Select a Tenant
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Domain Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <strong>Domain:</strong>{' '}
              {settings.domain_type === 'custom_domain'
                ? settings.primary_domain_name
                : settings.sub_domain
                ? `${settings.sub_domain}.begrat.com`
                : 'Not configured'}
            </div>
            <div>
              <strong>Status:</strong>{' '}
              <Badge
                className={
                  settings.dns_status === 'verified'
                    ? 'bg-green-100 text-green-800'
                    : settings.dns_status === 'unverified'
                    ? 'bg-red-100 text-red-800'
                    : settings.dns_status === 'error'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }
              >
                {settings.dns_status === 'verified'
                  ? '✅ Active'
                  : settings.dns_status === 'unverified'
                  ? '❌ Unverified'
                  : settings.dns_status === 'error'
                  ? '⚠️ Error'
                  : '⏳ Pending'}
              </Badge>
            </div>
            {settings.dns_status !== 'verified' && settings.domain_type === 'custom_domain' && (
              <p className="text-sm text-gray-600">
                Ensure your DNS A record points to{' '}
                {process.env.REACT_APP_SERVER_IP || '139.59.3.58'}.
              </p>
            )}
          </div>
          {logs.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Domain Logs</h3>
              <ul className="mt-2 space-y-2">
                {logs.map((log) => (
                  <li key={log.id} className="text-sm">
                    [{new Date(log.created_at).toLocaleString()}] {log.status}: {log.message}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-6 text-sm text-gray-500">No domain logs available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantStatusPage;