import { useState } from 'react';
import { CheckIcon } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function PricingSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Function to open the modal
    const handleBuyClick = () => {
        setIsModalOpen(true);
    };

    // Function to close the modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const features = [
        "Hosting",
        "Ready Design",
        "Customize Control",
        "Product Ready",
        "Broadcast Emails",
        "Autoresponder",
        "Independent Domain",
        "Mobile Responsive",
        "Your Own Blog",
        "Training Feed",
        "Lead Capture Page",
        "99.99% up Time"
    ];

    return (
        <div className="relative bg-gray-100 px-4 sm:px-6 lg:px-10 py-16">
            <div className="mx-auto max-w-6xl">
                <h2 className="text-3xl md:text-4xl font-medium text-center mb-4 text-black">
                    Many Features. Small Price
                </h2>
                <p className="text-center text-gray-600 mb-12">Everything you need to succeed, in one simple package</p>

                {/* All Features Section */}
                <div className="mb-16 bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-xl p-8 shadow-lg border border-gray-200
">
                    <h3 className="text-2xl font-medium text-white text-center mb-8">All Features Included</h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                                        <CheckIcon className="h-3 w-3 text-black" aria-hidden="true" />
                                    </div>
                                </div>
                                <span className="ml-3 text-sm font-medium text-white">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex flex-wrap gap-4 justify-center">
                        <span className="px-6 py-2  border-r-2 border-white  text-sm font-medium  text-white">No Hidden Fees</span>
                        <span className="px-4 py-2  text-sm font-medium text-white ">Super Low Cost to Start</span>
                    </div>
                </div>

                {/* Pricing Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Monthly Subscription */}
                    <div >
                        <div className="h-full flex flex-col justify-between w-full rounded-lg p-8 bg-gray-50 text-black border border-gray-200 shadow-lg">
                            <div>
                                <h3 className="text-xl font-medium">Monthly Subscription</h3>
                                <div className="mt-6 flex items-end gap-2">
                                    <span className="text-3xl font-medium tracking-tight text-black">$59</span>
                                    <span className="text-xl text-gray-600 line-through mb-1">$119</span>
                                    <span className="mb-1 ml-2 rounded-md bg-black px-2 py-1 font-medium text-white text-sm">
                                        50% OFF!
                                    </span>
                                </div>
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <p className="text-base text-gray-600">Full access for a month. Auto renews every month.</p>
                                </div>
                            </div>
                            <button
                                onClick={handleBuyClick}
                                className="mt-8 block w-full rounded cursor-pointer bg-black px-5 py-3 text-center text-sm font-semibold text-white shadow-md hover:bg-gray-800 transition-colors"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>

                    {/* Quarterly Subscription */}
                    <div >
                        <div className="h-full flex flex-col justify-between w-full rounded-lg p-8 bg-black text-white shadow-xl">
                            
                            <div>
                                <h3 className="text-xl font-medium">Quarterly Subscription</h3>
                                <div className="mt-6 flex items-end gap-2">
                                    <span className="text-3xl font-medium tracking-tight text-white">$129</span>
                                    <span className="text-xl text-gray-300 line-through mb-1">$319</span>
                                    <span className="mb-1 ml-2 rounded-md bg-white px-2 py-1 font-medium text-black text-sm">
                                        60% OFF!
                                    </span>
                                </div>
                                <div className="mt-6 pt-6 border-t border-gray-700">
                                    <p className="text-base text-gray-300">Full access for 3 months. Auto renews every 3 months.</p>
                                </div>
                            </div>
                            <button
                                onClick={handleBuyClick}
                                className="mt-8 block w-full rounded cursor-pointer bg-white px-5 py-3 text-center text-sm font-semibold text-black shadow-md hover:bg-gray-200 transition-colors"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal */}
                <AlertDialog open={isModalOpen} onOpenChange={handleCloseModal}>
                    <AlertDialogContent className="rounded-xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Payment Gateway Coming Soon!</AlertDialogTitle>
                            <AlertDialogDescription>
                                Our payment gateway is currently under development. Stay tuned for updates!
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={handleCloseModal} className="border-black rounded-lg">Close</AlertDialogCancel>
                            <AlertDialogAction onClick={handleCloseModal} className="bg-black text-white rounded-lg">OK</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}