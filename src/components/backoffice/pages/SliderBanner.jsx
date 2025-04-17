// SliderBanner.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'react-feather';
import useTenantApi from '@/hooks/useTenantApi';
import toast, { Toaster } from 'react-hot-toast';

const SliderBanner = () => {
  const { data: bannersData, loading, error, getAll, post, put, apiRequest } = useTenantApi();
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [tenantId, setTenantId] = useState(null);
  const [sliders, setSliders] = useState([]);
  const [newSlider, setNewSlider] = useState({
    image: null,
    imageUrl: '',
    text: '',
  });
  const [imageSource, setImageSource] = useState('file');
  const [formError, setFormError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedTenantId = localStorage.getItem('tenant_id');
    if (storedTenantId && tenantId !== storedTenantId) {
      setTenantId(storedTenantId);
    }
  }, []);

  useEffect(() => {
    if (tenantId && !hasFetched && !loading) {
      toast.promise(
        getAll(`/tenants/${tenantId}/slider-banners`).then(() => setHasFetched(true)),
        {
          loading: 'Fetching banners...',
          success: 'Banners loaded successfully!',
          error: 'Failed to load banners.',
        }
      );
    }
  }, [tenantId, getAll, hasFetched, loading]);

  useEffect(() => {
    if (bannersData) {
      if (Array.isArray(bannersData)) {
        setSliders(
          bannersData.map((banner) => ({
            id: banner.id,
            image: banner.image_url,
            content: banner.text,
            uploadedOn: new Date(banner.created_at || Date.now()).toISOString().split('T')[0],
          }))
        );
      } else {
        setSliders([]);
      }
    }
  }, [bannersData]);

  const handleAddNew = () => {
    setShowForm(true);
    setIsEditing(false);
    setNewSlider({ image: null, imageUrl: '', text: '' });
    setImageSource('file');
    setFormError(null);
  };

  const handleEdit = (slider) => {
    setShowForm(true);
    setIsEditing(true);
    setEditId(slider.id);
    setNewSlider({
      image: null,
      imageUrl: slider.image,
      text: slider.content,
    });
    setImageSource('url');
    setFormError(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditId(null);
    setNewSlider({ image: null, imageUrl: '', text: '' });
    setFormError(null);
  };

  const handleSave = async () => {
    const formData = new FormData();
    const hasImageFile = newSlider.image !== null;
    const hasImageUrl = typeof newSlider.imageUrl === 'string' && newSlider.imageUrl.trim() !== '';
  
    if (imageSource === 'file' && hasImageFile) {
      formData.append('image', newSlider.image);
    } else if (hasImageUrl) {
      formData.append('image_url', newSlider.imageUrl);
    } else if (!isEditing) {
      setFormError('Please provide either an image file or an image URL');
      return;
    }
  
    formData.append('text', newSlider.text);
  
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await toast.promise(
          put(`/tenants/${tenantId}/slider-banners/${editId}`, formData, true),
          {
            loading: 'Updating banner...',
            success: 'Banner updated successfully!',
            error: 'Failed to update banner.',
          }
        );
      } else {
        await toast.promise(
          post(`/tenants/${tenantId}/slider-banners`, formData, true),
          {
            loading: 'Adding banner...',
            success: 'Banner added successfully!',
            error: 'Failed to add banner.',
          }
        );
      }
      setHasFetched(false);
      await getAll(`/tenants/${tenantId}/slider-banners`);
      handleCancel();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save banner');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async (bannerId) => {
    setIsSubmitting(true);
    try {
      await toast.promise(
        apiRequest('delete', `/tenants/${tenantId}/slider-banners/${bannerId}`),
        {
          loading: 'Deleting banner...',
          success: 'Banner deleted successfully!',
          error: 'Failed to delete banner.',
        }
      );
      setHasFetched(false);
      await getAll(`/tenants/${tenantId}/slider-banners`);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to delete banner');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container ">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Slider Banners</h1>
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="bg-black text-white px-6 py-2 rounded-full flex items-center gap-2  transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Plus size={18} /> Add New Banner
          </button>
        )}
      </div>

      {!showForm && (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 transition-all duration-300">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-black"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <p className="text-red-500 text-lg font-medium">{error.message}</p>
              <button
                onClick={() => getAll(`/tenants/${tenantId}/slider-banners`)}
                className="mt-4 text-black hover:underline"
              >
                Retry
              </button>
            </div>
          ) : sliders.length === 0 ? (
            <div className="p-12 text-center">
              <svg
                className="mx-auto h-24 w-24 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Banners Yet</h3>
              <p className="text-gray-500 mb-6">
                Get started by adding your first slider banner!
              </p>
              <button
                onClick={handleAddNew}
                className="bg-black text-white px-6 py-2 rounded-full  transition-all duration-200"
              >
                Add Your First Banner
              </button>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Sr.No.</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Content</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Uploaded On</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sliders.map((slider, index) => (
                  <tr key={slider.id} className="hover:bg-gray-50 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{index + 1}</td>
                    <td className="px-6 py-4">
                      <img
                        src={slider.image}
                        alt="Slider Banner"
                        className="h-16 w-auto object-cover rounded-lg shadow-sm"
                        onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">{slider.content || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{slider.uploadedOn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-4">
                      <button
                        onClick={() => handleEdit(slider)}
                        disabled={isSubmitting}
                        className="text-black  transform hover:scale-105 transition-all duration-200 flex items-center gap-1 disabled:opacity-50"
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(slider.id)}
                        disabled={isSubmitting}
                        className="text-red-600 hover:text-red-800 transform hover:scale-105 transition-all duration-200 flex items-center gap-1 disabled:opacity-50"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 transition-all duration-300">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            {isEditing ? 'Edit Slider Banner' : 'Add New Slider Banner'}
          </h3>
          {formError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{formError}</div>
          )}

          <div className="mb-6">
            <p className="block text-sm font-medium text-gray-700 mb-2">Image Source</p>
            <div className="flex space-x-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-black focus:ring-black"
                  name="imageSource"
                  value="file"
                  checked={imageSource === 'file'}
                  onChange={() => setImageSource('file')}
                  disabled={isSubmitting}
                />
                <span className="ml-2 text-gray-700">Upload File</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-black focus:ring-black"
                  name="imageSource"
                  value="url"
                  checked={imageSource === 'url'}
                  onChange={() => setImageSource('url')}
                  disabled={isSubmitting}
                />
                <span className="ml-2 text-gray-700">Image URL</span>
              </label>
            </div>
          </div>

          <div className="space-y-6">
            {imageSource === 'file' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banner Image (1349px × 420px) {isEditing ? '(Optional)' : '(Required)'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all duration-200 disabled:opacity-50"
                  onChange={(e) => setNewSlider({ ...newSlider, image: e.target.files[0] })}
                  disabled={isSubmitting}
                />
                {isEditing && newSlider.imageUrl && (
                  <p className="text-xs text-gray-500 mt-2">
                    Current:{' '}
                    <img
                      src={newSlider.imageUrl}
                      alt="Current Banner"
                      className="inline h-8 w-auto object-cover rounded mt-1"
                      onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                    />
                  </p>
                )}
              </div>
            )}

            {imageSource === 'url' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL {isEditing ? '(Optional)' : '(Required)'}
                </label>
                <input
                  type="url"
                  value={newSlider.imageUrl}
                  onChange={(e) => setNewSlider({ ...newSlider, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-gray-400 transition-all duration-200 text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="https://example.com/image.jpg"
                  disabled={isSubmitting}
                />
                {newSlider.imageUrl && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Preview:</p>
                    <img
                      src={newSlider.imageUrl}
                      alt="URL Preview"
                      className="h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                      onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                    />
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slider Text</label>
              <input
                type="text"
                value={newSlider.text}
                onChange={(e) => setNewSlider({ ...newSlider, text: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-gray-400 transition-all duration-200 text-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter slider text (optional)"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleCancel}
                className="px-5 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-black text-white rounded-full 0 hover:scale-105 transition-all duration-200 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                )}
                {isEditing ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SliderBanner;