import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { ArrowLeft, Star, Download, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ProductDetail = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const { getAll } = useTenantApi();
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("ProductDetail: Fetching for slug:", slug);
        const response = await getAll(`/site/${slug}`);
        console.log("ProductDetail: Response:", response);
        setSiteData(response.site_data);
      } catch (err) {
        console.error("ProductDetail: Error:", err);
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

  const product = siteData?.products.find((p) => p.id === parseInt(id));
  const categories = siteData?.categories || [];

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-accent">
        <div className="text-center py-12 text-gray-800 text-xl font-semibold">Product not found</div>
      </div>
    );
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  const handleBack = () => {
    navigate(`/${slug}/products?category=${getCategoryName(product.category_id).toLowerCase()}`);
  };

  // Banner for top carousel (product-specific)
  const banners = [
    {
      id: 1,
      text: product.title || product.name || "Explore This Product",
      image:
        product.banner_image_url ||
        "https://via.placeholder.com/1200x400?text=Product+Banner",
    },
  ];

  // Images for product gallery
  const images = [
    product.image_url || "https://via.placeholder.com/500x500?text=Product+Image",
    product.banner_image_url || "https://via.placeholder.com/500x500?text=Banner+Image",
  ].filter(Boolean);

  return (
    <div className="bg-accent min-h-screen">
      {/* Product Banner */}
      <section aria-label="Product Banner" className="relative w-full">
        <Carousel className="w-full">
          <CarouselContent>
            {banners.map((banner) => (
              <CarouselItem key={banner.id}>
                <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
                  <img
                    src={banner.image}
                    alt={`${banner.text} - Product Banner`}
                    className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-8 left-4 sm:left-6 md:left-8 text-center text-white">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-sm  mb-2 tracking-tight">
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

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <nav className="flex items-center text-sm text-gray-600 space-x-2">
          <Button
            variant="ghost"
            onClick={() => navigate(`/${slug}`)}
            className="p-0 hover:text-primary"
          >
            Home
          </Button>
          <span>/</span>
          <Button
            variant="ghost"
            onClick={handleBack}
            className="p-0 hover:text-primary"
          >
            {getCategoryName(product.category_id).toUpperCase()}
          </Button>
          <span>/</span>
          <span className="text-gray-800 truncate">{product.name}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Gallery */}
          <div className="lg:w-1/2">
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((img, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={img}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-64 sm:h-80 md:h-96 object-contain bg-white rounded-lg shadow-md"
                      loading="lazy"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-800">
                  {product.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                
                {product.price && (
                  <div className="mb-4">
                    <p className="text-2xl md:text-3xl font-semibold text-gray-800">
                      ${product.price.toFixed(2)}
                    </p>
                    {product.price_description && (
                      <p className="text-sm pt-5">{product.price_description}</p>
                    )}
                  </div>
                )}
                <Badge
                  variant={
                    product.availability?.toLowerCase() === "in_stock" ? "default" : "destructive"
                  }
                  className="mb-4"
                >
                  {product.availability || "In Stock"}
                </Badge>
                <ScrollArea className="h-24 mb-6">
                  <div
                    className="text-gray-700 leading-relaxed text-sm md:text-base"
                    dangerouslySetInnerHTML={{
                      __html:
                        product.description ||
                        "This is a high-quality product designed to enhance your wellness.",
                    }}
                  />
                </ScrollArea>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-6">
                  <a href={product.buy_link || "#"} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-primary text-white hover:bg-blue-700" size="lg">
                      Buy Now
                    </Button>
                  </a>
                  <Button className="bg-secondary text-white hover:bg-orange-600" size="lg">
                    Add to Cart
                  </Button>
                  {product.guide_pdf_url && (
                    <a href={product.guide_pdf_url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="lg">
                        <Download className="w-4 h-4 mr-2" />
                        Guide
                      </Button>
                    </a>
                  )}
                </div>

                {/* Product Details */}
                <Separator className="my-4" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                  <ul className="list-disc pl-5 text-gray-700 text-sm">
                    <li>Category: {getCategoryName(product.category_id).toUpperCase()}</li>
                    <li>SKU: {product.id}</li>
                    <li>Status: {product.status || "Active"}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sticky Action Bar (Mobile) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex gap-4 lg:hidden z-10">
          <a
            href={product.buy_link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button className="w-full bg-primary text-white hover:bg-blue-700" size="lg">
              Buy Now
            </Button>
          </a>
          <Button className="flex-1 bg-secondary text-white hover:bg-orange-600" size="lg">
            Add to Cart
          </Button>
        </div>

        {/* Tabs */}
        <Card className="mt-8 border-none shadow-sm">
          <CardContent className="pt-6">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                {product.instructions && (
                  <TabsTrigger value="instructions">Instructions</TabsTrigger>
                )}
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description">
                <ScrollArea className="h-48">
                  <div
                    className="text-gray-700 leading-relaxed text-sm md:text-base"
                    dangerouslySetInnerHTML={{
                      __html:
                        product.description ||
                        "This is a high-quality product designed to enhance your wellness.",
                    }}
                  />
                </ScrollArea>
              </TabsContent>
              {product.instructions && (
                <TabsContent value="instructions">
                  <ScrollArea className="h-48">
                    <div
                      className="text-gray-700 leading-relaxed text-sm md:text-base"
                      dangerouslySetInnerHTML={{ __html: product.instructions }}
                    />
                  </ScrollArea>
                </TabsContent>
              )}
              <TabsContent value="reviews">
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  No reviews available yet. Be the first to share your experience!
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Video Section */}
        {product.video_url && (
          <Card className="mt-8 border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl font-semibold text-gray-800">
                Watch {product.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                <iframe
                  src={product.video_url}
                  title={`${product.name} video`}
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;