import React from 'react';
import { Globe, Code, Settings, User, ShoppingBag, Mail, Database, Smartphone, FileText, BookOpen, Server, Shield } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      title: "Save Hosting Cost",
      description: "Get out of hosting challenges. No need of hosting your site anywhere else and pay higher high fees and other related services.",
      icon: <Globe size={24} />
    },
    {
      title: "No Script or Web Design",
      description: "No Script or Web DesignNo Script or Web DesignNo Script or Web Design",
      icon: <Code size={24} />
    },
    {
      title: "Customize Everything",
      description: "Almost every element can be completely customized, helping you modify anything. You may change each page on site, update videos, add, change or modify products & many more.",
      icon: <Settings size={24} />
    },
    {
      title: "User Back Office",
      description: "An interactive back office to modify your site at every angle and contact details. You can broadcast bulk mail to your leads or subscribers.",
      icon: <User size={24} />
    },
    {
      title: "Product Ready",
      description: "All products are already uploaded from each region with buy option button. Just update your distributor link and sell more products and earn retail profit.",
      icon: <ShoppingBag size={24} />
    },
    {
      title: "Capture Leads & Autoresponder",
      description: "All the leads get stored in back office who register on your site. Prebuilt mails automatically delivered on periodic interval to keep them engaged. Modify or broadcast your own messages too.",
      icon: <Mail size={24} />
    },
    {
      title: "Independent Domain",
      description: "You may choose subdomain we provide or buy your preferred domain. Publish the site at your domain name like www.MyWebsite.com",
      icon: <Database size={24} />
    },
    {
      title: "Mobile Responsive",
      description: "All your site is mobile responsive. Visitor on your site can have different experiences for desktop and mobile. It generates possibility to convert visitor a lead or customer.",
      icon: <Smartphone size={24} />
    },
    {
      title: "Your Own Blog",
      description: "There is a already set blog for you to write something about your business,your experience, your events your attended to catch the audience. Also it helps your site to rank higher on google.",
      icon: <FileText size={24} />
    },
    {
      title: "Training Feed",
      description: "Get training material like presentation, videos, documents etc to learn more about business and tools to grow your team. All available in backoffice and it gets regularly updated for you.",
      icon: <BookOpen size={24} />
    },
    {
      title: "99.99% Uptime & Fast Speed",
      description: "Always running system with almost no downtime. High server speed for faster page download for your visitors to quickly grab their attention.",
      icon: <Server size={24} />
    },
    {
      title: "Compliant",
      description: "All subsites are compliant with NHT Global policies and practice. It contains all types of disclaimers as footer on all pages. All logos are added with phrase of Independent Distributors and many more. Explore more on Demo site.",
      icon: <Shield size={24} />
    }
  ];

  return (
    <div className="bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium text-center mb-12 text-black">
          Check Out Future Ready Features
        </h2>
        
        <div className="space-y-12">
          {/* Generate pairs of features */}
          {Array.from({ length: features.length / 2 }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex flex-col md:flex-row gap-8">
              {/* Left feature */}
              <div className="w-full md:w-1/2">
                <div className=" p-6 rounded-lg  h-full ">
                  <div className="flex items-start mb-4">
                    <div className="bg-black rounded text-white p-2  mr-4 flex-shrink-0">
                      {features[rowIndex * 2].icon}
                    </div>
                    <h3 className="text-xl font-sm text-black">
                      {features[rowIndex * 2].title}
                    </h3>
                  </div>
                  <p className="text-gray-600 ml-12">
                    {features[rowIndex * 2].description}
                  </p>
                </div>
              </div>
              
              {/* Right feature */}
              {rowIndex * 2 + 1 < features.length && (
                <div className="w-full md:w-1/2">
                  <div className=" p-6   h-full ">
                    <div className="flex items-start mb-4">
                      <div className="bg-black text-white p-2 rounded mr-4 flex-shrink-0">
                        {features[rowIndex * 2 + 1].icon}
                      </div>
                      <h3 className="text-xl font-sm text-black">
                        {features[rowIndex * 2 + 1].title}
                      </h3>
                    </div>
                    <p className="text-gray-600 ml-12">
                      {features[rowIndex * 2 + 1].description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;