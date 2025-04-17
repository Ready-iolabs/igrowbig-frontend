import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import {
    BookOpen,
    Clock,
    User,
    Share2,
    Heart,
    ArrowRight,
    Tag,
    Search,
    Eye
} from "lucide-react";

// Carousel content
const blogCarouselContent = [
    {
        id: 1,
        title: "Spring Fashion Unveiled",
        description: "Discover the hottest trends for 2025",
        image: "https://plus.unsplash.com/premium_photo-1720744786849-a7412d24ffbf?q=80&w=2009&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Beauty Secrets Revealed",
        description: "Master your makeup routine",
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Style Icons of the Year",
        description: "Inspiration from the runway",
        image: "https://plus.unsplash.com/premium_photo-1683309565422-77818a287060?q=80&w=2070&auto=format&fit=crop"
    },
];

// Blog categories
const categories = ["ALL", "COMPANY", "FASHION", "STYLE", "TRENDS", "BEAUTY"];

// Blog posts data
const blogPosts = [
    {
        id: 1,
        title: "Top 10 Fashion Trends for 2025",
        category: "TRENDS",
        date: "March 06, 2025",
        readTime: 6,
        excerpt: "Get ahead of the curve with these must-know fashion trends for the upcoming season.",
        author: "Emma Style",
        image: "https://images.unsplash.com/photo-1516763296043-f676c1105999?q=80&w=2043&auto=format&fit=crop",
        tags: ["fashion", "trends", "2025"],
        likes: 32,
        views: 1240
    },
    {
        id: 2,
        title: "Spring Beauty Essentials",
        category: "BEAUTY",
        date: "March 05, 2025",
        readTime: 4,
        excerpt: "The ultimate guide to refreshing your beauty routine this spring.",
        author: "Lily Glam",
        image: "https://plus.unsplash.com/premium_photo-1689371953070-10782471db47?q=80&w=1974&auto=format&fit=crop",
        tags: ["beauty", "makeup", "spring"],
        likes: 25,
        views: 980
    },
    {
        id: 3,
        title: "Company Spotlight: Sustainable Fashion",
        category: "COMPANY",
        date: "March 04, 2025",
        readTime: 5,
        excerpt: "How our brand is revolutionizing eco-friendly style.",
        author: "Sophie Green",
        image: "https://images.unsplash.com/photo-1595270320786-94dd95d4a1db?q=60&w=600&auto=format&fit=crop",
        tags: ["company", "sustainability", "fashion"],
        likes: 18,
        views: 750
    },
];

const Blog = () => {
    const [selectedPost, setSelectedPost] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("ALL");
    const [filteredPosts, setFilteredPosts] = useState(blogPosts);
    const [sortBy, setSortBy] = useState("date");

    useEffect(() => {
        let updatedPosts = [...blogPosts];
        if (activeCategory !== "ALL") {
            updatedPosts = updatedPosts.filter(post => post.category === activeCategory);
        }
        updatedPosts = updatedPosts.filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        if (sortBy === "likes") {
            updatedPosts.sort((a, b) => b.likes - a.likes);
        } else if (sortBy === "views") {
            updatedPosts.sort((a, b) => b.views - a.views);
        } else {
            updatedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        setFilteredPosts(updatedPosts);
    }, [searchQuery, activeCategory, sortBy]);

    const handleLike = (postId) => {
        setFilteredPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId ? { ...post, likes: post.likes + 1 } : post
            )
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Carousel Section */}
            <section className="relative w-full">
                <Carousel className="w-full" plugins={[Autoplay({ delay: 4000 })]}>
                    <CarouselContent>
                        {blogCarouselContent.map((item) => (
                            <CarouselItem key={item.id}>
                                <div className="relative w-full h-72 sm:h-96 md:h-[500px] overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                    <div className="absolute bottom-8 left-4 sm:left-6 md:left-8 text-white">
                                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 tracking-tight">
                                            {item.title}
                                        </h1>
                                        <p className="text-base sm:text-lg md:text-xl mb-4">{item.description}</p>
                                        <Button
                                            variant="outline"
                                            className="bg-transparent text-white border-white hover:bg-white hover:text-black transition-all duration-300"
                                        >
                                            Explore Now <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2 sm:left-4 top-1/2 -translate-y-1/2" />
                    <CarouselNext className="right-2 sm:right-4 top-1/2 -translate-y-1/2" />
                </Carousel>
            </section>

            {/* Blog Posts Section */}
            <section className="py-8 sm:py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${activeCategory === category
                                    ? "bg-red-950 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search posts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-950"
                            />
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-950"
                        >
                            <option value="date">Date</option>
                            <option value="likes">Likes</option>
                            <option value="views">Views</option>
                        </select>
                    </div>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map((post) => (
                        <div
                            key={post.id}
                            onClick={() => setSelectedPost(post)}
                            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
                        >
                            <div className="relative">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                                <span className="absolute top-3 left-3 bg-red-950 text-white text-xs px-2 py-1 rounded">
                                    {post.category}
                                </span>
                            </div>
                            <div className="p-4 sm:p-5">
                                <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 group-hover:text-red-950 transition-colors line-clamp-1">
                                    {post.title}
                                </h4>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                                <div className="flex flex-wrap justify-between items-center text-xs sm:text-sm text-gray-500 mb-3 gap-2">
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>{post.date} • {post.readTime}m</span>
                                    </div>
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <Eye className="w-4 h-4" />
                                        <span>{post.views.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                                            className="flex items-center gap-1 hover:text-red-500 transition-colors"
                                        >
                                            <Heart className="w-4 h-4" />
                                            <span>{post.likes}</span>
                                        </button>
                                        <Share2 className="w-4 h-4 hover:text-indigo-500 transition-colors" />
                                    </div>
                                    <div className="flex gap-1 flex-wrap">
                                        {post.tags.map((tag) => (
                                            <span key={tag} className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Selected Post Modal */}
            {selectedPost && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 line-clamp-1">{selectedPost.title}</h3>
                            <button
                                onClick={() => setSelectedPost(null)}
                                className="text-gray-500 hover:text-gray-700 text-lg font-bold"
                            >
                                ✕
                            </button>
                        </div>
                        <img
                            src={selectedPost.image}
                            alt={selectedPost.title}
                            className="w-full h-52 sm:h-64 object-cover rounded-lg mb-4"
                            loading="lazy"
                        />
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-600 mb-4 text-sm">
                            <div className="flex items-center gap-1 sm:gap-2">
                                <User className="w-4 h-4" />
                                <span>{selectedPost.author}</span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{selectedPost.date} • {selectedPost.readTime}m</span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <Eye className="w-4 h-4" />
                                <span>{selectedPost.views.toLocaleString()}</span>
                            </div>
                        </div>
                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                            {selectedPost.excerpt} {/* Replace with full content if available */}
                        </p>
                        <Button className="w-full bg-red-950 hover:bg-red-900 text-white py-2 transition-all duration-200 hover:scale-105">
                            Read Full Article <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Blog;