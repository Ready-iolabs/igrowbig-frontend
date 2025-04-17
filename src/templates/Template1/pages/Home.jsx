import React from 'react';

import { Carousel ,CarouselContent,CarouselItem} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import TestimonialsSection from './TestimonialsSection';
import { BookOpen, CircleEllipsis, User, ArrowRight } from 'lucide-react';

// Editable Banner Data
const banners = [
    {
        id: 1,
        image: 'https://dev.bitwisewebsolution.in/igb/access/uploads/1/banner_412380163041569773274.jpg',
        description: 'We Are In 38 Countries, Looking For 100 More. Open New Markets With Us.',
        ctaText: 'Shop Now',
        ctaLink: '/shop/omega-3',
    },
    {
        id: 2,
        image: 'https://dev.bitwisewebsolution.in/igb/access/uploads/1/banner_311196308561569773259.jpg',
        description: 'Great Support System By Industry Top Leaders Committed To Your Success.',
        ctaText: 'Shop Now',
        ctaLink: '/shop/slim-shake',
    },
    {
        id: 3,
        image: 'https://dev.bitwisewebsolution.in/igb/access/uploads/1/banner_22205257861569773244.jpg',
        description: 'True Business Opportunity to Achieve True Success',
        ctaText: 'Shop Now',
        ctaLink: '/shop/immune-shield',
    },
    {
        id: 4,
        image: 'https://dev.bitwisewebsolution.in/igb/access/uploads/1/banner_115024801361569773184.jpg',
        description: 'Great Products With Great Results! Scientific And Research Based Products With Patented Technologies.',
        ctaText: 'Shop Now',
        ctaLink: '/shop/immune-shield',
    },
];

