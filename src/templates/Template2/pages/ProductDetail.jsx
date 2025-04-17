import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { products } from "../data/products";
import { ArrowBigLeft } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="bg-gray-50 flex items-center justify-center min-h-screen">
        <div className="text-center py-12 text-gray-800 text-xl font-semibold">Product not found</div>
      </div>
    );
  }

  const handleBack = () => {
    navigate(`/template1/products?category=${product.category}`);
  };

  return (
    <div className="bg-gray-50 pt-4 pb-12">
      <section className="relative h-64 md:h-96 overflow-hidden rounded-lg shadow-md mx-4 md:mx-0">
        <img
          src={product.image || "https://via.placeholder.com/1200x400?text=Product+Banner"}
          alt={`${product.name} - NHT Global`}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white p-4 md:p-6">
          <h1 className="text-2xl md:text-4xl font-semibold drop-shadow-md">{product.name}</h1>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-800 font-semibold mb-8 hover:text-blue-600 transition-colors duration-200"
        >
          <ArrowBigLeft className="w-6 h-6" />
          Back to Products
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <img
              src={product.image || "https://via.placeholder.com/500x500?text=Product+Image"}
              alt={`${product.name} detail`}
              className="w-full h-auto rounded-xl shadow-md object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">{product.name}</h2>
            {product.price && <p className="text-xl md:text-2xl text-gray-600 mb-4">${product.price.toFixed(2)}</p>}
            <p className="text-gray-700 mb-6 leading-relaxed">
              {product.description || "This is a high-quality product designed to enhance your wellness."}
            </p>
            <div className="flex gap-4">
              <button className="bg-gradient-to-r from-[#53a8b6] to-[#468c97] text-white py-3 px-6 rounded-full hover:from-[#468c97] hover:to-[#3a7a84] transition-all duration-300 font-semibold shadow-md">
                Buy Now
              </button>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Product Details</h3>
              <ul className="list-disc pl-5 text-gray-700 text-sm">
                <li>Category: {product.category.toUpperCase()}</li>
                <li>SKU: {product.id}</li>
                <li>Availability: In Stock</li>
              </ul>
            </div>
          </div>
        </div>

        <section className="mt-12">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">About {product.name}</h3>
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            Discover the benefits of {product.name} from NHT Global. This product is crafted to support your {product.category} needs with premium ingredients.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;