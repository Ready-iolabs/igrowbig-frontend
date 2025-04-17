import React from 'react';
import { Share2, MessageCircle, Printer, Megaphone } from 'lucide-react';

const MarketingChannels = () => {
  const channels = [
    {
      title: "Social Media",
      description: "Facebook, Instagram, Youtube & others",
      icon: <Share2 size={20} />
    },
    {
      title: "Interactions",
      description: "Emails, Blog, Text, Whatsapp Conversations",
      icon: <MessageCircle size={20} />
    },
    {
      title: "Print",
      description: "Business Card, Brochures, Fliers and many more",
      icon: <Printer size={20} />
    },
    {
      title: "Ads",
      description: "All types of online/offline advertisement",
      icon: <Megaphone size={20} />
    }
  ];

  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium text-center mb-4 text-black">
          Your Identity. Market Your Site Address
        </h2>
        
        <div className="flex flex-wrap -mx-4 mt-10">
          {channels.map((channel, index) => (
            <div key={index} className="w-full md:w-1/2 lg:w-1/4 px-4 mb-8">
              <div className=" rounded-sm p-6 h-full shadow-sm ">
                <div className="flex items-center mb-4 flex-col justify-center gap-7 ">
                  <div className="bg-black text-white p-3 rounded-lg mr-4">
                    {channel.icon}
                  </div>
                  <h3 className="text-xl font-sm text-black">
                    {channel.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 text-center">
                  {channel.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketingChannels;