import React from 'react';
import { Button } from '@/components/ui/button';

const NHTGlobalOpportunity = () => {
    return (
        <div className="w-full bg-white py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left side content */}
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-medium  mb-4 text-black">
                            NHT Global Business Opportunity
                        </h2>

                        <p className="text-gray-700 leading-relaxed">
                            This ready-made site is only applicable if you are an NHT Global Independent Distributor. NHT Global is a Global company committed to wellness of people across the globe.
                        </p>

                        <div className="space-y-4">
                            <h3 className="text-xl font-medium text-gray-900">Key Benefits:</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start">
                                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-900 flex items-center justify-center mr-2">
                                        <span className="text-white text-sm">✓</span>
                                    </span>
                                    <span className="text-gray-700">Numerous highly effective wellness, beauty, herbal and lifestyle products</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-900 flex items-center justify-center mr-2">
                                        <span className="text-white text-sm">✓</span>
                                    </span>
                                    <span className="text-gray-700">Unmatched opportunity to earn additional income through network marketing</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-900 flex items-center justify-center mr-2">
                                        <span className="text-white text-sm">✓</span>
                                    </span>
                                    <span className="text-gray-700">Discounted products for distributors</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-900 flex items-center justify-center mr-2">
                                        <span className="text-white text-sm">✓</span>
                                    </span>
                                    <span className="text-gray-700">A proven system to introduce more people to the business</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-900 flex items-center justify-center mr-2">
                                        <span className="text-white text-sm">✓</span>
                                    </span>
                                    <span className="text-gray-700">Earnings based on both your individual and team efforts</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gray-100 p-6 rounded-sm border border-gray-200">
                            <p className="text-gray-800 italic">
                                "Once you become a distributor, you may get discounted products and a system to introduce more people in business like you. You will earn with your effort as well as your team efforts."
                            </p>
                        </div>

                        <div className="pt-4">
                            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2  text-sm cursor-pointer ">
                                Become A Distributor Today
                            </Button>
                        </div>
                    </div>

                    {/* Right side image */}
                    <div className="relative h-full">
                        <div className="relative h-64 sm:h-80 lg:h-full">
                            <img
                                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="NHT Global Business Opportunity"
                                className="w-full h-full object-cover rounded-xl shadow-xl"
                            />
                            <div className="absolute inset-0 ring-1 ring-inset ring-gray-900/10 rounded-xl"></div>
                        </div>

                        <div className="absolute -bottom-6 -left-6 bg-gray-900 text-white p-4 rounded-lg shadow-lg hidden md:block">
                            <p className="font-sm">Join our growing team of</p>
                            <p className="text-2xl font-medium">10,000+ Distributors</p>
                            <p className="text-sm mt-1">worldwide and counting</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NHTGlobalOpportunity;