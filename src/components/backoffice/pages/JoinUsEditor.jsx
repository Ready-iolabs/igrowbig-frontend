import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'react-feather';

const JoinUsEditor = () => {
  const [sections, setSections] = useState([
    {
      id: 1,
      type: 'banner',
      title: 'Join Our Team',
      image: 'banner.jpg',
      description: 'Be part of something great!',
    },
    {
      id: 2,
      type: 'content',
      title: 'Why Join Us?',
      content: 'Great benefits, amazing culture.',
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newSection, setNewSection] = useState({
    type: 'banner',
    title: '',
    image: '',
    description: '',
    content: '',
  });

  const handleAddNew = () => {
    setShowForm(true);
    setIsEditing(false);
    setNewSection({ type: 'banner', title: '', image: '', description: '', content: '' });
  };

  const handleEdit = (section) => {
    setShowForm(true);
    setIsEditing(true);
    setEditId(section.id);
    setNewSection({
      type: section.type,
      title: section.title,
      image: section.image || '',
      description: section.description || '',
      content: section.content || '',
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditId(null);
    setNewSection({ type: 'banner', title: '', image: '', description: '', content: '' });
  };

  const handleSave = () => {
    if (newSection.title.trim()) {
      const cleanedSection = {
        ...(newSection.type === 'banner'
          ? { title: newSection.title, image: newSection.image, description: newSection.description }
          : { title: newSection.title, content: newSection.content }),
        type: newSection.type,
      };

      if (isEditing) {
        setSections(sections.map((section) =>
          section.id === editId ? { id: editId, ...cleanedSection } : section
        ));
      } else {
        setSections([...sections, { id: sections.length + 1, ...cleanedSection }]);
      }
      handleCancel();
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="bg-gradient-to-r from-gray-800 to-black text-white px-5 py-2 rounded-full flex items-center gap-2 hover:from-gray-900 hover:to-black transform hover:scale-105 transition-all duration-300 shadow-md"
          >
            <Plus size={18} /> Add Section
          </button>
        )}
      </div>

      {/* Table */}
      {!showForm && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Sr.No.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Details</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sections.map((section, index) => (
                <tr key={section.id} className="hover:bg-gray-50 transition-all duration-200">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-medium">{index + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{section.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{section.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {section.type === 'banner' ? section.description : section.content}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex items-center gap-3">
                    <button
                      onClick={() => handleEdit(section)}
                      className="text-gray-600 hover:text-black transform hover:scale-105 transition-all duration-200 flex items-center gap-1"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => setSections(sections.filter((_, i) => i !== index))}
                      className="text-gray-600 hover:text-red-600 transform hover:scale-105 transition-all duration-200 flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {isEditing ? 'Edit Section' : 'Create New Section'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Type</label>
              <select
                value={newSection.type}
                onChange={(e) => setNewSection({ ...newSection, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50"
              >
                <option value="banner">Page Banner</option>
                <option value="content">Page Content</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newSection.title}
                onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50"
                placeholder="Enter section title"
              />
            </div>

            {newSection.type === 'banner' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image (Max 4MB)</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200"
                    onChange={(e) => setNewSection({ ...newSection, image: e.target.files[0]?.name })}
                  />
                  {isEditing && newSection.image && (
                    <p className="text-xs text-gray-500 mt-1">Current: {newSection.image}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newSection.description}
                    onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50"
                    placeholder="Enter banner description"
                    rows="3"
                  />
                </div>
              </>
            )}

            {newSection.type === 'content' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={newSection.content}
                  onChange={(e) => setNewSection({ ...newSection, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50"
                  placeholder="Enter content"
                  rows="4"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-200 rounded-full text-gray-700 hover:bg-gray-100 hover:scale-105 transition-all duration-200 font-medium shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 font-medium shadow-md"
            >
              {isEditing ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JoinUsEditor;