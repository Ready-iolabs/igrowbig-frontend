import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { products, categories } from "../data/products"; // Adjust path if needed
import {
  Heart, Baby, Home, Leaf, Stethoscope, User2, Scale, Sparkles, Shield, Zap, Users, User, ArrowBigLeft,
} from "lucide-react";
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
} from "@/components/ui/carousel";

const EcommerceProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || null);
  const navigate = useNavigate();

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : [];

  const categoryIcons = {
    beauty: Sparkles,
    cardiac: Heart,
    child: Baby,
    home: Home,
    detox: Leaf,
    digestive: Stethoscope,
    elderly: User2,
    energy: Zap,
    immunity: Shield,
    men: User,
    weight: Scale,
    women: Users,
  };

  const carouselItems = [
    {
      id: 1,
      text: "Enhance Your Wellness",
      image: "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 2,
      text: "Live Healthier Every Day",
      image: "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?q=80&w=1935&auto=format&fit=crop",
    },
    {
      id: 3,
      text: "Quality You Can Trust",
      image: "https://plus.unsplash.com/premium_photo-1718913936342-eaafff98834b?q=80&w=2072&auto=format&fit=crop",
    },
  ];

  useEffect(() => {
    if (selectedCategory) {
      setSearchParams({ category: selectedCategory });
    } else {
      setSearchParams({});
    }
  }, [selectedCategory, setSearchParams]);

  const ProductCard = ({ product }) => (
    <div className="rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 bg-white border border-gray-100">
      <img
        src={product.image || "https://via.placeholder.com/300x200?text=No+Image"}
        alt={product.name}
        className="w-full h-36 sm:h-44 md:h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 text-center mb-2 line-clamp-2">{product.name}</h3>
        {product.price && (
          <p className="text-gray-600 text-center text-sm mb-3">${product.price.toFixed(2)}</p>
        )}
        <button
          onClick={() => navigate(`/template1/product/${product.id}`)} // Absolute path
          className="w-full bg-gradient-to-r from-[#53a8b6] to-[#468c97] text-white py-2 px-4 rounded-full text-sm font-medium hover:from-[#468c97] hover:to-[#3a7a84] transition-all duration-300 shadow-sm"
        >
          Learn More & Buy
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Carousel */}
      <section aria-label="Featured Wellness Products" className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {carouselItems.map((banner) => (
              <CarouselItem key={banner.id}>
                <div className="relative h-56 sm:h-64 md:h-80 lg:h-[450px] overflow-hidden">
                  <img
                    src={banner.image}
                    alt={`${banner.text} - NHT Global`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
                  <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 text-white text-center px-4">
                    <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold drop-shadow-md">
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
        {!selectedCategory ? (
          <>
            <section className="mb-10 text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-4">Our Products</h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                NHT Global offers products designed for modern lifestyles, addressing stress and environmental challenges with safe, effective solutions.
              </p>
            </section>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {categories.map((category) => {
                const Icon = categoryIcons[category.id] || Sparkles;
                return (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex flex-col items-center cursor-pointer group transition-all duration-300"
                  >
                    <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-white shadow-md flex items-center justify-center group-hover:bg-blue-100 group-hover:shadow-lg transition-all duration-200">
                      <Icon className="w-8 sm:w-10 h-8 sm:h-10 text-gray-600 group-hover:text-blue-600" />
                    </div>
                    <span className="mt-3 text-xs sm:text-sm font-semibold text-gray-700 text-center group-hover:text-blue-600">
                      {category.name.toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100">
              <button
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-2 text-gray-800 font-semibold hover:text-blue-600 transition-colors duration-200 mb-3 sm:mb-0"
              >
                <ArrowBigLeft className="w-5 sm:w-6 h-5 sm:h-6" />
                Back to Categories
              </button>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 text-center sm:text-right">
                {selectedCategory.toUpperCase()} ({filteredProducts.length} items)
              </h2>
            </div>

            {/* Categories Sidebar (Mobile Dropdown) */}
            <div className="lg:hidden">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 rounded-md border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Main Content with Sidebar */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Sidebar (Desktop Only) */}
              <aside className="hidden lg:block lg:w-1/4 bg-white rounded-xl shadow-md p-6 sticky top-4 max-h-[calc(100vh-4rem)] overflow-y-auto border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Categories</h2>
                <ul className="space-y-3">
                  {categories.map((category) => {
                    const Icon = categoryIcons[category.id] || Sparkles;
                    return (
                      <li
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all duration-200 ${
                          selectedCategory === category.id
                            ? "bg-blue-100 text-blue-600 font-semibold"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{category.name.toUpperCase()}</span>
                      </li>
                    );
                  })}
                </ul>
              </aside>

              {/* Products Grid */}
              <div className="w-full lg:w-3/4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))
                  ) : (
                    <p className="text-center text-gray-600 col-span-full py-8">No products found in this category.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcommerceProducts;