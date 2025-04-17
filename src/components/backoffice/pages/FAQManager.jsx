import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'react-feather';

const FAQManager = () => {
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddFAQ = () => {
    if (question.trim() && answer.trim()) {
      if (editingIndex !== null) {
        const updatedFaqs = faqs.map((faq, idx) =>
          idx === editingIndex ? { question, answer } : faq
        );
        setFaqs(updatedFaqs);
        setEditingIndex(null);
      } else {
        setFaqs([...faqs, { question, answer }]);
      }
      setQuestion('');
      setAnswer('');
      setShowForm(false);
    }
  };

  const handleEditFAQ = (index) => {
    setQuestion(faqs[index].question);
    setAnswer(faqs[index].answer);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDeleteFAQ = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingIndex(null);
    setQuestion('');
    setAnswer('');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-gray-800 to-black text-white px-5 py-2 rounded-full flex items-center gap-2 hover:from-gray-900 hover:to-black transform hover:scale-105 transition-all duration-300 shadow-md"
          >
            <Plus size={18} /> Add FAQ
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
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Question</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Answer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {faqs.map((faq, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-all duration-200">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800 font-medium">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{faq.question}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{faq.answer}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex items-center gap-3">
                    <button
                      onClick={() => handleEditFAQ(index)}
                      className="text-gray-600 hover:text-black transform hover:scale-105 transition-all duration-200 flex items-center gap-1"
                    >
                      <Edit size={16} /> 
                    </button>
                    <button
                      onClick={() => handleDeleteFAQ(index)}
                      className="text-gray-600 hover:text-red-600 transform hover:scale-105 transition-all duration-200 flex items-center gap-1"
                    >
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
            {editingIndex !== null ? 'Edit FAQ' : 'Create New FAQ'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50"
                placeholder="Enter question"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300 hover:border-gray-300 transition-all duration-200 bg-gray-50"
                placeholder="Enter answer"
                rows="4"
              />
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
              onClick={handleAddFAQ}
              className="px-4 py-2 bg-gradient-to-r from-gray-800 to-black text-white rounded-full hover:from-gray-900 hover:to-black hover:scale-105 transition-all duration-200 font-medium shadow-md"
            >
              {editingIndex !== null ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQManager;