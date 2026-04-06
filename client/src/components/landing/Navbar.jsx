import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "How it works", href: "#how" },
  { label: "Features", href: "#features" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleScroll = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] md:w-[calc(100%-3rem)] max-w-[960px]
                    flex items-center justify-between h-14 px-4 md:px-5
                    bg-background/80 backdrop-blur-xl
                    border border-border/50 rounded-2xl
                    shadow-sm"
    >
      {/* Brand */}
      <Link
        to="/landing"
        className="flex items-center gap-2.5 shrink-0 transition-opacity hover:opacity-90"
      >
        <div className="rounded-lg grid place-items-center shrink-0 shadow-sm">
          <img
            src="/mindfolio.png"
            alt="Mindfolio"
            className="w-8 h-8 object-contain"
          />
        </div>
        <span className="text-xl text-foreground tracking-tight">
          Mindfolio
        </span>
      </Link>

      {/* Separator - Hidden on Mobile */}
      <Separator
        orientation="vertical"
        className="mx-4 my-auto h-5 bg-border/60 shrink-0 hidden md:block"
      />

      {/* Section links - Hidden on Mobile */}
      <div className="hidden md:flex items-center gap-1 flex-1">
        {NAV_LINKS.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            onClick={(e) => handleScroll(e, href)}
            className="text-[13.5px] font-medium text-muted-foreground px-3 py-1.5
                       rounded-md transition-all duration-200 whitespace-nowrap
                       hover:text-foreground hover:bg-muted"
          >
            {label}
          </a>
        ))}
      </div>

      {/* CTA and Mobile Menu */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="ghost"
            className="text-[13.5px] font-medium text-muted-foreground h-8 px-4 rounded-lg
                       hover:text-foreground hover:bg-muted"
            onClick={() => navigate("/login")}
          >
            Log in
          </Button>
          <Button
            className="text-[13.5px] font-medium h-8 px-4 rounded-lg
                       shadow-sm hover:shadow-md
                       transition-all duration-200 hover:-translate-y-0.5"
            onClick={() => navigate("/signup")}
          >
            Get started
          </Button>
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-muted"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] sm:w-[350px] p-0 border-l border-border/50">
              <div className="flex flex-col h-full bg-background/95 backdrop-blur-md">
                <SheetHeader className="p-6 border-b border-border/50">
                  <SheetTitle className="flex items-center gap-2.5">
                    <img
                      src="/mindfolio.png"
                      alt="Mindfolio"
                      className="w-8 h-8 object-contain"
                    />
                    <span className="text-xl tracking-tight">Mindfolio</span>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-6 px-4">
                  <div className="flex flex-col gap-2">
                    {NAV_LINKS.map(({ label, href }) => (
                      <a
                        key={href}
                        href={href}
                        onClick={(e) => handleScroll(e, href)}
                        className="flex items-center px-4 py-3 rounded-xl text-base font-medium
                                   text-muted-foreground transition-colors
                                   hover:text-foreground hover:bg-muted/50 active:bg-muted"
                      >
                        {label}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="p-6 border-t border-border/50 bg-muted/20">
                  <div className="flex flex-col gap-3">
                    <Button
                      variant="outline"
                      className="w-full h-11 rounded-xl font-medium"
                      onClick={() => {
                        setIsOpen(false);
                        navigate("/login");
                      }}
                    >
                      Log in
                    </Button>
                    <Button
                      className="w-full h-11 rounded-xl font-medium shadow-md shadow-primary/10"
                      onClick={() => {
                        setIsOpen(false);
                        navigate("/signup");
                      }}
                    >
                      Get started
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
