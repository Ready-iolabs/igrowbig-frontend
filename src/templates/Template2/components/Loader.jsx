// src/components/Loader.jsx
import React from 'react';

function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
      <div className="relative flex flex-col items-center">
        {/* Spinning Shopping Cart */}
        <div className="relative w-16 h-16">
          <svg
            className="w-full h-full text-teal-600 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 3h2l1 5h13l-2 7H6L4 8H3V3zm3 13a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm11 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
              fill="currentColor"
            />
          </svg>
          {/* Animated Product Boxes */}
          <div className="absolute top-0 left-0 w-4 h-4 bg-indigo-500 rounded-sm animate-bounce animation-delay-100"></div>
          <div className="absolute top-0 right-0 w-3 h-3 bg-teal-500 rounded-sm animate-bounce animation-delay-200"></div>
          <div className="absolute bottom-0 left-2 w-5 h-5 bg-yellow-500 rounded-sm animate-bounce animation-delay-300"></div>
        </div>
        {/* Loading Text */}
        <p className="mt-6 text-lg font-semibold text-gray-700 animate-pulse">
          Finding Your Perfect Products...
        </p>
      </div>
    </div>
  );
}

export default Loader;