function Home() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Carousel */}
            <section aria-label="Featured Wellness Products" className="relative">
                <Carousel className="w-full">
                    <CarouselContent>
                        {banners.map((banner) => (
                            <CarouselItem key={banner.id}>
                                <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
                                    <img
                                        src={banner.image}
                                        alt={`NHT Global - ${banner.description}`}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 text-white p-4 sm:p-6 md:p-8">
                                        <p className="text-xs sm:text-sm md:text-lg lg:text-xl font-medium drop-shadow-lg mb-4 max-w-3xl mx-auto text-center">
                                            {banner.description}
                                        </p>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                   
                </Carousel>
            </section>

            {/* Welcome Section */}
            <section
                aria-label="Welcome to NHT Global"
                className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-16 bg-gradient-to-b from-indigo-50 to-white"
            >
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium mb-4 sm:mb-6 text-teal-900">
                        Welcome to Our World of Opportunities
                    </h2>
                    <p className="text-sm sm:text-md md:text-lg leading-relaxed mb-6 sm:mb-8 text-gray-700 px-2">
                        We help people attain a better lifestyle, healthy living, sound financial stability, and enriching personal relationships—plus the freedom to spend your time enjoying what makes you happy.
                    </p>
                    <Button
                        asChild
                        className="bg-teal-900 hover:bg-teal-600 text-white transition-all duration-300 rounded-md px-4 py-2 sm:px-6 sm:py-3"
                    >
                        <Link to="/join-us" className="flex items-center justify-center gap-2">
                            Join Us Today <User   />
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Distributor Section */}
            <section
                aria-label="Message from John Ray"
                className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-16 bg-gradient-to-r from-teal-50 to-white"
            >
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium mb-4 sm:mb-5 text-gray-900 text-center tracking-tight">
                        A Message from John Ray
                    </h2>
                    <div className="w-16 sm:w-24 h-1 bg-black mx-auto mb-6"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
                        <div className="order-1 md:order-2 relative h-64 sm:h-72 md:h-[400px] lg:h-[500px] overflow-hidden rounded-xl shadow-2xl">
                            <img
                                src="https://plus.unsplash.com/premium_photo-1733328013343-e5ee77acaf05?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Team collaborating on business opportunity"
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                loading="lazy"
                            />
                        </div>

                        <div className="order-2 md:order-1 flex flex-col justify-center">
                            <div className="space-y-6 sm:space-y-9 text-gray-700">
                                <p className="text-sm sm:text-md md:text-lg leading-relaxed">
                                    <span className="font-medium text-gray-900">Hi, I’m John Ray</span>, an independent
                                    distributor of NHT Global. We’re a global network marketing company dedicated to
                                    helping people achieve better health and build passive income.
                                </p>
                                <p className="text-sm sm:text-md md:text-lg leading-relaxed">
                                    No need to manage products, inventory, shipping, or customer care—just refer
                                    people to our products and business. You’ll get your own e-commerce site with the
                                    backend handled by NHT Global.
                                </p>
                            </div>
                            <div className="mt-4 sm:mt-5 text-center md:text-left">
                                <p className="text-sm sm:text-md md:text-lg text-gray-600 mb-4 italic">
                                    Curious? Explore more on this page.
                                </p>
                                <Button
                                    asChild
                                    className="text-white rounded-md px-4 py-2 sm:px-6 sm:py-3 font-medium shadow-md transition-all duration-300"
                                >
                                    <Link to="/learn-more" className="flex items-center justify-center gap-2">
                                        Learn More <CircleEllipsis  />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About NHT Global Section */}
            <section
                aria-label="About NHT Global"
                className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-16 bg-gradient-to-r from-teal-50 to-white"
            >
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium mb-4 sm:mb-5 text-teal-900 text-center tracking-tight">
                        About NHT Global
                    </h2>
                    <div className="w-16 sm:w-24 h-1 bg-teal-900 mx-auto mb-6"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 lg:gap-14 items-center">
                        <div className="order-2 md:order-1 flex flex-col justify-center">
                            <ol className="text-sm sm:text-md md:text-lg leading-relaxed mb-6 sm:mb-8 text-gray-700 list-decimal pl-4 sm:pl-6 space-y-3 sm:space-y-4">
                                <li className="font-medium">Proven company with a record-breaking history since 2001.</li>
                                <li className="font-medium">Revolutionary e-commerce business model.</li>
                                <li className="font-medium">Operating in over 38 countries.</li>
                                <li className="font-medium">High-impact products for a healthy lifestyle.</li>
                                <li>
                                    <span className="font-medium">A balanced healthy lifestyle through:</span>
                                    <ul className="list-disc pl-4 sm:pl-6 mt-2 space-y-2 text-gray-600 text-sm sm:text-md">
                                        <li>Physical health</li>
                                        <li>Emotional health</li>
                                        <li>Financial health</li>
                                    </ul>
                                </li>
                                <li className="font-medium">Training system for your success.</li>
                            </ol>
                            <Button
                                asChild
                                className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-4 py-2 sm:px-6 sm:py-3 font-semibold shadow-lg transition-all duration-300 w-fit mx-auto md:mx-0"
                            >
                                <Link to="/about" className="flex items-center justify-center gap-2">
                                    Discover More <CircleEllipsis  />
                                </Link>
                            </Button>
                        </div>

                        <div className="order-1 md:order-2 relative h-64 sm:h-72 md:h-[400px] lg:h-[500px] overflow-hidden rounded-xl shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Healthy lifestyle and wellness"
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    <div className="mt-8 sm:mt-12 p-6 sm:p-8 bg-white border border-teal-100 shadow-md rounded-2xl italic max-w-3xl sm:max-w-4xl mx-auto">
                        <p className="text-sm sm:text-md md:text-lg leading-relaxed text-gray-700 text-center">
                            <span className="font-semibold font-serif text-teal-800">NHT Global’s mission</span> is to
                            enhance how you feel about yourself and your work with quality-of-life products and a lucrative compensation plan.
                        </p>
                    </div>
                </div>
            </section>

            {/* Why Network Marketing Section */}
            <section
                aria-label="Why Network Marketing"
                className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-16 bg-gradient-to-b from-indigo-50 to-white"
            >
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium mb-4 sm:mb-5 text-center tracking-tight">
                        Why Network Marketing?
                    </h2>
                    <div className="w-16 sm:w-24 h-1 bg-black mx-auto mb-6"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 lg:gap-14 items-center">
                        <div className="order-2 md:order-1 relative h-64 sm:h-72 md:h-[400px] lg:h-[500px] overflow-hidden rounded-xl shadow-2xl">
                            <div
                                className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-105"
                                style={{
                                    backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
                                    backgroundAttachment: 'fixed',
                                    backgroundPosition: 'center',
                                }}
                            ></div>
                        </div>

                        <div className="order-1 md:order-2 flex flex-col justify-center">
                            <ol className="text-sm sm:text-md md:text-lg leading-relaxed mb-6 sm:mb-8 text-gray-700 list-decimal pl-4 sm:pl-6 space-y-3 sm:space-y-4">
                                <li className="font-medium">Over 50 years of direct selling history.</li>
                                <li className="font-medium">A $110 billion global industry.</li>
                                <li className="font-medium">Active in more than 172 countries.</li>
                                <li className="font-medium">Inclusive of all backgrounds.</li>
                                <li className="font-medium">Empowers millions globally.</li>
                                <li className="font-medium">Offers high income potential.</li>
                                <li className="font-medium">Be your own boss.</li>
                                <li className="font-medium">No high overhead.</li>
                                <li className="font-medium">A limitless global opportunity.</li>
                            </ol>
                            <Button
                                asChild
                                className="text-white rounded-lg px-4 py-2 sm:px-6 sm:py-3 font-semibold shadow-lg transition-all duration-300 w-fit mx-auto md:mx-0"
                            >
                                <Link to="/network-marketing" className="flex items-center justify-center gap-2">
                                    Explore Now <BookOpen  />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
{/* <TestimonialsSection/> */}
         
        </div>
    );
}

export default Home;