// src/components/landing/TemplatesSection.js
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const TemplatesSection = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/templates", {
          method: "GET",
          credentials: "include", // Optional, remove if not needed
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch templates: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched templates:", data); // Debug log
        setTemplates(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handlePreview = (route) => {
    console.log(`Navigating to: ${route}`);
    navigate(route); // Navigate to /template1, /template2, etc.
  };

  if (loading) {
    return <div className="text-center py-16">Loading templates...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-600">Error: {error}</div>;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-medium mb-4 text-black text-center">
          Explore Our Templates
        </h2>
        <p className="text-center text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Check out our professionally designed templates to kickstart your website.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.length === 0 ? (
            <div className="text-center col-span-full">No templates available</div>
          ) : (
            templates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={template.image || "https://via.placeholder.com/1350x400"}
                    alt={template.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {template.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{template.description || "No description available"}</p>
                  <Button
                    className="w-full py-2 bg-black text-white hover:bg-gray-900 transition-all duration-200 font-medium"
                    onClick={() => handlePreview(template.route)}
                  >
                    Preview
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default TemplatesSection;