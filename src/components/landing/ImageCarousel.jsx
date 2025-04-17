import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const ImageCarousel = () => {
  // Sample images - replace with your actual image paths
  const images = [
    {
      src: "https://images.unsplash.com/photo-1651629679477-82cab6ec3443?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Feature 1",
      description: "Description of this amazing back office feature."
    },
    {
      src: "https://images.unsplash.com/photo-1617322362635-f93955761051?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Feature 2",
      description: "Powerful tools to manage your business efficiently."
    },
    {
      src: "https://images.unsplash.com/photo-1652787930569-f6458f6563f6?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Feature 3",
      description: "Track your performance with advanced analytics."
    },
    {
      src: "https://images.unsplash.com/photo-1605826832916-d0ea9d6fe71e?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Feature 4",
      description: "Customize every aspect of your online presence."
    },
    {
      src: "https://images.unsplash.com/photo-1579109652910-99b9be06aaec?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Feature 5",
      description: "Connect with prospects around the world."
    }
  ];

  return (
    <div className="bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-medium text-center mb-4 text-black">
          Your Identity. Market Your Site Address
        </h2>
        
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <Card className="border-0 ">
                  <CardContent className="p-0 relative">
                    <img 
                      src={image.src} 
                      alt={image.title} 
                      className="w-full h-90 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-gray-800 to-transparent p-6
">
                      <p className="text-white text-xl font-medium">
                        {image.title}
                      </p>
                      <p className="text-blue-100">
                        {image.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 bg-white/80 hover:bg-white text-blue-900 border-0" />
          <CarouselNext className="right-2 bg-white/80 hover:bg-white text-blue-900 border-0" />
        </Carousel>
      </div>
    </div>
  );
};

export default ImageCarousel;