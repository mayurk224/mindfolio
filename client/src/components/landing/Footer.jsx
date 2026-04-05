import React from "react";
import { Heart, GitPullRequest, X } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Github01Icon,
  InstagramIcon,
  Linkedin02Icon,
} from "@hugeicons/core-free-icons/index";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <img src="/mindfolio.png" alt="" />
            </div>
            <span className="font-bold text-foreground tracking-tight">
              Mindfolio
            </span>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Developed</span>
            <Heart className="h-4 w-4 text-primary fill-primary mx-1" />
            <span>by Mayur K.</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/mayurk224/"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <HugeiconsIcon icon={Linkedin02Icon} />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a
              href="https://www.instagram.com/mayurkamble_02/"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <HugeiconsIcon icon={InstagramIcon} />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href="https://github.com/mayurk224/"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <HugeiconsIcon icon={Github01Icon} />
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>

        <div className="mt-8 text-center md:text-left text-xs text-muted-foreground/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>
            &copy; {new Date().getFullYear()} Mindfolio. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              to="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
