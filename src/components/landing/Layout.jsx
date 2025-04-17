import React from "react";
import { Outlet } from "react-router-dom";
import { Element } from "react-scroll"; // Import Element from react-scroll
import Footer from "./Footer";
import Header from "./Header";
import NHTGlobalPromotion from "./NHTGlobalPromotion";
import NHTFeaturesGrid from "./NHTFeaturesGrid";
import GrowthReadySite from "./GrowthReadySite";
import MarketingChannels from "./MarketingChannels";
import FeaturesSection from "./FeaturesSection";
import HowItWorks from "./HowItWorks";
import PricingSection from "./PricingSection";
import LeadCapturePage from "./LeadCapturePage";

import FAQs from "./FAQs";

import NHTGlobalOpportunity from "./NHTGlobalOpportunity";
import BackOfficeCarousel from "./BackOfficeCarousel";
import ContactPage from "./ContactPage ";
import TemplatesSection from "./TemplatesSection";
import NewsletterForm from "./NewsletterForm";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header />
      <main className="flex-grow pt-20  px-4 md:px-6 bg-gray-50">
        <div className="container mx-auto">

          <Outlet />
        </div>
      </main>

      {/* Sections with Element for smooth scrolling */}
      <Element name="promotion">
        <NHTGlobalPromotion />
      </Element>
      <Element name="features">
        <NHTFeaturesGrid />
      </Element>
      <Element name="growth">
        <GrowthReadySite />
      </Element>
      <Element name="marketing">
        <MarketingChannels />
      </Element>
      <Element name="features-section">
        <FeaturesSection />
      </Element>
      <Element name="lead-capture">
        <LeadCapturePage />
      </Element>
      <Element name="backoffice">
        <BackOfficeCarousel />
      </Element>
      <Element name="how-it-works">
        <HowItWorks />
      </Element>
      <Element name="opportunity">
        <NHTGlobalOpportunity />
      </Element>
      <Element name="templates">
        <TemplatesSection /> {/* Add the new Templates section */}
      </Element>
      {/* <NewsletterForm/> */}
      <Element name="pricing">
        <PricingSection />
      </Element>
      <Element name="faqs">
        <FAQs />
      </Element>
      <Element name="contact">
        <ContactPage />
      </Element>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;