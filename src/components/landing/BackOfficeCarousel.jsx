import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BackOfficeCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Sample images for the carousel
    const slides = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            alt: "NHT Global Back Office Dashboard",
            caption: "Comprehensive Dashboard"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1520110120835-c96534a4c984?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            alt: "NHT Global Team Performance",
            caption: "Team Performance Tracking"
        },
        {
            id: 3,
            image: "https://plus.unsplash.com/premium_photo-1661288434842-8d8af4e5f4a3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            alt: "NHT Global Commission Reports",
            caption: "Detailed Commission Reports"
        },
        {
            id: 4,
            image: "https://plus.unsplash.com/premium_photo-1661581918663-e1deff075069?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            alt: "NHT Global Marketing Tools",
            caption: "Marketing Tools and Resources"
        }
    ];

    // Auto-rotate slides
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const goToPrevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
    };

    const goToNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    };

    return (
        <div className="w-full bg-gray-100 py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-medium  mb-4 text-black">
                        Sneak Peek of Back Office
                    </h2>
                    <p className="mt-3 text-lg text-gray-600">
                        Explore the powerful tools available to NHT Global distributors
                    </p>
                </div>

                <div className="relative rounded-xl overflow-hidden shadow-xl bg-white">
                    {/* Carousel container */}
                    <div className="relative h-64 sm:h-96 overflow-hidden">
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                    }`}
                            >
                                <img
                                    src={slide.image}
                                    alt={slide.alt}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-3 sm:p-4">
                                    <p className="text-sm sm:text-xl font-sm">{slide.caption}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Previous/Next buttons */}
                    <button
                        className="absolute top-1/2 left-4 z-20 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full p-2 focus:outline-none transition-all"
                        onClick={goToPrevSlide}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                        className="absolute top-1/2 right-4 z-20 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white rounded-full p-2 focus:outline-none transition-all"
                        onClick={goToNextSlide}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                  
                </div>

               
            </div>
        </div>
    );
};

export default BackOfficeCarousel;