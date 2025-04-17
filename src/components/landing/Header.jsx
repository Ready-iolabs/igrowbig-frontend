import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link as RouterLink } from "react-router-dom"; // Alias for router links
import { Link as ScrollLink } from "react-scroll"; // Import react-scroll Link
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { title: "Home", to: "promotion" }, // Adjusted to scroll to top section
    { title: "Features", to: "features" },
    { title: "How it Works", to: "how-it-works" },
    { title: "Pricing", to: "pricing" },
    { title: "FAQs", to: "faqs" },
    { title: "Contact", to: "contact" },
    { title: "Templates", to: "templates" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-lg z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <ScrollLink
          to="promotion"
          smooth={true}
          duration={500}
          className="flex items-center cursor-pointer"
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="h-auto w-32 bg-transparent transition-transform duration-300 hover:scale-105"
          />
        </ScrollLink>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex flex-1 justify-center">
          <NavigationMenuList className="gap-2">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                <ScrollLink
                  to={item.to}
                  smooth={true}
                  duration={500}
                  className={`${navigationMenuTriggerStyle()} 
                    text-gray-700 
                    hover:text-black 
                    hover:bg-gray-100 
                    font-medium 
                    text-md 
                    px-4 
                    py-2 
                    rounded-md 
                    transition-all 
                    duration-200 cursor-pointer`}
                >
                  {item.title}
                </ScrollLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="outline"
            className="border-gray-300 
              text-gray-700 
              hover:text-black 
              hover:border-black 
              hover:bg-gray-50 
              font-semibold 
              px-6 
              py-2 
              rounded-full 
              transition-all 
              duration-200"
            asChild
          >
            <RouterLink to="/backoffice-signup">Join Us</RouterLink>
          </Button>
          <Button
            className="bg-black 
              text-white 
              hover:bg-gray-800 
              font-semibold 
              px-6 
              py-2 
              rounded-full 
              transition-all 
              duration-200"
            asChild
          >
            <RouterLink to="/backoffice-login">Login</RouterLink>
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-700 hover:text-black hover:bg-gray-100 rounded-full"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] bg-gray-50">
            <nav className="flex flex-col gap-6 mt-10">
              {navItems.map((item) => (
                <ScrollLink
                  key={item.title}
                  to={item.to}
                  smooth={true}
                  duration={500}
                  className="text-lg 
                    font-medium 
                    text-gray-700 
                    hover:text-black 
                    hover:pl-2 
                    uppercase 
                    transition-all 
                    duration-200 cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  {item.title}
                </ScrollLink>
              ))}
              <div className="mt-6 space-y-4">
                <Button
                  variant="outline"
                  className="w-full 
                    justify-center 
                    border-gray-300 
                    text-gray-700 
                    hover:text-black 
                    hover:bg-gray-100 
                    font-semibold 
                    py-2 
                    rounded-full 
                    transition-all 
                    duration-200"
                  asChild
                >
                  <RouterLink to="/backoffice-signup" onClick={() => setIsOpen(false)}>
                    Join Us
                  </RouterLink>
                </Button>
                <Button
                  className="w-full 
                    justify-center 
                    bg-black 
                    text-white 
                    hover:bg-gray-800 
                    font-semibold 
                    py-2 
                    rounded-full 
                    transition-all 
                    duration-200"
                  asChild
                >
                  <RouterLink to="/backoffice-login" onClick={() => setIsOpen(false)}>
                    Login
                  </RouterLink>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;