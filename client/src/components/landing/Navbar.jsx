import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "How it works", href: "#how" },
  { label: "Features", href: "#features" },
];

export function Navbar() {
  const handleScroll = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const navigate = useNavigate();

  return (
    <nav
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-[960px]
                    flex items-center justify-between h-14 px-5
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

      {/* Separator */}
      <Separator
        orientation="vertical"
        className="mx-4 my-auto h-5 bg-border/60 shrink-0"
      />

      {/* Section links */}
      <div className="flex items-center gap-1 flex-1">
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

      {/* CTA */}
      <div className="flex items-center gap-2 shrink-0">
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
    </nav>
  );
}
