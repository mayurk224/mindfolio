import React from 'react';
import { motion } from 'framer-motion';

const technologies = [
  { name: 'MERN Stack', description: 'Core Architecture' },
  { name: 'Mistral AI', description: 'Large Language Models' },
  { name: 'Pixtral', description: 'Vision Engine' },
  { name: 'BullMQ', description: 'Background Workers' },
  { name: 'LangChain', description: 'AI Tooling' },
];

const TechStack = () => {
  return (
    <section className="py-24 bg-background border-t border-border/50">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-12"
        >
          Powered by modern architecture
        </motion.p>
        
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col items-center group cursor-default"
            >
              <div className="text-xl md:text-2xl font-bold text-foreground opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                {tech.name}
              </div>
              <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                {tech.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
