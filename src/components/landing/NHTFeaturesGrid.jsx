import React from 'react';
import { ThumbsUp, Users, ShoppingCart, TrendingUp } from 'lucide-react';

const NHTFeaturesGrid = () => {
  const features = [
    {
      title: "Ready to Go",
      description: "Complete turnkey site and almost fully customizable as per need",
      icon: <ThumbsUp size={28} />
    },
    {
      title: "Leads",
      description: "Generate leads worldwide and make them future distributors",
      icon: <Users size={28} />
    },
    {
      title: "Sales",
      description: "Product ready site helps you to sell more and earn good retail profit",
      icon: <ShoppingCart size={28} />
    },
    {
      title: "Grow Big",
      description: "Get growth like never before. Internet gives you real potential",
      icon: <TrendingUp size={28} />
    }
  ];

  return (
    <div className="px-4 py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-medium text-center mb-12 text-black ">
          A Platform Which Will Rock Your NHT Global Business
        </h2>
        
        <div className="flex flex-wrap justify-center">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="w-full sm:w-1/2 lg:w-1/4 p-3"
            >
              <div className="h-full   p-6 shadow-md   flex flex-col">
                <div className="bg-gray-900 text-white p-3 rounded-full inline-flex items-center justify-center mb-4 self-center">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-medium mb-2 text-black self-center">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 flex-grow text-center">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NHTFeaturesGrid;