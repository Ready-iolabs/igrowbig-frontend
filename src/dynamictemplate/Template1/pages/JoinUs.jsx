import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import {
  ArrowRight,
  Home,
  UserPlus,
  Phone,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const JoinUs = () => {
  const { slug } = useParams();
  const { getAll } = useTenantApi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAll(`/site/${slug}`);
        setData(response.site_data);
      } catch (err) {
        console.error("Error fetching join us data:", err);
        setError(err.message || "Failed to load information");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, getAll]);

  if (loading) {
    return <JoinUsPageSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-accent p-4">
        <div className="text-red-600 text-xl font-semibold mb-4">
          Unable to load information
        </div>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button asChild>
          <Link to={`/${slug}`}>
            <Home className="mr-2 h-4 w-4" />
            Return to Homepage
          </Link>
        </Button>
      </div>
    );
  }

  const joinUsPage = data?.join_us || {};
  const banners = [
    {
      id: 1,
      text: joinUsPage.image_banner_content || "Start Your Journey",
      image:
        joinUsPage.joinus_image_banner_url ||
        "https://via.placeholder.com/1200x400?text=Join+Us+Banner",
    },
  ];

  // Set default content values if they don't exist
  const section1Content = joinUsPage.section_content_1 || 
    "You're just steps away from starting your own business and achieving success. We're here to support you every step of the way.";
  const section2Content = joinUsPage.section_content_2 || 
    "Click <strong>Enrollment</strong> below and follow the steps. Contact us for support.";
  const section3Content = joinUsPage.section_content_3 || 
    "For queries or support, reach out to us. Explore the opportunity to pioneer with NHT Global.";

  return (
    <div className="bg-accent min-h-screen flex flex-col">
      

      {/* Hero Carousel */}
      <section aria-label="Join Us Highlights" className="relative w-full">
        <Carousel className="w-full">
          <CarouselContent>
            {banners.map((banner) => (
              <CarouselItem key={banner.id}>
                <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] w-full overflow-hidden">
                  <img
                    src={banner.image}
                    alt={`${banner.text} - NHT Global`}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                  <div className="absolute inset-0 flex items-center px-6 sm:px-12">
                    <div className="max-w-3xl">
                      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-sm text-white drop-shadow-lg">
                        {banner.text}
                      </h1>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
        </Carousel>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex-grow w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Join Us Today Card */}
          <Card className="border-none shadow-md transition-all duration-300 hover:shadow-lg overflow-hidden md:col-span-3">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent pb-4">
              <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 text-center">
                Join Us Today
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 pb-8">
              <div className="w-16 h-1 bg-primary mx-auto mb-6" />
              <ScrollArea className="h-auto max-h-40">
                <div
                  className="text-base sm:text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto"
                  dangerouslySetInnerHTML={{ __html: section1Content }}
                />
              </ScrollArea>
            </CardContent>
          </Card>

          {/* How to Get Started Card */}
          <Card className="border-none shadow-md transition-all duration-300 hover:shadow-lg overflow-hidden">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex justify-center mb-2">
                <div className="bg-primary/10 rounded-full p-2">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
                How to Get Started
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ScrollArea className="h-40">
                <div
                  className="text-base text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: section2Content }}
                />
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex justify-center pt-2 pb-6">
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-white py-2 px-6 rounded-md transition-all duration-300 hover:translate-y-[-2px]"
              >
                <Link to={`/${slug}/enrollment`} className="flex items-center">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Enroll Now
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Need Help Card */}
          <Card className="border-none shadow-md transition-all duration-300 hover:shadow-lg overflow-hidden">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex justify-center mb-2">
                <div className="bg-primary/10 rounded-full p-2">
                  <HelpCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ScrollArea className="h-40">
                <div
                  className="text-base text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: section3Content }}
                />
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex justify-center pt-2 pb-6">
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-white py-2 px-6 rounded-md transition-all duration-300 hover:translate-y-[-2px]"
              >
                <Link to={`/${slug}/contact`} className="flex items-center">
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Us
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Ready to Join Card */}
          <Card className="border-none shadow-md transition-all duration-300 hover:shadow-lg overflow-hidden">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex justify-center mb-2">
                <div className="bg-primary/10 rounded-full p-2">
                  <ArrowRight className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
                Ready to Join?
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ScrollArea className="h-40">
                <div className="text-base text-gray-700 leading-relaxed">
                  <p>Take your first step toward success with NHT Global. Our enrollment process is simple and straightforward.</p>
                  <p className="mt-2">Begin your journey today and become part of our global community of successful entrepreneurs.</p>
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex justify-center pt-2 pb-6">
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-white py-2 px-6 rounded-md transition-all duration-300 hover:translate-y-[-2px]"
              >
                <Link to={`/${slug}/opportunity`} className="flex items-center">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Loading skeleton component
const JoinUsPageSkeleton = () => (
  <div className="bg-accent min-h-screen flex flex-col">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 w-full">
      <Skeleton className="h-6 w-32" />
    </div>
    
    <Skeleton className="w-full h-80" />
    
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex-grow w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <Skeleton className="h-64 md:col-span-3" />
        
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  </div>
);

export default JoinUs;