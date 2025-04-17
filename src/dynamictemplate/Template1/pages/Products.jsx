import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import parse from "html-react-parser"; // Import html-react-parser

const EcommerceProducts = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { getAll } = useTenantApi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const selectedCategory = searchParams.get("category")?.toLowerCase() || null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("EcommerceProducts: Fetching for slug:", slug);
        const response = await getAll(`/site/${slug}`);
        console.log("EcommerceProducts: Response:", response);
        setData(response.site_data);
      } catch (err) {
        console.error("EcommerceProducts: Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, getAll]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-800 text-xl font-semibold animate-pulse">Loading...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-red-600 text-xl font-semibold">Error: {error}</div>
      </div>
    );
  }

  const productPage = data?.product_page || {};
  const categories = data?.categories || [];
  const products = data?.products || [];

  const filteredProducts = selectedCategory
    ? products.filter(
      (p) =>
        categories.find((c) => c.name.toLowerCase() === selectedCategory)?.id ===
        p.category_id
    )
    : [];

  const handleCategorySelect = (categoryName) => {
    setSearchParams({ category: categoryName.toLowerCase() });
  };

  const clearCategory = () => {
    setSearchParams({});
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Product Banner */}
      <section className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
        <img
          src={productPage.banner_image_url || "https://via.placeholder.com/1200x400?text=Product+Banner"}
          alt="Product Banner"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white px-4 sm:px-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-medium drop-shadow-md text-center">
            {productPage.banner_content || "Discover Our Products"}
          </h1>
        </div>
      </section>

      {/* About Description */}
      {productPage.about_description && (
        <div className="p-7 text-center leading-8 text-gray-700 text-sm sm:text-base md:text-lg prose prose-gray mx-auto max-w-6xl">
          {parse(productPage.about_description)}
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        {!selectedCategory ? (
          <>
            {/* Categories Section */}
            <section>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 text-center mb-6">
                Shop by Category
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center max-w-2xl mx-auto mb-8">
                Find the perfect products tailored to your wellness needs.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                {categories.map((category) => (
                  <Card
                    key={category.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300"
                    onClick={() => handleCategorySelect(category.name)}
                  >
                    <CardContent className="flex flex-col items-center p-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden mb-3">
                        <img
                          src={category.image_url || "https://via.placeholder.com/100x100?text=No+Image"}
                          alt={category.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-700 text-center line-clamp-2">
                        {category.name}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar (Desktop) */}
            <aside className="hidden lg:block lg:w-1/4">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {categories.map((category) => (
                      <li
                        key={category.id}
                        className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all duration-200 ${selectedCategory === category.name.toLowerCase()
                            ? "bg-primary text-white"
                            : "hover:bg-gray-100"
                          }`}
                        onClick={() => handleCategorySelect(category.name)}
                      >
                        <img
                          src={category.image_url || "https://via.placeholder.com/40x40?text=No+Image"}
                          alt={category.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <span className="text-sm font-medium">{category.name}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </aside>

            {/* Mobile Category Dropdown */}
            <div className="lg:hidden mb-4">
              <Select
                value={selectedCategory}
                onValueChange={handleCategorySelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name.toLowerCase()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Products Section */}
            <div className="w-full lg:w-3/4">
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="ghost"
                  onClick={clearCategory}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Categories
                </Button>
                <h2 className="  text-gray-800">
                  {selectedCategory.toUpperCase()} ({filteredProducts.length} items)
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                      onClick={() => navigate(`/${slug}/product/${product.id}`)}
                    >
                      <CardContent className="p-2 flex flex-col h-full justify-between items-center text-center">
                        <img
                          src={product.image_url || "https://via.placeholder.com/300x200?text=No+Image"}
                          alt={product.name}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                          loading="lazy"
                        />
                        <h3 className="text-base font-semibold text-gray-800 mb-4 line-clamp-2">
                          {product.name}
                        </h3>
                        <Button
                          className="mt-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/${slug}/product/${product.id}`);
                          }}
                        >
                          Learn More & Buy
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-600 py-8">
                    No products found in this category.
                  </p>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcommerceProducts;