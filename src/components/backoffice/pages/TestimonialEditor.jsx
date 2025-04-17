import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'react-feather';

const TestimonialEditor = () => {
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [testimonials, setTestimonials] = useState([
        {
            id: 1,

            content: 'Great service!',
            author: 'John Doe',
            created_at: '2025-03-01 10:00:00'
        },
        {
            id: 2,

            content: 'Amazing experience!',
            author: 'Jane Smith',
            created_at: '2025-03-02 14:30:00'
        },
    ]);

    const [newTestimonial, setNewTestimonial] = useState({
        tenant_id: '',
        content: '',
        author: ''
    });

    const handleAddNew = () => {
        setShowForm(true);
        setIsEditing(false);
        setNewTestimonial({ tenant_id: '', content: '', author: '' });
    };

    const handleEdit = (testimonial) => {
        setShowForm(true);
        setIsEditing(true);
        setEditId(testimonial.id);
        setNewTestimonial({ ...testimonial });
    };

    const handleCancel = () => {
        setShowForm(false);
        setIsEditing(false);
        setEditId(null);
        setNewTestimonial({ content: '', author: '' });
    };

    const handleSave = () => {
        if (isEditing) {
            setTestimonials(testimonials.map(testimonial =>
                testimonial.id === editId
                    ? { ...testimonial, ...newTestimonial, created_at: new Date().toISOString() }
                    : testimonial
            ));
        } else {
            const newEntry = {
                id: testimonials.length + 1,
                ...newTestimonial,
                created_at: new Date().toISOString()
            };
            setTestimonials([...testimonials, newEntry]);
        }
        handleCancel();
    };

    const filteredTestimonials = testimonials.filter(testimonial =>
        testimonial.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (testimonial.author && testimonial.author.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                {!showForm && (
                    <button
                        onClick={handleAddNew}
                        className="bg-gradient-to-r from-gray-800 to-black text-white px-5 py-2 rounded-full flex items-center gap-2 hover:from-gray-900 hover:to-black transform hover:scale-105 transition-all duration-300 shadow-md"
                    >
                        <Plus size={18} /> Add Testimonial
                    </button>
                )}
                {!showForm && (
                    <div className="relative w-72">
                        <input
                            type="text"
                            placeholder="Search testimonials..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 shadow-sm"
                        />
                        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                )}
            </div>

            {/* Table */}
            {!showForm && (
                <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-900 text-white">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Sr.No.</th>

                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Content</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Author</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Created At</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredTestimonials.map((testimonial, index) => (
                                <tr key={testimonial.id} className="hover:bg-gray-50 transition-all duration-200">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-medium">{index + 1}</td>

                                    <td className="px-4 py-3 text-sm text-gray-800">{testimonial.content}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{testimonial.author}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                                        {new Date(testimonial.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex items-center gap-3">
                                        <button
                                            onClick={() => handleEdit(testimonial)}
                                            className="text-gray-600 hover:text-black transform hover:scale-105 transition-all duration-200 flex items-center gap-1"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button className="text-gray-600 hover:text-red-600 transform hover:scale-105 transition-all duration-200 flex items-center gap-1">
                                            <Trash2 size={16} />
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
                        {isEditing ? 'Edit Testimonial' : 'Create New Testimonial'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                                <input
                                    type="text"
                                    value={newTestimonial.author}
                                    onChange={(e) => setNewTestimonial({ ...newTestimonial, author: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50"
                                    placeholder="Enter author name"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                <textarea
                                    value={newTestimonial.content}
                                    onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50"
                                    placeholder="Enter testimonial content"
                                    rows="4"
                                />
                            </div>
                        </div>
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

export default TestimonialEditor;