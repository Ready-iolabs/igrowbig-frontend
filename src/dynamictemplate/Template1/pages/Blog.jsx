import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useTenantApi from "@/hooks/useTenantApi";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Card, CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Carousel, CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
    Clock,
    User,
    Share2,
    Heart,
    ArrowRight,
    Search,
    Eye,
} from "lucide-react";

const Blog = () => {
    const { slug } = useParams();
    const { getAll } = useTenantApi();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("ALL");
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [sortBy, setSortBy] = useState("date");

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Blog: Fetching for slug:", slug);
                const response = await getAll(`/site/${slug}`);
                console.log("Blog: Response:", response);
                setData(response.site_data);
            } catch (err) {
                console.error("Blog: Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug, getAll]);

    useEffect(() => {
        if (!data?.blog) return;
        let updatedPosts = [...data.blog];
        if (activeCategory !== "ALL") {
            updatedPosts = updatedPosts.filter((post) => post.category === activeCategory);
        }
        updatedPosts = updatedPosts.filter(
            (post) =>
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        if (sortBy === "likes") {
            updatedPosts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        } else if (sortBy === "views") {
            updatedPosts.sort((a, b) => (b.views || 0) - (a.views || 0));
        } else {
            updatedPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }
        setFilteredPosts(updatedPosts);
    }, [data, searchQuery, activeCategory, sortBy]);

    const handleLike = (postId) => {
        setFilteredPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId ? { ...post, likes: (post.likes || 0) + 1 } : post
            )
        );
    };

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

    const blogPosts = data?.blog || [];
    const blogBanners = data?.blog_banners || [];
    const categories = [
        "ALL",
        ...new Set(blogPosts.map((post) => post.category).filter(Boolean)),
    ];

    return (
        <div className="min-h-screen bg-accent flex flex-col">
            

            {/* Carousel Section */}
            <section className="relative w-full">
                <Carousel className="w-full" plugins={[Autoplay({ delay: 4000 })]}>
                    <CarouselContent>
                        {blogBanners.length > 0 ? (
                            blogBanners.map((item) => (
                                <CarouselItem key={item.id}>
                                    <div className="relative w-full h-72 sm:h-96 md:h-[500px] overflow-hidden">
                                        <img
                                            src={item.image_url || "https://via.placeholder.com/1200x400?text=Blog+Banner"}
                                            alt={item.image_content || "Blog Banner"}
                                            className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                        <div className="absolute bottom-8 left-4 sm:left-6 md:left-8 text-white ">
                                            <h1 className="text-xl sm:text-2xl md:text-3xl font-sm mb-2 tracking-tight text-center ">
                                                {item.image_content || "Explore Our Blog"}
                                            </h1>
                                           
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))
                        ) : (
                            <CarouselItem>
                                <div className="relative w-full h-72 sm:h-96 md:h-[500px] overflow-hidden">
                                    <img
                                        src="https://via.placeholder.com/1200x400?text=No+Banner"
                                        alt="No Banner"
                                        className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                    <div className="absolute bottom-8 left-4 sm:left-6 md:left-8 text-white">
                                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 tracking-tight">
                                            Welcome to Our Blog
                                        </h1>
                                        
                                    </div>
                                </div>
                            </CarouselItem>
                        )}
                    </CarouselContent>
                    
                </Carousel>
            </section>

            {/* Blog Posts Section */}
            <section className="py-8 sm:py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                variant={activeCategory === category ? "default" : "outline"}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${activeCategory === category
                                        ? "bg-primary text-white"
                                        : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                type="text"
                                placeholder="Search posts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-3 py-2 text-sm"
                            />
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="date">Date</option>
                            <option value="likes">Likes</option>
                            <option value="views">Views</option>
                        </select>
                    </div>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                            <Card
                                key={post.id}
                                className="hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
                                onClick={() => setSelectedPost(post)}
                            >
                                <div className="relative">
                                    <img
                                        src={post.image_url || "https://via.placeholder.com/600x400?text=Blog+Image"}
                                        alt={post.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <span className="absolute top-3 left-3 bg-primary text-white text-xs px-2 py-1 rounded">
                                        {post.category || "Uncategorized"}
                                    </span>
                                </div>
                                <CardContent className="p-4 sm:p-5">
                                    <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                        {post.title}
                                    </CardTitle>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {post.content?.length > 100
                                            ? post.content.slice(0, 100) + "..."
                                            : post.content}
                                    </p>
                                    <div className="flex flex-wrap justify-between items-center text-xs sm:text-sm text-gray-500 mb-3 gap-2">
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <Clock className="w-4 h-4" />
                                            <span>
                                                {new Date(post.created_at).toLocaleDateString("en-US", {
                                                    month: "long",
                                                    day: "2-digit",
                                                    year: "numeric",
                                                })}{" "}
                                                • {post.read_time || 5}m
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 sm:gap-2">
                                            <Eye className="w-4 h-4" />
                                            <span>{(post.views || 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLike(post.id);
                                                }}
                                                className="flex items-center gap-1 hover:text-red-500 transition-colors"
                                            >
                                                <Heart className="w-4 h-4" />
                                                <span>{post.likes || 0}</span>
                                            </button>
                                            <Share2 className="w-4 h-4 hover:text-indigo-500 transition-colors" />
                                        </div>
                                        <div className="flex gap-1 flex-wrap">
                                            {(post.tags || []).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-600 py-8">
                            No posts found.
                        </p>
                    )}
                </div>
            </section>

            {/* Selected Post Dialog */}
            {selectedPost && (
                <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
                    <DialogContent className="max-w-2xl p-5 sm:p-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl sm:text-2xl font-semibold text-gray-800 line-clamp-1">
                                {selectedPost.title}
                            </DialogTitle>
                        </DialogHeader>
                        <img
                            src={selectedPost.image_url || "https://via.placeholder.com/600x400?text=Blog+Image"}
                            alt={selectedPost.title}
                            className="w-full h-52 sm:h-64 object-cover rounded-lg mb-4"
                            loading="lazy"
                        />
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-600 mb-4 text-sm">
                            <div className="flex items-center gap-1 sm:gap-2">
                                <User className="w-4 h-4" />
                                <span>{selectedPost.author || "Unknown"}</span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <Clock className="w-4 h-4" />
                                <span>
                                    {new Date(selectedPost.created_at).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "2-digit",
                                        year: "numeric",
                                    })}{" "}
                                    • {selectedPost.read_time || 5}m
                                </span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <Eye className="w-4 h-4" />
                                <span>{(selectedPost.views || 0).toLocaleString()}</span>
                            </div>
                        </div>
                        <div
                            className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6"
                            dangerouslySetInnerHTML={{
                                __html:
                                    selectedPost.content?.length > 200
                                        ? selectedPost.content.slice(0, 200) + "..."
                                        : selectedPost.content,
                            }}
                        />
                        <Button
                            className="w-full bg-primary hover:bg-blue-700 text-white py-2 transition-all duration-200 hover:scale-105"
                            asChild
                        >
                            <Link to={`/${slug}/blog/${selectedPost.id}`}>
                                Read Full Article <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default Blog;