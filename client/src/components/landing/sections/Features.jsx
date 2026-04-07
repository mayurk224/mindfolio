import React from 'react';
import { motion } from 'framer-motion';
import { FileType, ScanEye, Globe, Sparkles, Zap, Cpu } from 'lucide-react';
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          
          {/* Card 1: Universal Ingestion (Span 2 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2 group bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col hover:border-primary/30 transition-colors relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <FileType className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">Universal Ingestion</h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Drop in web articles, lengthy PDFs, or quick thoughts. Our engine parses text universally, ensuring no idea is left behind.
              </p>
            </div>
            {/* Subtle decorative element */}
            <div className="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none translate-x-1/4 translate-y-1/4">
              <Globe className="h-32 w-32 text-primary" />
            </div>
          </motion.div>

          {/* Card 2: Computer Vision (Span 2 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2 group bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col hover:border-primary/30 transition-colors relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <ScanEye className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">Computer Vision</h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Powered by state-of-the-art vision models like Pixtral. Upload diagrams, screenshots, or whiteboard photos, and the AI will extract context completely.
              </p>
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </motion.div>

          {/* Card 3: NEW SPA CARD (Span 2 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2 group bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col hover:border-primary/30 transition-colors relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">Zero Reloads. Pure Flow.</h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Built as a true Single Page Application (SPA). Navigate, search, and trigger AI tasks without a single page refresh.
              </p>
            </div>
            {/* Abstract visual for Speed/SPA */}
            <div className="mt-6 flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-1 flex-1 bg-primary/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ x: "-100%" }}
                    whileInView={{ x: "100%" }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                    className="h-full w-1/2 bg-primary/40 rounded-full"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 4: Social Integrations (Span 2 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:col-span-2 group bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col hover:border-primary/30 transition-colors relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <HugeiconsIcon icon={InstagramIcon} className="h-5 w-5 text-primary"/>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">Social Integrations</h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Save links directly from Instagram and let our high-res extraction engines pull visual data instantly.
              </p>
            </div>
            <div className="absolute right-[-10px] bottom-[-10px] opacity-10 group-hover:opacity-20 transition-opacity duration-500 rotate-12">
               <HugeiconsIcon icon={InstagramIcon} className="h-24 w-24 text-primary"/>
            </div>
          </motion.div>

          {/* Card 5: Asynchronous Architecture (Span 4 cols, full width horizontal) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="md:col-span-4 group bg-card border border-border rounded-2xl p-6 md:p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 hover:border-primary/30 transition-colors relative overflow-hidden"
          >
            <div className="md:flex-1 relative z-10">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Cpu className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl md:text-3xl font-bold text-foreground mb-4">Asynchronous Architecture</h3>
              <p className="text-muted-foreground text-sm md:text-lg leading-relaxed max-w-2xl">
                Experience extreme speed while our background workers handle the heavy lifting. BullMQ and Redis ensure your AI tasks execute without ever blocking the UI.
              </p>
            </div>
            
            {/* Visual for Async workers */}
            <div className="md:w-1/3 w-full flex justify-center items-center relative py-6">
               <div className="relative w-full max-w-[200px]">
                 <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-20 group-hover:opacity-40 transition-opacity"></div>
                 <div className="relative bg-background/50 border border-border/50 rounded-2xl p-6 backdrop-blur-md">
                   <div className="space-y-4">
                     {[0.1, 0.4, 0.7].map((delay, idx) => (
                       <div key={idx} className="flex items-center gap-4">
                         <div className={`h-2.5 w-2.5 rounded-full ${idx === 0 ? 'bg-primary animate-pulse' : 'bg-primary/40'}`}></div>
                         <div className="h-2 flex-1 bg-muted-foreground/10 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ scaleX: 0 }}
                              whileInView={{ scaleX: 1 }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: delay }}
                              className="h-full bg-primary/40 origin-left"
                            />
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
            </div>

            <div className="absolute left-0 bottom-0 top-0 w-1/3 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Features;
