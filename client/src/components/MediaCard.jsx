import { Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MediaCard({ className, title, category, image }) {
  const hasImage = !!image;

  return (
    <div
      className={cn(
        "relative group overflow-hidden rounded-3xl bg-secondary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer border border-white/5",
        "aspect-4/5 sm:aspect-3/4",
        className,
      )}
    >
      {/* Background Image */}
      {hasImage && (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Icon Badge (top right) */}
      {hasImage && (
        <div className="absolute top-4 right-4 z-20 backdrop-blur-md bg-white/10 border border-white/20 p-2.5 rounded-full text-white shadow-lg">
          <Newspaper className="h-4 w-4" />
        </div>
      )}

      {/* ✅ Fallback Content (when no image) */}
      {!hasImage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-4">
          {/* Icon Circle */}
          <div className="flex items-center justify-center p-4 rounded-full bg-muted border border-border">
            <Newspaper className="h-6 w-6 text-muted-foreground" />
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-foreground line-clamp-2">
            {title}
          </h3>

          {/* Type */}
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {category}
          </span>
        </div>
      )}

      {/* Hover Overlay (same as before) */}
      <div className="absolute inset-0 z-10 bg-linear-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
        {hasImage && (
          <>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2 opacity-70">
              {category}
            </span>

            <h3 className="text-lg font-semibold text-white leading-tight mb-4 line-clamp-2">
              {title}
            </h3>
          </>
        )}

        <div className="h-1 w-0 bg-primary group-hover:w-full transition-all duration-700 ease-in-out rounded-full" />
      </div>

      {/* Bottom gradient (only when image exists) */}
      {hasImage && (
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/50 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-500" />
      )}
    </div>
  );
}
