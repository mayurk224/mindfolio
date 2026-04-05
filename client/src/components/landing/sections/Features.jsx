import React from 'react';
import { motion } from 'framer-motion';
import { FileType, ScanEye, Globe, Sparkles, CircleDashedIcon } from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import { InstagramIcon } from '@hugeicons/core-free-icons/index';

const Features = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-primary font-medium mb-4"
          >
            <Sparkles className="h-5 w-5" />
            <span>Beyond Simple Bookmarks</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-foreground"
          >
            Multimodal Intelligence
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Box 1: Universal Ingestion (Span 2 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2 group min-h-[300px] flex flex-col justify-between p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-colors duration-500 overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <FileType className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-card-foreground mb-3">Universal Ingestion</h3>
              <p className="text-muted-foreground">
                Drop in web articles, lengthy PDFs, or quick thoughts. Our engine parses text universally, ensuring no idea is left behind.
              </p>
            </div>
            {/* Decorative background element */}
            <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none translate-x-1/4 translate-y-1/4">
              <Globe className="h-48 w-48 text-primary" />
            </div>
          </motion.div>

          {/* Box 2: Computer Vision (Span 2 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2 group min-h-[300px] flex flex-col justify-between p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-colors duration-500 overflow-hidden relative"
          >
            <div className="relative z-10">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <ScanEye className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-card-foreground mb-3">Computer Vision</h3>
              <p className="text-muted-foreground">
                Powered by state-of-the-art vision models like Pixtral. Upload diagrams, screenshots, or whiteboard photos, and the AI will extract the context completely.
              </p>
            </div>
            {/* Decorative abstract pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </motion.div>

          {/* Box 3: Social Integrations (Span 4 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:col-span-4 group min-h-[250px] flex flex-col md:flex-row items-start md:items-center justify-between p-8 md:p-12 rounded-3xl bg-card border border-border hover:border-primary/50 transition-colors duration-500 overflow-hidden relative"
          >
            <div className="md:w-1/2 relative z-10">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <HugeiconsIcon icon={InstagramIcon} className="h-6 w-6 text-primary"/>
              </div>
              <h3 className="text-2xl font-semibold text-card-foreground mb-3">Social Integrations</h3>
              <p className="text-muted-foreground text-lg">
                Your brain shouldn't be limited to documents. Save links directly from Instagram and let our high-res extraction engines pull the visual data instantly.
              </p>
            </div>
            
            {/* Mockup visual for social */}
            <div className="mt-8 md:mt-0 md:w-5/12 w-full relative z-10">
              <div className="bg-background border border-border rounded-xl p-4 shadow-2xl flex gap-4 items-center transform group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(var(--primary),0.1)] transition-all duration-500">
                <div className="h-16 w-16 bg-muted rounded-lg flex-shrink-0 animate-pulse"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-3 w-3/4 bg-muted rounded-full"></div>
                  <div className="h-3 w-1/2 bg-muted rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="absolute left-0 bottom-0 top-0 w-1/2 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Features;
