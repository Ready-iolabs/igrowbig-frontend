import React, { useState, useEffect, useCallback } from 'react';
import useTenantApi from '@/hooks/useTenantApi';
import ToastNotification, { showSuccessToast, showErrorToast } from '../../ToastNotification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, ArrowLeft, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const Agents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [entries, setEntries] = useState(10);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [websiteStep, setWebsiteStep] = useState(0);
  const [tenantUsers, setTenantUsers] = useState([]);
  const [settings, setSettings] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const { loading, error, getAll, put } = useTenantApi();

  const [websiteData, setWebsiteData] = useState({
    domain_type: 'sub_domain',
    primary_domain_name: 'begrat.com',
    sub_domain: '',
    website_link: '',
    first_name: '',
    last_name: '',
    email_id: '',
    mobile: '',
    address: '',
    skype: '',
    site_name: '',
    site_logo: null,
    nht_website_link: '',
    nht_store_link: '',
    nht_joining_link: '',
    dns_status: 'pending',
  });

  const fetchTenantUsers = useCallback(async () => {
    try {
      const response = await getAll('/admin/tenant-users');
      if (response?.users?.length) {
        const mappedUsers = response.users.map((user) => ({
          id: user.id,
          first_name: user.name.split(' ')[0] || user.name,
          last_name: user.name.split(' ')[1] || '',
          email_id: user.email,
          website_link: user.website_link || '',
          subscription_status: user.status,
          tenant_id: user.tenant_id,
          plan: user.plan || 'none',
        }));
        setTenantUsers(mappedUsers);
        showSuccessToast(response.message || 'Tenant users fetched successfully');
      } else {
        setTenantUsers([]);
        showSuccessToast('No tenant users found');
      }
    } catch (err) {
      showErrorToast(err.message || 'Failed to fetch tenant users');
      setTenantUsers([]);
    }
  }, [getAll]);

  useEffect(() => {
    fetchTenantUsers();
  }, [fetchTenantUsers]);

  const filteredAgents = tenantUsers.filter(
    (agent) =>
      `${agent.first_name} ${agent.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email_id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const displayedAgents = filteredAgents.slice(0, entries);

  const openProfile = useCallback(
    async (agent) => {
      setSelectedAgent(agent);
      setShowProfile(true);
      setValidationErrors([]);
      setWebsiteStep(0);

      try {
        const response = await getAll(`/admin/settings/${agent.tenant_id}`);
        const settingsData = response.settings || {};
        setSettings(settingsData);
        setWebsiteData({
          domain_type: settingsData.domain_type || 'sub_domain',
          primary_domain_name: settingsData.primary_domain_name || 'begrat.com',
          sub_domain: settingsData.sub_domain || '',
          website_link: settingsData.website_link || '',
          first_name: settingsData.first_name || agent.first_name || '',
          last_name: settingsData.last_name || agent.last_name || '',
          email_id: settingsData.email_id || agent.email_id || '',
          mobile: settingsData.mobile || '',
          address: settingsData.address || '',
          skype: settingsData.skype || '',
          site_name: settingsData.site_name || '',
          site_logo: null,
          nht_website_link: settingsData.nht_website_link || '',
          nht_store_link: settingsData.nht_store_link || '',
          nht_joining_link: settingsData.nht_joining_link || '',
          dns_status: settingsData.dns_status || 'pending',
        });
        showSuccessToast(response.message || 'Settings fetched successfully');
      } catch (err) {
        showErrorToast(err.message || 'Failed to fetch tenant settings');
        setSettings({});
      }
    },
    [getAll]
  );

  const updateWebsiteDetails = async () => {
    const errors = validateStep();
    if (errors.length) {
      setValidationErrors(errors);
      return;
    }

    const formData = new FormData();
    Object.entries(websiteData).forEach(([key, value]) => {
      if (key === 'site_logo' && value) formData.append(key, value);
      else if (value && key !== 'website_link' && key !== 'dns_status') formData.append(key, value);
    });

    try {
      const response = await put(`/admin/settings/${selectedAgent.tenant_id}`, formData, true);
      setSettings(response.settings);
      showSuccessToast(response.message || 'Settings updated successfully');
      closeProfile();
    } catch (err) {
      setValidationErrors(err.errors || [{ msg: err.message || 'Failed to update settings' }]);
      showErrorToast(err.message || 'Failed to update tenant settings');
    }
  };

  const closeProfile = () => {
    setShowProfile(false);
    setSelectedAgent(null);
    setWebsiteStep(0);
    setSettings(null);
    setValidationErrors([]);
  };

  const handleWebsiteDataChange = (e) => {
    const { name, value, files } = e.target;
    setWebsiteData((prev) => {
      const updated = { ...prev, [name]: files ? files[0] : value };
      if (['domain_type', 'sub_domain', 'primary_domain_name'].includes(name)) {
        updated.website_link =
          updated.domain_type === 'sub_domain' && updated.sub_domain
            ? `https://${updated.sub_domain}.begrat.com`
            : `https://${updated.primary_domain_name || 'begrat.com'}`;
      }
      return updated;
    });
    setValidationErrors([]);
  };

  const toggleUserStatus = async (agent) => {
    const newStatus = agent.subscription_status === 'active' ? 'inactive' : 'active';
    try {
      const response = await put('/admin/user-status', {
        user_id: agent.id,
        subscription_status: newStatus,
      });
      showSuccessToast(response.message || 'User status updated successfully');
      setTenantUsers((prev) =>
        prev.map((user) =>
          user.id === agent.id ? { ...user, subscription_status: newStatus } : user
        )
      );
      if (selectedAgent?.id === agent.id) {
        setSelectedAgent((prev) => ({ ...prev, subscription_status: newStatus }));
      }
    } catch (err) {
      showErrorToast(err.message || 'Failed to update user status');
    }
  };

  const steps = ['Domain Details', 'Agent Information', 'Site Identity', 'Distributor Links', 'Review & Update'];

  const nextStep = () => {
    const errors = validateStep();
    if (!errors.length) setWebsiteStep((prev) => Math.min(prev + 1, steps.length - 1));
    else setValidationErrors(errors);
  };

  const prevStep = () => setWebsiteStep((prev) => Math.max(prev - 1, 0));

  const validateStep = () => {
    const errors = [];
    if (websiteStep === 0) {
      if (websiteData.domain_type === 'sub_domain' && !websiteData.sub_domain) {
        errors.push({ msg: 'Sub-domain is required for sub-domain type' });
      }
      if (websiteData.domain_type === 'custom_domain' && !websiteData.primary_domain_name.match(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        errors.push({ msg: 'Invalid primary domain name' });
      }
    }
    if (websiteStep === 1) {
      if (websiteData.email_id && !/\S+@\S+\.\S+/.test(websiteData.email_id)) {
        errors.push({ msg: 'Please provide a valid email address' });
      }
      if (!websiteData.first_name) {
        errors.push({ msg: 'First name is required' });
      }
    }
    if (websiteStep === 2) {
      if (websiteData.site_logo && websiteData.site_logo.size > 4 * 1024 * 1024) {
        errors.push({ msg: 'Site logo must be less than 4MB' });
      }
      if (!websiteData.site_name) {
        errors.push({ msg: 'Site name is required' });
      }
    }
    return errors;
  };

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

  const renderWebsiteStep = () => {
    switch (websiteStep) {
      case 0:
        return (
          <div className="space-y-6">
            {renderValidationErrors()}
            <div>
              <Label htmlFor="domain_type">Domain Type</Label>
              <Select
                value={websiteData.domain_type}
                onValueChange={(value) => handleWebsiteDataChange({ target: { name: 'domain_type', value } })}
              >
                <SelectTrigger id="domain_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sub_domain">Sub Domain</SelectItem>
                  <SelectItem value="custom_domain">Custom Domain</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="primary_domain_name">Primary Domain Name <span className="text-red-500">*</span></Label>
              <Input
                id="primary_domain_name"
                name="primary_domain_name"
                value={websiteData.primary_domain_name}
                onChange={handleWebsiteDataChange}
                placeholder="e.g., begrat.com"
                disabled={loading || websiteData.domain_type === 'sub_domain'}
              />
              {websiteData.domain_type === 'custom_domain' && (
                <p className="text-sm text-gray-500 mt-1">
                  Set an A record to {import.meta.env.VITE_SERVER_IP || '139.59.3.58'}.
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="sub_domain">
                Sub-Domain {websiteData.domain_type === 'sub_domain' && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="sub_domain"
                name="sub_domain"
                value={websiteData.sub_domain}
                onChange={handleWebsiteDataChange}
                placeholder="e.g., khushi"
                disabled={websiteData.domain_type !== 'sub_domain' || loading}
              />
              {websiteData.domain_type === 'sub_domain' && (
                <p className="text-sm text-gray-500 mt-1">Your store: {websiteData.sub_domain}.begrat.com</p>
              )}
            </div>
            <div>
              <Label htmlFor="website_link">Website Link</Label>
              <Input id="website_link" name="website_link" value={websiteData.website_link} disabled />
            </div>
            <div>
              <Label>DNS Status</Label>
              <Badge
                className={
                  {
                    pending: 'bg-yellow-100 text-yellow-800',
                    verified: 'bg-green-100 text-green-800',
                    unverified: 'bg-red-100 text-red-800',
                    error: 'bg-red-100 text-red-800',
                  }[websiteData.dns_status] || 'bg-gray-100 text-gray-800'
                }
              >
                {websiteData.dns_status === 'verified' ? '✅ Active' :
                  websiteData.dns_status === 'unverified' ? '❌ Unverified' :
                    websiteData.dns_status === 'error' ? '⚠️ Error' : '⏳ Pending'}
              </Badge>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            {renderValidationErrors()}
            <p className="text-sm text-gray-500">This information will appear on your website’s Contact page.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name <span className="text-red-500">*</span></Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={websiteData.first_name}
                  onChange={handleWebsiteDataChange}
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={websiteData.last_name}
                  onChange={handleWebsiteDataChange}
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email_id">Email ID <span className="text-red-500">*</span></Label>
              <Input
                id="email_id"
                name="email_id"
                type="email"
                value={websiteData.email_id}
                onChange={handleWebsiteDataChange}
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-1">This email will receive tenant-related notifications.</p>
            </div>
            <div>
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile"
                name="mobile"
                value={websiteData.mobile}
                onChange={handleWebsiteDataChange}
                placeholder="e.g., +1234567890"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={websiteData.address}
                onChange={handleWebsiteDataChange}
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="skype">Skype</Label>
              <Input
                id="skype"
                name="skype"
                value={websiteData.skype}
                onChange={handleWebsiteDataChange}
                placeholder="e.g., skype_id"
                disabled={loading}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            {renderValidationErrors()}
            <p className="text-sm text-gray-500">Use a logo with your site name (PNG/JPG, max 4MB, 170px × 65px recommended).</p>
            <div>
              <Label htmlFor="site_name">Site Name <span className="text-red-500">*</span></Label>
              <Input
                id="site_name"
                name="site_name"
                value={websiteData.site_name}
                onChange={handleWebsiteDataChange}
                placeholder="e.g., My Site"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="site_logo">Site Logo</Label>
              <Input
                id="site_logo"
                name="site_logo"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleWebsiteDataChange}
                disabled={loading}
              />
              {websiteData.site_logo && (
                <p className="text-sm text-gray-500 mt-1">Selected: {websiteData.site_logo.name}</p>
              )}
              {settings?.site_logo_url && !websiteData.site_logo && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Current Logo:</p>
                  <img
                    src={settings.site_logo_url}
                    alt="Current Logo"
                    className="h-16 w-auto object-contain rounded-md border"
                  />
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            {renderValidationErrors()}
            <div>
              <Label htmlFor="nht_website_link">NHT Website Link</Label>
              <Input
                id="nht_website_link"
                name="nht_website_link"
                value={websiteData.nht_website_link}
                onChange={handleWebsiteDataChange}
                placeholder="e.g., https://begrat.com"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="nht_store_link">NHT Store Link</Label>
              <Input
                id="nht_store_link"
                name="nht_store_link"
                value={websiteData.nht_store_link}
                onChange={handleWebsiteDataChange}
                placeholder="e.g., https://begrat.com"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="nht_joining_link">NHT Joining Link</Label>
              <Input
                id="nht_joining_link"
                name="nht_joining_link"
                value={websiteData.nht_joining_link}
                onChange={handleWebsiteDataChange}
                placeholder="e.g., https://begrat.com"
                disabled={loading}
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <p className="text-lg font-medium text-gray-900">Review your details and click "Update" to save.</p>
            {renderValidationErrors()}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {Object.entries(websiteData).map(([key, value]) => (
                key !== 'site_logo' && key !== 'website_link' && key !== 'dns_status' && (
                  <div key={key} className="flex flex-col">
                    <span className="font-medium text-gray-700 capitalize">{key.replace('_', ' ')}:</span>
                    <span>{value || 'N/A'}</span>
                  </div>
                )
              ))}
              <div className="flex flex-col">
                <span className="font-medium text-gray-700">Website Link:</span>
                <span>{websiteData.website_link || 'N/A'}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-700">DNS Status:</span>
                <Badge
                  className={
                    {
                      pending: 'bg-yellow-100 text-yellow-800',
                      verified: 'bg-green-100 text-green-800',
                      unverified: 'bg-red-100 text-red-800',
                      error: 'bg-red-100 text-red-800',
                    }[websiteData.dns_status] || 'bg-gray-100 text-gray-800'
                  }
                >
                  {websiteData.dns_status || 'N/A'}
                </Badge>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-700">Site Logo:</span>
                <span>
                  {websiteData.site_logo
                    ? websiteData.site_logo.name
                    : settings?.site_logo_url
                      ? 'Current logo set'
                      : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">Agents</h1>

      {!showProfile && (
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Show</span>
                <Select value={entries.toString()} onValueChange={(value) => setEntries(Number(value))}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">entries</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Search:</span>
                <Input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                  disabled={loading}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex justify-center items-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
              </div>
            )}
            {error && !tenantUsers.length && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sr. No.</TableHead>
                  <TableHead>Agent Name</TableHead>
                  <TableHead>Email ID</TableHead>
                  <TableHead>Weblink</TableHead>
                  <TableHead>DNS Status</TableHead>
                  <TableHead>Account Status</TableHead>
                  <TableHead>Toggle Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedAgents.length ? (
                  displayedAgents.map((agent, idx) => (
                    <TableRow key={agent.id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{`${agent.first_name} ${agent.last_name}`}</TableCell>
                      <TableCell>{agent.email_id}</TableCell>
                      <TableCell>
                        <a
                          href={agent.website_link || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {agent.website_link || 'Not set'}
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            agent.dns_status === 'verified'
                              ? 'bg-green-100 text-green-800'
                              : agent.dns_status === 'unverified'
                                ? 'bg-red-100 text-red-800'
                                : agent.dns_status === 'error'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {agent.dns_status || 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            agent.subscription_status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {agent.subscription_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleUserStatus(agent)}
                          disabled={loading}
                          className={
                            agent.subscription_status === 'inactive'
                              ? 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100'
                              : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                          }
                        >
                          {agent.subscription_status === 'active' ? (
                            <>
                              <XCircle className="h-4 w-4 mr-1" /> Deactivate
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" /> Activate
                            </>
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openProfile(agent)}
                          disabled={loading}
                          className="bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100"
                        >
                          View Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                      No agents found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {showProfile && selectedAgent && (
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-2xl font-semibold text-gray-900">Agent Profile</CardTitle>
            <Button
              variant="outline"
              onClick={closeProfile}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="website" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="website">Website Details</TabsTrigger>
                <TabsTrigger value="invoice">Invoice</TabsTrigger>
                <TabsTrigger value="subscription">Subscription</TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="p-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Label className="w-32">Agent Full Name:</Label>
                    <p className="font-medium">{`${selectedAgent.first_name} ${selectedAgent.last_name}`}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Label className="w-32">Agent Email ID:</Label>
                    <p className="font-medium">{selectedAgent.email_id}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Label className="w-32">Tenant ID:</Label>
                    <p className="font-medium">{selectedAgent.tenant_id}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="website" className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    {steps.map((step, idx) => (
                      <div key={idx} className="flex-1 text-center">
                        <div
                          className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-sm font-medium ${idx <= websiteStep
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-600'
                            }`}
                        >
                          {idx + 1}
                        </div>
                        <p className="text-sm mt-2">{step}</p>
                      </div>
                    ))}
                  </div>
                  <Progress value={(websiteStep / (steps.length - 1)) * 100} className="h-2" />
                  {renderWebsiteStep()}
                  <div className="flex justify-between mt-6">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      disabled={websiteStep === 0 || loading}
                      className="w-32"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={websiteStep === steps.length - 1 ? updateWebsiteDetails : nextStep}
                      disabled={loading}
                      className="w-32 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : websiteStep === steps.length - 1 ? (
                        'Update'
                      ) : (
                        'Next'
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="invoice" className="p-6">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">Show</span>
                      <Select defaultValue="10">
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-gray-600">entries</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Search:</span>
                      <Input
                        type="text"
                        placeholder="Search invoices..."
                        className="w-64"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sr. No.</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Purchase Date</TableHead>
                        <TableHead>Paid Amount</TableHead>
                        <TableHead>Receipt</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>1</TableCell>
                        <TableCell>41139980-chre9b3e1ecb60d-b9dc2b5088</TableCell>
                        <TableCell>15 Feb 2025 05:42:01</TableCell>
                        <TableCell>USD 0.01</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" disabled={loading}>
                            View Receipt
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                    <p>Showing 1 to 1 of 1 entries</p>
                    <div className="flex gap-2">
                      <Button variant="outline" disabled>
                        Previous
                      </Button>
                      <Button variant="outline" disabled>
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="subscription" className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <Label>Subscription Activate</Label>
                      <p className="font-medium">{selectedAgent.subscription_activate || 'N/A'}</p>
                    </div>
                    <div className="flex flex-col">
                      <Label>Next Bill Date</Label>
                      <p className="font-medium">{selectedAgent.next_bill_date || 'N/A'}</p>
                    </div>
                    <div className="flex flex-col">
                      <Label>Amount</Label>
                      <p className="font-medium">{selectedAgent.amount || '0'}</p>
                    </div>
                    <div className="flex flex-col">
                      <Label>Status</Label>
                      <Badge
                        className={
                          selectedAgent.subscription_status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {selectedAgent.subscription_status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
      <ToastNotification />
    </div>
  );
};

export default Agents;