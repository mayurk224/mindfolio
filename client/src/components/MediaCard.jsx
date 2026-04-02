import { Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MediaCard({
  className,
  title = "Discovering the Hidden Gems of Digital Minimal Design",
  category = "Article",
  image = "https://images.pexels.com/photos/36703631/pexels-photo-36703631.jpeg",
}) {
  return (
    <div
      className={cn(
        "relative group overflow-hidden rounded-3xl bg-secondary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer border border-white/5",
        "aspect-4/5 sm:aspect-3/4",
        className,
      )}
    >
      {/* Background Image with Zoom Effect */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Glassmorphic Icon Badge */}
      <div className="absolute top-4 right-4 z-20 backdrop-blur-md bg-white/10 border border-white/20 p-2.5 rounded-full text-white shadow-lg">
        <Newspaper className="h-4 w-4" />
      </div>

      {/* Content Overlay - Revealed on Hover */}
      <div className="absolute inset-0 z-10 bg-linear-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2 opacity-70">
          {category}
        </span>
        <h3 className="text-lg font-semibold text-white leading-tight mb-4 line-clamp-2">
          {title}
        </h3>

        {/* Subtle decorative line or action hint */}
        <div className="h-1 w-0 bg-primary group-hover:w-full transition-all duration-700 ease-in-out rounded-full" />
      </div>

      {/* Fallback overlay for readability when not hovered (optional but recommended for UX) */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/50 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-500" />
    </div>
  );
}
