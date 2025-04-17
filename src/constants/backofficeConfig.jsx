// D:\NHT GLOBAL\front\src\constants\backofficeConfig.js
import {
  Home,
  Package,
  Award,
  UserPlus,
  MessageSquare,
  FileText,
  Users,
  Globe,
  AtSign,
  Share2,
  FileCode,
  Mail,
  HelpCircle,
  BookCopy,
  Settings,
} from 'lucide-react';

export const theme = {
  primary: { main: '#101010', dark: '#000000', light: '#303030', hover: '#202020' },
  secondary: { main: '#FFFFFF', dark: '#E0E0E0', light: '#F8F8F8', hover: '#F0F0F0' },
  accent: { main: '#505050', light: '#D0D0D0', ultraLight: '#F5F5F5' },
  text: { primary: '#101010', secondary: '#505050', light: '#909090', onDark: '#E0E0E0' },
};

export const menuConfig = [
  { to: '/backoffice/dashboard', label: 'Dashboard', icon: Home }, // Added Dashboard here
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    subItems: [
      { to: '/backoffice/slider-banners', label: 'Sliders Banner' },
      { to: '/backoffice/welcome-message', label: 'Welcome Message' },
      { to: '/backoffice/introduction', label: 'Introduction' },
      { to: '/backoffice/about-company', label: 'About Company' },
      { to: '/backoffice/why-network-marketing', label: 'Network Marketing' },
      { to: '/backoffice/opportunity-video', label: 'Opportunity Video' },
      { to: '/backoffice/support-message', label: 'Support Message' },
    ],
  },
  {
    id: 'products',
    label: 'Products',
    icon: Package,
    subItems: [
      { to: '/backoffice/about-page', label: 'About Page' },
      { to: '/backoffice/categories', label: 'Categories' },
      { to: '/backoffice/products-list', label: 'Products' },
    ],
  },
  {
    id: 'opportunity',
    label: 'Opportunity',
    icon: Award,
    subItems: [
      { to: '/backoffice/opportunity/page-banner', label: 'Page Banner' },
      { to: '/backoffice/opportunity/page-content', label: 'Page Content' },
      { to: '/backoffice/opportunity/video-section', label: 'Video Section' },
      { to: '/backoffice/opportunity/compensation-plan', label: 'Compensation Plan' },
    ],
  },
  {
    id: 'join-us',
    label: 'Join Us',
    icon: UserPlus,
    subItems: [
      { to: '/backoffice/join-us/page-banner', label: 'Page Banner' },
      { to: '/backoffice/join-us/page-content', label: 'Page Content' },
    ],
  },
  { to: '/backoffice/contact-us', label: 'Contact Us', icon: MessageSquare },
  { to: '/backoffice/blogs', label: 'Blogs', icon: FileText },
  // { to: '/backoffice/leaders', label: 'Leaders', icon: Users },
  // { to: '/backoffice/global-opportunity', label: 'Global Opportunity', icon: Globe },
  // { to: '/backoffice/lead-capture', label: 'Lead Capture Page', icon: AtSign },
  { to: '/backoffice/social-media', label: 'Social Media', icon: Share2 },
  { to: '/backoffice/footer-disclaimer', label: 'Footer Disclaimer', icon: FileCode },
  { to: '/backoffice/subscriber-message', label: 'Subscriber Message', icon: Mail },
  { to: '/backoffice/notifications', label: 'Notifications', icon: HelpCircle },
  // { to: '/backoffice/testimonials', label: 'Testimonials', icon: BookCopy },
  { to: '/backoffice/settings', label: 'Settings', icon: Settings },
  {to : '/backoffice/training' , label:"Training" , icon:Settings}
];