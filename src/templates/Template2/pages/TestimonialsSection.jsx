import React from "react";

import { Star, Quote } from "lucide-react";
import { Carousel,CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious, } from "@/components/ui/carousel";
const TestimonialsSection = () => {
  // Sample testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      quote:
        "This platform transformed my business! The templates are easy to use, and the backoffice tools save me hours every week.",
      role: "Small Business Owner",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      quote:
        "The support and features are unmatched. I doubled my leads in just a month thanks to the lead capture system!",
      role: "Marketing Consultant",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      quote:
        "A game-changer for my online store. The e-commerce template is sleek and functional—my customers love it!",
      role: "E-Commerce Entrepreneur",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      rating: 4,
    },
    {
      id: 4,
      name: "James Carter",
      quote:
        "The flexibility and earning potential here are incredible. It's the best decision I've made for my career!",
      role: "Freelancer",
      avatar: "https://randomuser.me/api/portraits/men/78.jpg",
      rating: 5,
    },
  ];

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1 justify-center mt-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 bg-gradient-to-b from-indigo-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium text-teal-900 mb-4">
            What Our Users Say
          </h2>
          <div className="w-24 h-1 bg-teal-900 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from real people who've grown their businesses with our platform.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/2 p-2">
                  <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 h-full border border-gray-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="relative">
                      <Quote size={40} className="text-indigo-100 absolute -top-2 -left-2 opacity-50" />
                      <p className="text-gray-700 text-md md:text-lg leading-relaxed mb-6 relative z-10 pt-4">
                        "{testimonial.quote}"
                      </p>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-indigo-100 shadow-sm"
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {testimonial.name}
                            </h3>
                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                          </div>
                        </div>
                        
                        <div className="hidden md:block">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                      
                      <div className="md:hidden mt-4">
                        {renderStars(testimonial.rating)}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="flex items-center justify-center mt-8 gap-2">
              <CarouselPrevious className="relative left-0 right-0 bg-white hover:bg-indigo-50 border border-gray-200 static mx-2" />
              <CarouselNext className="relative left-0 right-0 bg-white hover:bg-indigo-50 border border-gray-200 static mx-2" />
            </div>
          </Carousel>
          
          
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;