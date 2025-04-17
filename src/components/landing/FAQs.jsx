import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQs = () => {
  const faqItems = [
    {
      question: "What is iGrowBig?",
      answer: "iGrowBig is a platform that helps you create and manage your own personalized website to promote your business. We provide you with the tools and resources to establish an online presence, attract more prospects, and grow your business effectively."
    },
    {
      question: "How do I get started?",
      answer: "Getting started is simple! First, register and activate your personal URL or sub-domain. Then, enter your basic details in the back-office including your website name, personal information, logo, and distributor info. Once complete, your site is ready to reach thousands of prospects worldwide."
    },
    {
      question: "Is this an official NHT Global website?",
      answer: "No, this is not an NHT Global website. All sub-sites provided by this platform are not owned by NHT Global. This platform gives you more power to grow your business. You will own your site and its content after creation."
    },
    {
      question: "Can I customize my website?",
      answer: "Yes, absolutely! Your website comes with pre-loaded products, opportunity information, and blog content, but it's 100% customizable. You can modify the design, layout, content, and much more through your back-office dashboard."
    },
    {
      question: "Do I need technical skills to use iGrowBig?",
      answer: "No technical skills are required. Our platform is designed to be user-friendly and intuitive. We provide a simple back-office interface where you can make changes to your website without any coding knowledge."
    },
    {
      question: "How can I promote my website?",
      answer: "You can promote your personalized site on various channels including social media platforms, online forums, in-person meetings, email marketing, and other digital marketing strategies. We also provide guidance on effective promotion techniques in our resources section."
    },
    {
      question: "Is there a support team available?",
      answer: "Yes, we offer 24/7 online support. You can contact our support team at support@igrowbig.com with any questions or issues you may encounter."
    }
  ];

  return (
    <section className="bg-black py-16 px-4 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400">Find answers to common questions about our platform and services.</p>
        </div>

        <Accordion type="single" collapsible className="w-full bg-black rounded-lg shadow-md border border-gray-800">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className={index !== 0 ? "border-t border-gray-800" : ""}>
              <AccordionTrigger className="px-6 py-4 text-left font-medium text-white hover:text-gray-300 hover:bg-gray-900">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 pt-1 text-gray-400">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQs;