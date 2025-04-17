// D:\NHT GLOBAL\front\src\components\backoffice\layout\Header.jsx
import React from 'react';
import { theme } from '@/constants/backofficeConfig';
import NotificationDropdown from '../components/NotificationDropdown';
import ProfileDropdown from '../components/ProfileDropdown';

const Header = ({
  pageTitle,
  isSidebarOpen,
  setIsSidebarOpen,
  notifications,
  isNotificationOpen,
  setIsNotificationOpen,
  isProfileMenuOpen,
  setIsProfileMenuOpen,
  notificationRef,
  profileRef,
}) => (
  <header
    className="h-16 border-b flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 shadow-sm"
    style={{ backgroundColor: theme.secondary.main, borderColor: theme.accent.light }}
  >
    <div className="flex items-center">
      <button
        className="mr-4 p-2 rounded-md hover:bg-opacity-10 md:hidden transition-colors duration-200"
        style={{ color: theme.text.secondary }}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
      <h2 className="text-lg font-semibold animate-fade-in" style={{ color: theme.text.primary }}>
        {pageTitle}
      </h2>
    </div>
    <div className="flex items-center space-x-4">
      <div className="hidden md:flex items-center relative">
        <input
          type="text"
          placeholder="Search..."
          className="rounded-full py-1 px-4 pl-8 text-sm border focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 w-40 focus:w-60"
          style={{
            borderColor: theme.accent.light,
            color: theme.text.primary,
            backgroundColor: theme.secondary.main,
          }}
        />
        <svg
          className="w-4 h-4 absolute left-2.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: theme.text.light }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <NotificationDropdown
        notifications={notifications}
        isOpen={isNotificationOpen}
        toggle={() => setIsNotificationOpen(!isNotificationOpen)}
        ref={notificationRef}
      />
      <ProfileDropdown
        isOpen={isProfileMenuOpen}
        toggle={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        ref={profileRef}
      />
    </div>
  </header>
);

export default Header;