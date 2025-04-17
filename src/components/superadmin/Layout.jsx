import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/superadmin-login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-black text-white p-4 flex justify-between items-center z-20 shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-white focus:outline-none hover:text-gray-300 transition-colors duration-200"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-bold">Super Admin Panel</h1>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="bg-white text-black hover:bg-gray-100 transition-all duration-200"
        >
          Logout <LogOut className="ml-2" size={18} />
        </Button>
      </header>

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed top-16 left-0 w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] transform lg:transform-none transition-transform duration-300 ease-in-out z-10 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <ScrollArea className="h-full">
            <nav className="p-4">
              <div className="space-y-2">
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    `block py-2 px-4 rounded transition-all duration-200 ${
                      isActive
                        ? "bg-gray-100 text-gray-900 shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/admin/agents"
                  className={({ isActive }) =>
                    `block py-2 px-4 rounded transition-all duration-200 ${
                      isActive
                        ? "bg-gray-100 text-gray-900 shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Agents
                </NavLink>

                {/* Training Accordion */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="training">
                    <AccordionTrigger className="py-2 px-4 text-gray-700 hover:bg-gray-100 rounded transition-all duration-200">
                      Training
                    </AccordionTrigger>
                    <AccordionContent className="pl-4 space-y-2">
                      <NavLink
                        to="/admin/training/manage"
                        className={({ isActive }) =>
                          `block py-2 px-4 rounded transition-all duration-200 ${
                            isActive
                              ? "bg-gray-100 text-gray-900 shadow-sm"
                              : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                          }`
                        }
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        Manage Training
                      </NavLink>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <NavLink
                  to="/admin/settings"
                  className={({ isActive }) =>
                    `block py-2 px-4 rounded transition-all duration-200 ${
                      isActive
                        ? "bg-gray-100 text-gray-900 shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Settings
                </NavLink>
                <NavLink
                  to="/admin/create-user"
                  className={({ isActive }) =>
                    `block py-2 px-4 rounded transition-all duration-200 ${
                      isActive
                        ? "bg-gray-100 text-gray-900 shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Create User
                </NavLink>
                <NavLink
                  to="/admin/reset-pass"
                  className={({ isActive }) =>
                    `block py-2 px-4 rounded transition-all duration-200 ${
                      isActive
                        ? "bg-gray-100 text-gray-900 shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Reset Password
                </NavLink>
                <NavLink
                  to="/admin/send-notification"
                  className={({ isActive }) =>
                    `block py-2 px-4 rounded transition-all duration-200 ${
                      isActive
                        ? "bg-gray-100 text-gray-900 shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Send Message
                </NavLink>
                <NavLink
                  to="/admin/tenant-status-page"
                  className={({ isActive }) =>
                    `block py-2 px-4 rounded transition-all duration-200 ${
                      isActive
                        ? "bg-gray-100 text-gray-900 shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Status Page
                </NavLink>
                <NavLink
                  to="/admin/domain-setup"
                  className={({ isActive }) =>
                    `block py-2 px-4 rounded transition-all duration-200 ${
                      isActive
                        ? "bg-gray-100 text-gray-900 shadow-sm"
                        : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Domain Setup
                </NavLink>
              </div>
            </nav>
          </ScrollArea>
        </aside>

        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Main Content */}
        <main
          className={`flex-1 overflow-auto transition-all duration-300 ${
            isSidebarOpen ? "ml-0" : "ml-0 lg:ml-64"
          }`}
        >
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center shadow-inner">
        <p>© 2025 Super Admin Panel. All rights reserved.</p>
      </footer>
    </div>
  );
}