import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, MapPin } from 'lucide-react'; // Fixed icon name from Pin to MapPin

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    message: '',
    captcha: ''
  });

  const carouselItems = [
    {
      id: 1,
      text: "Get in Touch",
      image: "https://images.unsplash.com/photo-1557426272-fc91fdb8f385?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 2,
      text: "We’re Here to Help",
      image: "https://images.unsplash.com/photo-1516321310766-16f15db3248e?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 3,
      text: "Connect With Us",
      image: "https://images.unsplash.com/photo-1528747045269-390fe33c19f2?q=80&w=2070&auto=format&fit=crop"
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, country: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here (e.g., API call)
    setFormData({ name: '', email: '', phone: '', country: '', message: '', captcha: '' });
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Carousel */}
      <section aria-label="Contact Us Highlights" className="relative w-full">
        <Carousel className="w-full">
          <CarouselContent>
            {carouselItems.map((banner) => (
              <CarouselItem key={banner.id}>
                <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] w-full overflow-hidden">
                  <img
                    src={banner.image}
                    alt={`${banner.text} - NHT Global`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-white">
                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold drop-shadow-md">
                      {banner.text}
                    </h1>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 sm:left-4 top-1/2 -translate-y-1/2" />
          <CarouselNext className="right-2 sm:right-4 top-1/2 -translate-y-1/2" />
        </Carousel>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-grow">
        {/* Contact Form Section */}
        <section className=" p-6 sm:p-8 mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-gray-800 mb-4 text-center">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg text-gray-700 text-center mb-6 sm:mb-8 max-w-2xl mx-auto">
            We’d love to hear from you! Fill out the form below to get in touch.
          </p>
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone No.
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full"
                    required
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <Select
                    value={formData.country}
                    onValueChange={handleSelectChange}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usa">USA</SelectItem>
                      <SelectItem value="canada">Canada</SelectItem>
                      <SelectItem value="uk">UK</SelectItem>
                      <SelectItem value="india">India</SelectItem>
                      {/* Add more countries as needed */}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Enter your message"
                    className="w-full"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="captcha" className="block text-sm font-medium text-gray-700 mb-1">
                    Captcha Code
                  </label>
                  <Input
                    id="captcha"
                    name="captcha"
                    value={formData.captcha}
                    onChange={handleChange}
                    placeholder="Enter the captcha code"
                    className="w-full"
                    required
                  />
                  <div className="mt-2 bg-gray-200 h-10 flex items-center justify-center text-gray-500 text-sm rounded">
                    CAPTCHA Placeholder (e.g., 5 + 3 = ?)
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                type="submit"
                className="bg-gray-900 hover:bg-gray-800 text-white py-2 px-6 sm:py-3 sm:px-8 rounded-md transition-transform duration-200 hover:scale-105"
              >
                Send Message
              </Button>
            </div>
          </form>
        </section>

        {/* Contact Info Section */}
        <section className="flex flex-col md:flex-row gap-6 sm:gap-8">
          {/* Left Side: Image */}
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
              alt="Contact NHT Global Team"
              className="w-full h-64 sm:h-72 md:h-96 object-cover rounded-lg shadow-md"
              loading="lazy"
            />
          </div>

          {/* Right Side: Contact Details */}
          <div className="md:w-1/2 flex flex-col justify-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
              Reach Out to Us
            </h2>
            <ul className="space-y-3 text-gray-700 text-base sm:text-md">
              <li className="flex items-center gap-3">
                <span className="text-gray-900">📧</span>
                <span>
                  Email: <a href="mailto:support@nhtglobal.com" className="hover:text-gray-900 transition-colors">support@nhtglobal.com</a>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-900" />
                <span>Phone: +1 (800) 555-1234</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-900" />
                <span>Address: 123 Wellness Ave, Health City, USA</span>
              </li>
            </ul>
            <p className="mt-4 text-gray-700 text-base sm:text-md">
              Available Monday to Friday, 9 AM - 5 PM (EST). We’re excited to assist you!
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Contact;