import React from 'react';
import { Navbar } from '@/components/landing/Navbar';
import Hero from '@/components/landing/sections/Hero';
import HowToUse from '@/components/landing/sections/HowToUse';
import Features from '@/components/landing/sections/Features';
import TechStack from '@/components/landing/sections/TechStack';
import DesignSystemSection from '@/components/landing/sections/DesignSystemSection';
import Footer from '@/components/landing/Footer';
import ScrollToTop from '@/components/ScrollToTop';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <HowToUse />
          <Features />
          <TechStack />
          <DesignSystemSection />
        </main>
        <Footer />
        <ScrollToTop />
    </div>
  )
}

export default Landing;