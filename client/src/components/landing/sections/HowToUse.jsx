import React from 'react';
import { motion } from 'framer-motion';
import { Download, Cpu, Search } from 'lucide-react';

const steps = [
  {
    icon: Download,
    title: 'Capture Anything',
    description: 'Instantly save URLs, drop in images, upload PDFs, or start writing notes. Seamless integration across your devices.',
  },
  {
    icon: Cpu,
    title: 'AI Processing',
    description: 'Our multimodal AI automatically tags, summarizes, and extracts key entities from your content in the background.',
  },
  {
    icon: Search,
    title: 'Semantic Search',
    description: 'Find what you need by searching for concepts, thoughts, or describing what you remember. No exact keywords needed.',
  },
];

const HowToUse = () => {
  return (
    <section id="how" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4"
          >
            How it works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            A frictionless workflow designed to get out of your way and let your mind expand.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors duration-300"
            >
              {/* Step Number Background */}
              <div className="absolute top-6 right-6 text-7xl font-black text-muted/10 group-hover:text-primary/5 transition-colors duration-300 pointer-events-none">
                0{index + 1}
              </div>
              
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-primary/20 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl" />
                <step.icon className="h-6 w-6 text-primary relative z-10" />
              </div>
              
              <h3 className="text-xl font-semibold text-card-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToUse;
