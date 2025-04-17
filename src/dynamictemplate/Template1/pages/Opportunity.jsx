import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Carousel, CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Download } from "lucide-react";

const Opportunity = () => {
  const { slug } = useParams();
  const { getAll } = useTenantApi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Opportunity: Fetching for slug:", slug);
        const response = await getAll(`/site/${slug}`);
        console.log("Opportunity: Response:", response);
        setData(response.site_data);
      } catch (err) {
        console.error("Opportunity: Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, getAll]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-accent">
        <div className="text-gray-800 text-xl font-semibold animate-pulse">Loading...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-accent">
        <div className="text-red-600 text-xl font-semibold">Error: {error}</div>
      </div>
    );
  }

  const opportunityPage = data?.opportunity || {};
  const banners = [
    {
      id: 1,
      text: opportunityPage.banner_content || "Discover Your Opportunity",
      image: opportunityPage.banner_image_url || "https://via.placeholder.com/1200x400?text=Opportunity+Banner",
    },
  ];

  return (
    <div className="bg-accent min-h-screen">
      

      {/* Carousel */}
      <section aria-label="NHT Global Opportunity Highlights" className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {banners.map((banner) => (
              <CarouselItem key={banner.id}>
                <div className="relative h-56 sm:h-64 md:h-80 lg:h-[450px] overflow-hidden">
                  <img
                    src={banner.image}
                    alt={`${banner.text} - NHT Global Opportunity`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
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
          <Card >
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800">
                Welcome to the NHT Global Opportunity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-16 sm:w-24 h-1 bg-primary mx-auto mb-4 sm:mb-6" />
              
                <div
                  className="text-sm sm:text-md md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      opportunityPage.welcome_message ||
                      "Discover the world’s premier network marketing company designed to help you achieve your goals.",
                  }}
                />
             
            </CardContent>
          </Card>
        </section>

        {/* Opportunity Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center">
          <div className="relative h-64 sm:h-72 md:h-[400px] overflow-hidden rounded-lg">
            <img
              src={
                opportunityPage.page_image_url ||
                "https://via.placeholder.com/600x400?text=Opportunity+Image"
              }
              alt="NHT Global Opportunity"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center md:text-left">
              {opportunityPage.header_title || "Open the Door of Opportunity"}
            </h2>
            
              <div
                className="text-sm sm:text-md md:text-lg text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html:
                    opportunityPage.page_content ||
                    "<p>Join NHT Global to build your future and promote wellness.</p>",
                }}
              />
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-6 items-center md:items-start">
              <Button
                asChild
                className="bg-primary hover:bg-blue-700 text-white rounded-lg px-4 sm:px-6 py-2 sm:py-3 font-semibold"
              >
                <Link to={`/${slug}/join-us`}>Learn More</Link>
              </Button>
              {opportunityPage.plan_document_url && (
                <Button
                  asChild
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  <a
                    href={opportunityPage.plan_document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Compensation Plan
                  </a>
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Video Section */}
        {opportunityPage.video_section_link && (
          <section className="mt-8 sm:mt-10">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
                  Explore Our Opportunity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                  <video
                    src={opportunityPage.video_section_link}
                    controls
                    className="w-full h-full"
                    title="NHT Global Opportunity Video"
                  />
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Tabs Section */}
        <section className="mt-8 sm:mt-10">
          <Card className="border-none shadow-sm">
            <CardContent className="pt-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="plan">Plan Details</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <ScrollArea className="h-48 sm:h-56">
                    <div
                      className="text-sm sm:text-md md:text-lg text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html:
                          opportunityPage.welcome_message ||
                          "Learn how NHT Global empowers you to achieve financial and personal growth.",
                      }}
                    />
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="plan">
                  <ScrollArea className="h-48 sm:h-56">
                    <div
                      className="text-sm sm:text-md md:text-lg text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html:
                          opportunityPage.page_content ||
                          "Explore the NHT Global Compensation Plan to understand your earning potential.",
                      }}
                    />
                    {opportunityPage.plan_document_url && (
                      <Button
                        asChild
                        variant="link"
                        className="mt-4 text-primary"
                      >
                        <a
                          href={opportunityPage.plan_document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download Compensation Plan
                        </a>
                      </Button>
                    )}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Opportunity;