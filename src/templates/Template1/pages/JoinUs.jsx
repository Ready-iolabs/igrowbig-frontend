import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

function JoinUs() {
  const carouselItems = [
    {
      id: 1,
      text: "Start Your Journey",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 2,
      text: "Achieve Your Dreams",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 3,
      text: "Join the NHT Family",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Carousel */}
      <section aria-label="Join Us Highlights" className="relative w-full">
        <Carousel className="w-full">
          <CarouselContent>
            {carouselItems.map((banner) => (
              <CarouselItem key={banner.id}>
                <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] w-full overflow-hidden">
                  <img
                    src={banner.image}
                    alt={`${banner.text} - NHT Global`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-white">
                    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold drop-shadow-md">
                      {banner.text}
                    </h1>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 sm:left-4 top-1/2 -translate-y-1/2" />
          <CarouselNext className="right-2 sm:right-4 top-1/2 -translate-y-1/2" />
        </Carousel>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-8 sm:py-12 flex-grow">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-gray-800 text-center mb-6">
          Join Us Today
        </h1>
        <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed text-center">
          You're just steps away from starting your own business and achieving success. We’re here to support you every step of the way. Contact us for any assistance or questions.
        </p>

        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-800 text-center">
            How to Get Started
          </h2>
          <div className="space-y-4 text-base sm:text-lg text-gray-700 leading-relaxed text-center">
            <p>
              Click <strong>Enrollment</strong> below and follow the steps. Choose your package from the <Link to="/compensation-plan" className="text-gray-900 font-semibold hover:underline">Compensation Plan</Link> page. Contact us for support.
            </p>
            <p>
              After payment, you’ll become an NHT Global distributor instantly. Check your email for details, then log in to your back office to track your package and business growth.
            </p>
            <p>
              If your country isn’t listed, become a pioneer in a new market. <Link to="/contact" className="text-gray-900 font-semibold hover:underline">Contact us</Link> to get started.
            </p>
          </div>
          <div className="flex justify-center mt-6">
            <Button
              asChild
              className="bg-gray-900 hover:bg-gray-800 text-white py-2 px-6 sm:py-3 sm:px-8 rounded-md transition-transform duration-200 hover:scale-105"
            >
              <Link to="/enrollment">Enroll Now</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-800 text-center">
            Need Help?
          </h2>
          <p className="text-base sm:text-lg text-gray-700 text-center ">
            For queries or support, reach out to us. If your country isn’t listed, explore the opportunity to pioneer with NHT Global.
          </p>
          <div className="flex justify-center mt-6">
            <Button
              asChild
              className="bg-gray-900 hover:bg-gray-800 text-white py-2 px-6 sm:py-3 sm:px-8 rounded-md transition-transform duration-200 hover:scale-105"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinUs;