// BlogPost.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, User, Eye, Share2, Heart } from 'lucide-react';

// Blog posts data (should ideally be in a separate file or fetched from an API)
const blogPosts = [
    {
        id: 1,
        title: "Top 10 Fashion Trends for 2025",
        category: "TRENDS",
        date: "March 06, 2025",
        readTime: 6,
        excerpt: "Get ahead of the curve with these must-know fashion trends for the upcoming season.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. This post explores the top fashion trends for 2025, including sustainable fabrics, bold colors, and innovative designs. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
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
        content: "Spring is the perfect time to refresh your beauty routine. In this article, we dive into the must-have products and techniques for a radiant look. From lightweight foundations to vibrant lip colors, discover how to embrace the season’s best trends. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
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
        content: "Sustainability is at the heart of modern fashion. This post highlights our company’s journey towards eco-friendly practices, featuring innovative materials and ethical production methods. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        author: "Sophie Green",
        image: "https://images.unsplash.com/photo-1595270320786-94dd95d4a1db?q=60&w=600&auto=format&fit=crop",
        tags: ["company", "sustainability", "fashion"],
        likes: 18,
        views: 750
    },
];

const BlogPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const post = blogPosts.find((p) => p.id === parseInt(id));

    if (!post) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center py-12 text-gray-800 text-lg sm:text-xl">
                    Blog post not found
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Hero Section */}
            <section className="relative w-full h-72 sm:h-96 md:h-[500px] overflow-hidden">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover opacity-90 transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent" />
                <div className="absolute bottom-6 left-4 sm:left-6 text-white">
                    <span className="inline-block bg-red-950 text-white text-xs px-2 py-1 rounded mb-2 sm:mb-3">
                        {post.category}
                    </span>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold drop-shadow-md leading-tight">
                        {post.title}
                    </h1>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-grow">
                <Button
                    onClick={() => navigate('/blog')}
                    variant="outline"
                    className="mb-6 sm:mb-8 text-gray-800 border-gray-300 hover:bg-gray-100 transition-all duration-200 flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Blog
                </Button>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
                    <div className="flex items-center gap-1 sm:gap-2">
                        <User className="w-4 h-4" /> {post.author}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <Clock className="w-4 h-4" /> {post.date} • {post.readTime}m
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                        <Eye className="w-4 h-4" /> {post.views.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                            <Heart className="w-4 h-4" /> {post.likes}
                        </button>
                        <Share2 className="w-4 h-4 hover:text-indigo-500 transition-colors" />
                    </div>
                </div>

                <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 leading-relaxed mb-6 sm:mb-8">
                    <p>{post.content}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                        <span
                            key={tag}
                            className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogPost;