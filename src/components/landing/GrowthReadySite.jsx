import React from 'react';
import { Button } from '../ui/button';
import { StepForward } from 'lucide-react';

const GrowthReadySite = () => {
    return (
        <div className="bg-gray-50 py-16">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center px-4">

                {/* Left side content */}
                <div className="w-full lg:w-1/2 lg:pr-12 mb-8 lg:mb-0">
                    <h2 className="text-3xl md:text-4xl font-medium text-black mb-6">
                        Your Growth Ready Site
                    </h2>

                    <p className="text-gray-700 mb-6 leading-relaxed">
                        Think about your own site with all features without being a technology expert. No issue of hosting, designing or any kind of development.
                    </p>

                    <p className="text-gray-700 mb-8 leading-relaxed">
                        You will love the features and functions which gives you power to meet your potential. With minimum effort, you can upgrade your sales and have more distributors. It will help you grow your business to next height.
                    </p>

                    <Button size='lg'  className="bg-black text-white  py-3 px-6 rounded-md font-medium cursor-pointer  transition duration-300 w-max">
                        Demo Site <StepForward/>
                    </Button>
                </div>

                {/* Right side image - fixed scaling */}
                <div className="w-full lg:w-1/2">
                    <div className="relative">
                        <div className="relative bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                            <img
                                src="https://images.unsplash.com/photo-1537498425277-c283d32ef9db?q=80&w=2078&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="NHT Global Growth Platform"
                                className="w-full h-full object-cover max-h-96"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GrowthReadySite;