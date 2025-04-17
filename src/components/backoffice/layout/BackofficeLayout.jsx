import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SidebarItem from '../components/SidebarItem';
import Header from './Header';
import Footer from './Footer';
import { theme, menuConfig } from '@/constants/backofficeConfig';
import { SidebarProvider, SidebarContent, SidebarMenu } from '@/components/ui/sidebar';

const BackofficeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(() =>
    menuConfig.filter((item) => item.subItems).map((item) => item.id)
  );
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const location = useLocation();
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const notifications = [
    { id: 1, text: 'New product added', time: '2 min ago' },
    { id: 2, text: 'New user registered', time: '1 hour ago' },
    { id: 3, text: 'System update completed', time: 'Yesterday' },
  ];

  useEffect(() => {
    const pathSegment = location.pathname.split('/').pop();
    const title = pathSegment
      ? pathSegment
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      : 'Dashboard';
    setPageTitle(location.pathname === '/backoffice' ? 'Dashboard' : title);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menuId) => {
    setActiveMenu((prev) =>
      prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]
    );
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: theme.secondary.light }}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-all duration-300 ease-in-out border-r md:translate-x-0 shadow-lg ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: theme.secondary.main, borderColor: theme.accent.light }}
      >
        <div
          className="h-16 flex items-center justify-between px-4 border-b"
          style={{ background: theme.primary.main, borderColor: theme.primary.light }}
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
              <span style={{ color: theme.primary.main }} className="font-bold text-lg">
                IG
              </span>
            </div>
            <h1 className="text-xl font-medium text-white">Backoffice Panel</h1>
          </div>
          <button
            className="md:hidden p-2 rounded-md hover:bg-opacity-20 hover:bg-white transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="h-[calc(100vh-4rem)] overflow-y-auto">
          <SidebarProvider>
            <SidebarContent className="p-0">
              <SidebarMenu>
                {menuConfig.map((item) => (
                  <SidebarItem
                    key={item.id || item.to}
                    item={item}
                    isActive={activeMenu.includes(item.id) || location.pathname.includes(item.to?.split('/').pop())}
                    toggleMenu={toggleMenu}
                    location={location}
                    activeMenu={activeMenu}
                  />
                ))}
              </SidebarMenu>
            </SidebarContent>
          </SidebarProvider>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 md:ml-64">
        <Header
          pageTitle={pageTitle}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          notifications={notifications}
          isNotificationOpen={isNotificationOpen}
          setIsNotificationOpen={setIsNotificationOpen}
          isProfileMenuOpen={isProfileMenuOpen}
          setIsProfileMenuOpen={setIsProfileMenuOpen}
          notificationRef={notificationRef}
          profileRef={profileRef}
        />
        <main
          className="flex-1 overflow-auto p-4 md:p-6 animate-fade-in"
          style={{ backgroundColor: theme.secondary.light }}
        >
          <Outlet />
        </main>
        <Footer />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default BackofficeLayout;