// D:\NHT GLOBAL\front\src\components\backoffice\components\SidebarItem.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { theme } from '@/constants/backofficeConfig';

const SidebarItem = ({ item, isActive, toggleMenu, location, activeMenu }) => {
  const { id, label, icon: Icon, subItems, to } = item;

  const linkStyles = (isActive) => ({
    backgroundColor: isActive ? `${theme.accent.light}20` : 'transparent',
    borderLeft: isActive ? `4px solid ${theme.primary.main}` : 'transparent',
    color: isActive ? theme.primary.main : theme.text.primary,
    paddingLeft: isActive ? '0.5rem' : '0.75rem',
  });

  if (subItems) {
    const isOpen = activeMenu.includes(id);

    return (
      <Collapsible open={isOpen} onOpenChange={() => toggleMenu(id)} className="border-b" style={{ borderColor: theme.accent.light }}>
        <SidebarMenuItem className="m-0 p-0">
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              className="w-full text-left p-3 transition-all duration-300 ease-in-out flex items-center justify-between"
              style={{ color: theme.text.primary, backgroundColor: isActive ? `${theme.accent.light}20` : 'transparent' }}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} style={{ color: isActive ? theme.primary.main : theme.text.secondary }} />
                <span style={{ color: isActive ? theme.primary.main : theme.text.primary }}>{label}</span>
              </div>
              {isOpen ? (
                <ChevronDown size={18} style={{ color: theme.primary.main }} />
              ) : (
                <ChevronRight size={18} style={{ color: theme.text.secondary }} />
              )}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent
            className="transition-all duration-300 ease-in-out"
            style={{
              maxHeight: isOpen ? '1000px' : '0px',
              overflow: 'hidden',
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
            }}
          >
            <SidebarMenuSub>
              {subItems.map((subItem, index) => (
                <SidebarMenuSubItem key={index}>
                  <SidebarMenuSubButton asChild>
                    <NavLink
                      to={subItem.to}
                      className={({ isActive }) =>
                        `block p-3 pl-10 transition-all duration-300 ease-in-out ${isActive ? 'border-l-4' : ''}`
                      }
                      style={({ isActive }) => linkStyles(isActive)}
                    >
                      {subItem.label}
                    </NavLink>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem className="m-0 p-0 border-b" style={{ borderColor: theme.accent.light }}>
      <SidebarMenuButton asChild>
        <NavLink
          to={to}
          className={({ isActive }) =>
            `w-full text-left p-3 transition-all duration-300 ease-in-out flex items-center gap-3 ${
              isActive ? 'font-medium border-l-4 pl-2' : 'hover:border-l-4 hover:pl-2'
            }`
          }
          style={({ isActive }) => linkStyles(isActive)}
        >
          <Icon
            size={18}
            style={{
              color: location.pathname.includes(to.split('/').pop()) ? theme.primary.main : theme.text.secondary,
              transform: location.pathname.includes(to.split('/').pop()) ? 'scale(1.1)' : 'scale(1)',
            }}
          />
          <span>{label}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default SidebarItem;