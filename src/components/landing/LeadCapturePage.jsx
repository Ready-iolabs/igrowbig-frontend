import React from "react";
import { Button } from "../ui/button";
import { StepForward } from "lucide-react";

const LeadCapturePage = () => {
  return (
    <div className="bg-black py-16">
      <h2 className="text-4xl font-medium text-center mb-12 text-white">
        Get Super Bonus with Below Features
      </h2>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center px-4 gap-20">
        {/* Image Section */}
        <div className="w-full lg:w-1/2">
          <div className="relative bg-gray-200 rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1537498425277-c283d32ef9db?q=80&w=2078&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="NHT Global Growth Platform"
              className="w-full h-full object-cover max-h-96"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
          <h3 className="text-2xl md:text-4xl font-sm text-white mb-6">
            Lead Capture Page
          </h3>

          <p className="text-white mb-6 leading-relaxed">
          Subscribe section to capture leads or prospects to follow up to buy your product or join your team. All leads are get stored in back office and you may send mail to all in one go.
          </p>

         

          <Button size='lg' variant='outline' className="bg-black cursor-pointer text-white py-3 px-6 rounded-md font-medium flex items-center gap-2 transition duration-300">
            Demo Site <StepForward size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeadCapturePage;
