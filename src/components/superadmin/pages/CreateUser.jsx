import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import useTenantApi from "@/hooks/useTenantApi";
import { motion } from "framer-motion"; // For animations

const CreateUser = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subscriptionPlan, setSubscriptionPlan] = useState("yearly");
    const [templateId, setTemplateId] = useState(1);
    const [templates, setTemplates] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const tenantApi = useTenantApi();

    // Fetch available templates on component mount
    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("http://localhost:3001/api/templates", {
                    method: "GET",
                    credentials: "include",
                });
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch templates: ${response.statusText}`);
                }
                
                const data = await response.json();
                setTemplates(data);
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message);
                // Set fallback templates
                setTemplates([
                    { 
                        id: 1, 
                        name: "Modern Storefront", 
                        description: "Clean, minimalist design with focus on product display",
                        thumbnail: "https://via.placeholder.com/150/f5f5f5/333333?text=Modern" 
                    },
                    { 
                        id: 2, 
                        name: "Vibrant Marketplace", 
                        description: "Bold colors and dynamic layout for engaging shopping experience",
                        thumbnail: "https://via.placeholder.com/150/e0e0e0/222222?text=Vibrant" 
                    },
                    { 
                        id: 3, 
                        name: "Elegant Boutique", 
                        description: "Sophisticated design with premium feel for luxury products",
                        thumbnail: "https://via.placeholder.com/150/ffffff/000000?text=Elegant" 
                    }
                ]);
                toast.error("Failed to load templates. Using default options.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTemplates();
    }, []);

    const validateForm = () => {
        const errors = {};
        
        if (!name.trim()) {
            errors.name = "Name is required";
        }
        
        if (!email.trim()) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Email address is invalid";
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error("Please correct the errors in the form");
            return;
        }
        
        setIsSubmitting(true);

        try {
            await toast.promise(
                tenantApi.post("/admin/create-user", {
                    name,
                    email,
                    subscription_plan: subscriptionPlan,
                    template_id: templateId
                }),
                {
                    loading: "Creating user...",
                    success: (response) => {
                        setName("");
                        setEmail("");
                        setSubscriptionPlan("yearly");
                        setTemplateId(1);
                        setFormErrors({});
                        return response.message || "User created successfully!";
                    },
                    error: (err) => {
                        if (err.response && err.response.data) {
                            return err.response.data.message || "An unexpected error occurred";
                        }
                        return "An unexpected error occurred";
                    },
                }
            );
        } catch (error) {
            console.error("Error creating user:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate subscription price display
    const getSubscriptionPriceDisplay = (plan) => {
        if (plan === "yearly") {
            return (
                <div className="flex items-center">
                    <span className="font-semibold text-black">$156/year</span>
                    <span className="ml-2 text-xs bg-gray-200 text-black px-2 py-1 rounded-full">Save 20%</span>
                </div>
            );
        } else {
            return <span className="font-semibold">$16.25/month</span>;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex flex-col justify-center items-center p-8 bg-white rounded-xl shadow-sm">
                <svg className="animate-spin h-12 w-12 text-gray-800 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-700 font-medium">Loading templates...</p>
            </div>
        );
    }

    // Ensure templates is always an array
    const templateOptions = Array.isArray(templates) ? templates : [];

    return (
        <div className="m-4 border-2 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-black p-6 text-white">
                <h2 className="text-2xl font-bold">Create Tenant User</h2>
                <p className="text-gray-300 mt-1">Set up a new user account with customized template</p>
            </div>
            
            {error && (
                <div className="mx-6 mt-6 p-4 bg-gray-100 border-l-4 border-gray-800 text-gray-800 rounded-md flex items-start">
                    <svg className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-medium">Error loading templates</p>
                        <p className="text-sm mt-1">{error} (Using fallback templates)</p>
                    </div>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 border ${formErrors.name ? 'border-gray-800 bg-gray-100' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors`}
                                placeholder="Enter user's full name"
                                disabled={isSubmitting}
                            />
                        </div>
                        {formErrors.name && (
                            <p className="mt-1 text-sm text-gray-800">{formErrors.name}</p>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 border ${formErrors.email ? 'border-gray-800 bg-gray-100' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-colors`}
                                placeholder="user@example.com"
                                disabled={isSubmitting}
                            />
                        </div>
                        {formErrors.email && (
                            <p className="mt-1 text-sm text-gray-800">{formErrors.email}</p>
                        )}
                    </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription Details</h3>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Plan</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div 
                                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                    subscriptionPlan === 'yearly' 
                                        ? 'border-black bg-gray-100 ring-2 ring-gray-300' 
                                        : 'border-gray-200 hover:border-gray-400'
                                }`}
                                onClick={() => setSubscriptionPlan('yearly')}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-medium">Yearly Plan</div>
                                        {getSubscriptionPriceDisplay('yearly')}
                                    </div>
                                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                                        subscriptionPlan === 'yearly' ? 'border-black bg-black' : 'border-gray-300'
                                    }`}>
                                        {subscriptionPlan === 'yearly' && (
                                            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div 
                                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                    subscriptionPlan === 'monthly' 
                                        ? 'border-black bg-gray-100 ring-2 ring-gray-300' 
                                        : 'border-gray-200 hover:border-gray-400'
                                }`}
                                onClick={() => setSubscriptionPlan('monthly')}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-medium">Monthly Plan</div>
                                        {getSubscriptionPriceDisplay('monthly')}
                                    </div>
                                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                                        subscriptionPlan === 'monthly' ? 'border-black bg-black' : 'border-gray-300'
                                    }`}>
                                        {subscriptionPlan === 'monthly' && (
                                            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Store Template</h3>
                    <p className="text-gray-500 text-sm mb-4">Select a template that best fits the user's business needs</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {templateOptions.map(template => (
                            <div 
                                key={template.id}
                                className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                                    templateId === template.id 
                                        ? 'border-black ring-2 ring-gray-300' 
                                        : 'border-gray-200 hover:border-gray-400'
                                }`}
                                onClick={() => setTemplateId(template.id)}
                            >
                                <div className="h-32 bg-gray-100 flex items-center justify-center">
                                    {template.thumbnail ? (
                                        <img 
                                            src={template.thumbnail} 
                                            alt={template.name} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-gray-400 text-center p-4">
                                            <svg className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Preview
                                        </div>
                                    )}
                                </div>
                                <div className="p-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-gray-900">{template.name}</h4>
                                        {templateId === template.id && (
                                            <svg className="h-5 w-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="pt-4">
                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center ${
                            isSubmitting
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-black hover:bg-gray-900 cursor-pointer text-white shadow-md hover:shadow-lg"
                        }`}
                        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating User...
                            </>
                        ) : (
                            <>
                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Create User
                            </>
                        )}
                    </motion.button>
                </div>
            </form>
            
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-500">
                    <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    New users will receive an email with instructions to set up their password
                </div>
            </div>

            {/* React Hot Toast Toaster with custom styling */}
            <Toaster 
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    style: {
                        background: '#1a1a1a',
                        color: '#fff',
                        borderRadius: '8px',
                        padding: '16px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#ffffff',
                            secondary: '#000000',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ffffff',
                            secondary: '#000000',
                        },
                    },
                }}
            />
        </div>
    );
};

export default CreateUser;
