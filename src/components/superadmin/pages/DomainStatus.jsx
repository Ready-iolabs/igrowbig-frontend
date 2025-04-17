import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useTenantApi from '@/hooks/useTenantApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle } from 'lucide-react';
import ToastNotification, { showSuccessToast, showErrorToast } from '../../ToastNotification';

const DomainSetup = () => {
  const { tenantId } = useParams();
  const { getAll, put } = useTenantApi();
  const [formData, setFormData] = useState({
    domain_type: 'sub_domain',
    sub_domain: '',
    primary_domain_name: 'begrat.com',
    website_link: '',
    dns_status: 'pending',
  });
  const [validationErrors, setValidationErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch existing settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getAll(`/admin/settings/${tenantId}`);
        const settings = response.settings || {};
        setFormData({
          domain_type: settings.domain_type || 'sub_domain',
          sub_domain: settings.sub_domain || '',
          primary_domain_name: settings.primary_domain_name || 'begrat.com',
          website_link: settings.website_link || '',
          dns_status: settings.dns_status || 'pending',
        });
        showSuccessToast(response.message || 'Settings fetched successfully');
      } catch (error) {
        showErrorToast(error.message || 'Failed to fetch settings');
      }
    };
    fetchSettings();
  }, [tenantId, getAll]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const response = await put(`/admin/settings/${tenantId}`, formData);
      setFormData((prev) => ({
        ...prev,
        ...response.settings,
        website_link: response.settings.website_link || prev.website_link,
        dns_status: response.settings.dns_status || prev.dns_status,
      }));
      showSuccessToast(response.message || 'Domain settings updated successfully');
      setValidationErrors([]);
    } catch (error) {
      setValidationErrors([{ msg: error.message || 'Failed to update settings' }]);
      showErrorToast(error.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      updated.website_link =
        updated.domain_type === 'sub_domain' && updated.sub_domain
          ? `https://${updated.sub_domain}.begrat.com`
          : updated.domain_type === 'custom_domain' && updated.primary_domain_name
          ? `https://${updated.primary_domain_name}`
          : '';
      return updated;
    });
    setValidationErrors([]);
  };

  // Handle select changes (for domain_type)
  const handleSelectChange = (value) => {
    setFormData((prev) => {
      const updated = { ...prev, domain_type: value };
      updated.website_link =
        updated.domain_type === 'sub_domain' && updated.sub_domain
          ? `https://${updated.sub_domain}.begrat.com`
          : updated.domain_type === 'custom_domain' && updated.primary_domain_name
          ? `https://${updated.primary_domain_name}`
          : '';
      return updated;
    });
    setValidationErrors([]);
  };

  // Validate form inputs
  const validateForm = () => {
    const errors = [];
    if (formData.domain_type === 'sub_domain' && !formData.sub_domain) {
      errors.push({ msg: 'Subdomain is required for subdomain type' });
    }
    if (
      formData.domain_type === 'sub_domain' &&
      formData.sub_domain &&
      !/^[a-zA-Z0-9-]+$/.test(formData.sub_domain)
    ) {
      errors.push({ msg: 'Subdomain can only contain letters, numbers, and hyphens' });
    }
    if (
      formData.domain_type === 'custom_domain' &&
      !formData.primary_domain_name.match(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ) {
      errors.push({ msg: 'Invalid custom domain name' });
    }
    return errors;
  };

  // Render validation errors
  const renderValidationErrors = () =>
    validationErrors.length > 0 && (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Validation Errors</AlertTitle>
        <AlertDescription>
          <ul className="list-disc pl-4">
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err.msg}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-900">Domain Setup</CardTitle>
          <p className="text-sm text-gray-600">Configure your store’s domain settings below.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderValidationErrors()}
            <div>
              <Label htmlFor="domain_type">Domain Type <span className="text-red-500">*</span></Label>
              <Select value={formData.domain_type} onValueChange={handleSelectChange} disabled={loading}>
                <SelectTrigger id="domain_type">
                  <SelectValue placeholder="Select domain type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sub_domain">Subdomain (e.g., khushi.begrat.com)</SelectItem>
                  <SelectItem value="custom_domain">Custom Domain (e.g., khushistore.com)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.domain_type === 'sub_domain' ? (
              <div>
                <Label htmlFor="sub_domain">Subdomain <span className="text-red-500">*</span></Label>
                <Input
                  id="sub_domain"
                  name="sub_domain"
                  value={formData.sub_domain}
                  onChange={handleChange}
                  placeholder="e.g., khushi"
                  disabled={loading}
                  className="w-full"
                />
                {formData.sub_domain && (
                  <p className="text-sm text-gray-500 mt-1">
                    Your store will be accessible at{' '}
                    <a
                      href={`https://${formData.sub_domain}.begrat.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {formData.sub_domain}.begrat.com
                    </a>
                  </p>
                )}
              </div>
            ) : (
              <div>
                <Label htmlFor="primary_domain_name">
                  Custom Domain <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="primary_domain_name"
                  name="primary_domain_name"
                  value={formData.primary_domain_name}
                  onChange={handleChange}
                  placeholder="e.g., khushistore.com"
                  disabled={loading}
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Ensure your DNS A record points to{' '}
                  <strong>{process.env.REACT_APP_SERVER_IP || '139.59.3.58'}</strong>.
                </p>
                {formData.dns_status !== 'verified' && formData.domain_type === 'custom_domain' && (
                  <Alert variant="warning" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>DNS Setup Required</AlertTitle>
                    <AlertDescription>
                      Add an A record for {formData.primary_domain_name} pointing to{' '}
                      {process.env.REACT_APP_SERVER_IP || '139.59.3.58'} in your DNS provider’s settings.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
            <div>
              <Label htmlFor="website_link">Website Link</Label>
              <Input
                id="website_link"
                name="website_link"
                value={formData.website_link}
                disabled
                className="w-full bg-gray-100"
              />
            </div>
            <div>
              <Label>DNS Status</Label>
              <p className="text-sm font-medium">
                <span
                  className={
                    {
                      pending: 'text-yellow-600',
                      verified: 'text-green-600',
                      unverified: 'text-red-600',
                      error: 'text-red-600',
                    }[formData.dns_status] || 'text-gray-600'
                  }
                >
                  {formData.dns_status === 'verified'
                    ? '✅ Verified'
                    : formData.dns_status === 'unverified'
                    ? '❌ Unverified'
                    : formData.dns_status === 'error'
                    ? '⚠️ Error'
                    : '⏳ Pending'}
                </span>
              </p>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white w-32"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <ToastNotification />
    </div>
  );
};

export default DomainSetup;