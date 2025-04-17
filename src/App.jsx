// src/App.js
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes/AppRoutes';
import ScrollToTop from './components/ui/ScrollToTop';

function App() {
  return (
    <div className="App min-h-screen flex flex-col bg-gray-100">
      <RouterProvider router={router} />
      <ScrollToTop />
    </div>
  );
}

export default App;