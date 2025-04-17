import React, { useEffect, useState } from 'react';
import useTenantApi from '../../hooks/useTenantApi';

const Subscribers = () => {
  const { getAll, loading, error } = useTenantApi();
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await getAll('/admin/getallsubscribers');
        setSubscribers(res.data || []);
      } catch (err) {
        console.error('Failed to fetch subscribers:', err);
      }
    };

    fetchSubscribers();
  }, [getAll]);

  return (
    <div className="bg-black min-h-screen p-8 text-white">
      <h1 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2">Newsletter Subscribers</h1>
      {loading && <p className="text-gray-400">Loading subscribers...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {!loading && subscribers.length === 0 && <p className="text-gray-400">No subscribers found.</p>}
      {!loading && subscribers.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border border-white">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="py-2 px-4 border-b border-white text-left">#</th>
                <th className="py-2 px-4 border-b border-white text-left">Email</th>
                <th className="py-2 px-4 border-b border-white text-left">Status</th>
                <th className="py-2 px-4 border-b border-white text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub, index) => (
                <tr key={sub.id} className="hover:bg-gray-800">
                  <td className="py-2 px-4 border-b border-gray-700">{index + 1}</td>
                  <td className="py-2 px-4 border-b border-gray-700">{sub.email}</td>
                  <td className="py-2 px-4 border-b border-gray-700 capitalize">{sub.status}</td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Subscribers;
