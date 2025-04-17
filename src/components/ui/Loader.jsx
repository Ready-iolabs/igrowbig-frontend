import React, { useEffect, useState } from "react";

const Loader = () => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setFadeOut(true);
    }, 3000); // Hide loader after 3 seconds
  }, []);

  return (
    <div
      className={`fixed inset-0 bg-black flex items-center justify-center transition-opacity duration-700 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center">
        {/* Animated Text */}
        <h1 className="text-4xl font-bold text-white tracking-wide mb-4">
          iGrow <span className="text-gray-400">Big</span>
        </h1>
        {/* Spinner */}
        <div className="w-12 h-12 border-t-4 border-gray-400 border-solid rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;
