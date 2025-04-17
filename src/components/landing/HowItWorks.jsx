import React from 'react';
import { UserPlus, Settings, Rocket } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      title: "Register",
      description: "Register and activate your very own URL or sub-domain. Attract more prospects on your personalized site and let them contact you and learn more about your opportunity.",
      icon: <UserPlus size={20} />
    },
    {
      title: "Customize",
      description: "Enter basic details in your back-office: your website name, personal details, logo and distributor info. It contains pre-loaded products, opportunity, blog etc. and it is 100% customizable.",
      icon: <Settings size={20} />
    },
    {
      title: "Ready",
      description: "Hurray! You are ready and your site can now reach thousands of prospects worldwide. Promote your personalized site on different forums, meetings, social media and Grow Big.",
      icon: <Rocket size={20} />
    }
  ];

  return (
    <div className="bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium text-center mb-4 text-black">
          How it Works, What you have to do
        </h2>
        
        <div className="flex flex-col md:flex-row gap-8 mt-12">
          {steps.map((step, index) => (
            <div key={index} className="w-full md:w-1/3">
              <div className="bg-gray-50  p-6 h-full shadow-sm  ">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="bg-black text-white p-4 rounded-full mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-sm text-black">
                    {step.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 text-center">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;