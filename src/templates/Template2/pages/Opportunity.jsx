import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

function Opportunity() {
  const carouselItems = [
    { id: 1, text: 'Unlock Your Potential', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop' },
    { id: 2, text: 'Build Your Future', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2070&auto=format&fit=crop' },
    { id: 3, text: 'Join a Global Community', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Carousel */}
      <section aria-label="NHT Global Opportunity Highlights" className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {carouselItems.map((banner) => (
              <CarouselItem key={banner.id}>
                <div className="relative h-56 sm:h-64 md:h-80 lg:h-[450px] overflow-hidden">
                  <img
                    src={banner.image}
                    alt={`${banner.text} - NHT Global Opportunity`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
                  <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 text-white text-center px-4">
                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold drop-shadow-md">
                      {banner.text}
                    </h1>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 sm:left-4" />
          <CarouselNext className="right-2 sm:right-4" />
        </Carousel>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Welcome Section */}
        <section className="mb-8 sm:mb-10 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 mb-4 sm:mb-6">
            Welcome to the NHT Global Opportunity
          </h2>
          <div className="w-16 sm:w-24 h-1 bg-teal-600 mx-auto mb-4 sm:mb-6"></div>
          <p className="text-sm sm:text-md md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the world’s premier network marketing company designed to help you achieve your goals—whether it’s extra income or a career change.
          </p>
        </section>

        {/* Opportunity Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <div className="relative h-64 sm:h-72 md:h-[400px] overflow-hidden rounded-lg">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2070&auto=format&fit=crop"
              alt="Open the Door of Opportunity - NHT Global"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center md:text-left">
              Open the Door of Opportunity
            </h2>
            <ul className="space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-md md:text-lg">
              <li className="flex items-start gap-2"><span className="text-teal-600">•</span> Shape your destiny.</li>
              <li className="flex items-start gap-2"><span className="text-teal-600">•</span> Build your future.</li>
              <li className="flex items-start gap-2"><span className="text-teal-600">•</span> Create a healthy lifestyle.</li>
              <li className="flex items-start gap-2"><span className="text-teal-600">•</span> Build wealth.</li>
              <li className="flex items-start gap-2"><span className="text-teal-600">•</span> Promote global wellness.</li>
              <li className="flex items-start gap-2 italic font-semibold"><span className="text-teal-600">•</span> Join a leading network.</li>
            </ul>
            <div className="mt-4 sm:mt-6 text-center md:text-left">
              <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-4 sm:px-6 py-2 sm:py-3 font-semibold">
                <Link to="/learn-more">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Opportunity;