import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '.././components/Header'
import Footer from '.././components/Footer';
import { ArrowUp } from 'lucide-react'; // Optional: Icon for the button
import { useLocation } from 'react-router-dom';

function MainLayout() {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  useEffect(() => {
    console.log("MainLayout.jsx:11 Current path:", location.pathname); // Line 11
  }, [location.pathname]); // Only log when pathname changes

  // Handle scroll event to show/hide the button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) { // Show button after scrolling 300px
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Smooth scrolling
    });
  };

  // Existing meta tag setup
  useEffect(() => {
    if (!document.querySelector('html').getAttribute('lang')) {
      document.querySelector('html').setAttribute('lang', 'en');
    }
    
    if (!document.querySelector('meta[name="viewport"]')) {
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0';
      document.head.appendChild(viewport);
    }
    
    if (!document.querySelector('meta[name="theme-color"]')) {
      const themeColor = document.createElement('meta');
      themeColor.name = 'theme-color';
      themeColor.content = '#ffffff';
      document.head.appendChild(themeColor);
    }
    
    if (!document.querySelector('meta[name="author"]')) {
      const author = document.createElement('meta');
      author.name = 'author';
      author.content = 'NHT Global';
      document.head.appendChild(author);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto" id="main-content">
        <Outlet />
      </main>
      <Footer />

      {/* Scroll to Top Button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-black text-white p-3 rounded-full shadow-lg  transition-all duration-300 z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
}

export default MainLayout;