// D:\NHT GLOBAL\front\src\components\backoffice\components\NotificationDropdown.jsx
import React from 'react';
import { Bell } from 'lucide-react';
import { theme } from '@/constants/backofficeConfig';

const NotificationDropdown = ({ notifications, isOpen, toggle, ref }) => (
  <div className="relative" ref={ref}>
    <button
      className="p-2 rounded-full transition-colors duration-300 ease-in-out hover:bg-opacity-10"
      style={{ color: theme.text.secondary }}
      onClick={toggle}
    >
      <Bell className="w-6 h-6" />
      <span
        className="absolute top-1 right-1 h-4 w-4 rounded-full flex items-center justify-center text-xs text-white animate-pulse"
        style={{ backgroundColor: theme.primary.main }}
      >
        {notifications.length}
      </span>
    </button>
    {isOpen && (
      <div
        className="absolute right-0 mt-2 w-64 rounded-md shadow-lg overflow-hidden z-20 border animate-fade-in"
        style={{ backgroundColor: theme.secondary.main, borderColor: theme.accent.light }}
      >
        <div
          className="px-4 py-2 border-b flex justify-between items-center"
          style={{ backgroundColor: theme.secondary.light, borderColor: theme.accent.light }}
        >
          <h3 className="text-sm font-semibold" style={{ color: theme.text.primary }}>
            Notifications
          </h3>
          <span
            className="text-xs px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: theme.primary.main }}
          >
            {notifications.length} new
          </span>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="px-4 py-3 border-b hover:bg-opacity-10 transition-colors duration-200"
              style={{ borderColor: theme.accent.light }}
            >
              <p className="text-sm" style={{ color: theme.text.primary }}>
                {notification.text}
              </p>
              <p className="text-xs mt-1" style={{ color: theme.text.light }}>
                {notification.time}
              </p>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 text-center" style={{ backgroundColor: theme.secondary.light }}>
          <button
            className="text-sm hover:text-opacity-80 transition-colors duration-200"
            style={{ color: theme.primary.main }}
          >
            View all notifications
          </button>
        </div>
      </div>
    )}
  </div>
);

export default NotificationDropdown;