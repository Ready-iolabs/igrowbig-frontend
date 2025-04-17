import React, { useState } from 'react';
import { Mail, Facebook, Twitter, Youtube, Instagram } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    // Basic client-side validation
    if (!email.trim()) {
      setMessage('Email is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/newsletters/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Subscription successful!');
        setEmail('');
      } else {
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Subscription Error:', error);
      setMessage('Failed to connect to the server. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-black text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Legal Links Section */}
          <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-medium mb-4">Legal</h3>
            <div className="flex flex-col space-y-1 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Earning Disclaimer
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Use
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Youtube size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-medium mb-4">Contact</h3>
            <div className="flex items-center space-x-2">
              <Mail size={18} className="text-gray-400" />
              <a href="mailto:support@igrowbig.com" className="text-gray-400 hover:text-white transition-colors">
                support@igrowbig.com
              </a>
            </div>
            <p className="text-gray-400">24 X 7 online support</p>
          </div>

          {/* Newsletter Section */}
          <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-medium mb-4">Newsletter Signup</h3>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-2">
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                  required
                />
                <Button
                  type="submit"
                  className="bg-gray-700 hover:bg-gray-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </div>
              {message && (
                <p
                  className={`text-sm ${
                    message.includes('successful') ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {message}
                </p>
              )}
              <p className="text-sm text-gray-400">
                Sign up to receive updates and exclusive offers
              </p>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} iGrowBig. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;