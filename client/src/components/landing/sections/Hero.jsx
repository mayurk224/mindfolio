import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Link as LinkIcon,
  Image as ImageIcon,
  FileText as FileIcon,
  Play,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const Hero = () => {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);

  return (
    <section id="hero" className="relative pt-32 pb-24 overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute inset-x-0 top-0 h-96 bg-primary/5 blur-[100px] -z-10" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary/80 mr-2 animate-pulse"></span>
            Mindfolio v1.0 is now live
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-foreground"
          >
            Your Ultimate <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              AI Second Brain.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl"
          >
            Save links, images, PDFs, and notes. Let AI auto-organize,
            summarize, and make everything instantly searchable by thought, not
            just keywords.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4"
          >
            <button
              className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              onClick={() => navigate("/signup")}
            >
              Start Building Your Brain
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              className="flex items-center gap-2 rounded-full border border-border bg-background px-8 py-4 text-foreground font-medium hover:bg-card transition-colors"
              onClick={() => setShowDemo(true)}
            >
              <Play className="h-4 w-4" />
              View Demo
            </button>

            <Dialog open={showDemo} onOpenChange={setShowDemo}>
              <DialogContent className="w-5xl p-0 overflow-hidden bg-black border-none ring-0">
                <DialogTitle className="sr-only">
                  Product Demo Video
                </DialogTitle>
                <div className="relative w-full ">
                  <video
                    src="/7f470e7f133054a02d49f79348e2bd3c.mp4"
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                  />
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        {/* Abstract Visual underneath */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-24 relative max-w-5xl mx-auto"
        >
          {/* Subtle connecting lines */}
          <div className="absolute inset-0 -z-10 flex justify-center items-center">
            <div className="w-[80%] h-px bg-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.3)]"></div>
          </div>
          <div className="absolute inset-0 -z-10 flex justify-center items-center">
            <div className="h-[80%] w-px bg-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.3)]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Overlay Cards */}
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-xl backdrop-blur-sm transform md:translate-y-6 md:rotate-[-2deg] hover:rotate-0 hover:translate-y-4 transition-all duration-300">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <LinkIcon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Saved URL</h3>
              <p className="text-sm text-muted-foreground mb-4">
                React Architecture Patterns
              </p>
              <div className="h-2 w-24 bg-muted rounded-full"></div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-primary/30 shadow-[0_0_30px_rgba(0,0,0,0.1)] shadow-primary/10 backdrop-blur-sm transform md:-translate-y-4 hover:-translate-y-6 transition-all duration-300 z-10">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ImageIcon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Image Recognition
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Extracted text from whiteboard photo
              </p>
              <div className="space-y-2">
                <div className="h-2 w-full bg-muted rounded-full"></div>
                <div className="h-2 w-2/3 bg-muted rounded-full"></div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-xl backdrop-blur-sm transform md:translate-y-10 md:rotate-[2deg] hover:rotate-0 hover:translate-y-8 transition-all duration-300">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileIcon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                PDF Analysis
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Q3 Marketing Report Summarized
              </p>
              <div className="h-2 w-20 bg-muted rounded-full"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
