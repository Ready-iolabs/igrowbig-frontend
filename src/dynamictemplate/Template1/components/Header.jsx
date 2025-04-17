import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { slug } = useParams(); // Get the dynamic slug from the URL

  // Navigation items array with dynamic slug prefix
  const navItems = [
    { path: `/${slug || ''}`, label: 'Home' }, // Handle root path with or without slug
    { path: `/${slug}/products`, label: 'Products' },
    { path: `/${slug}/opportunity`, label: 'Opportunity' },
    { path: `/${slug}/join-us`, label: 'Join Us' },
    { path: `/${slug}/contact`, label: 'Contact' },
    { path: `/${slug}/blog`, label: 'Blog' },
  ];

  // Handle navigation click
  const handleNavClick = () => {
    setIsOpen(false); // Close sheet after navigation
  };

  return (
    <header className="shadow-xl py-4 bg-gradient-to-b from-indigo-50 to-white">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <img
            src="./1.png"
            alt="NHT Global Logo"
            className="w-28 md:w-36 transition-transform duration-300 hover:scale-105"
          />
          <p className="text-xs md:text-sm text-black font-light hidden sm:block">
            An Independent <br /> Distributor of NHT Global
          </p>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex gap-6">
            {navItems.map((item) => (
              <li key={item.path}>
                <Button
                  asChild
                  variant="ghost"
                  className="text-sm font-medium"
                >
                  <Link to={item.path}>{item.label}</Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="mt-8">
              <ul className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start text-base font-medium"
                      onClick={handleNavClick}
                    >
                      <Link to={item.path}>{item.label}</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export default Header;