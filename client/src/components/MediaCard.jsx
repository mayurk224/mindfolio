import { useState, useEffect } from "react";
import { Newspaper, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MediaCard({
  item: initialItem,
  className,
  onItemUpdate,
}) {
  const [item, setItem] = useState(initialItem);
  const displayImage =
    item.thumbnailUrl || (item.type === "images" ? item.url : null);
  const hasImage = !!displayImage;
  const isProcessing =
    item.status === "pending" || item.status === "processing";

  useEffect(() => {
    if (!isProcessing) return;

    const pollInterval = setInterval(async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL
          ? `${import.meta.env.VITE_API_URL}/items`
          : "http://localhost:8000/api/items";

        const response = await fetch(`${API_URL}/${item._id}`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const updatedItem = await response.json();
          setItem(updatedItem);

          // Sync back to the list in Home.jsx so the modal (and other cards) stay updated
          if (onItemUpdate) {
            onItemUpdate(updatedItem);
          }

          if (
            updatedItem.status === "completed" ||
            updatedItem.status === "failed"
          ) {
            clearInterval(pollInterval);
          }
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [item._id, isProcessing]);

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
          src={displayImage}
          alt={item.title}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-all duration-700",
            isProcessing
              ? "blur-sm scale-110 opacity-50"
              : "group-hover:scale-105",
          )}
        />
      )}

      {/* Icon Badge (top right) */}
      {hasImage && (
        <div className="absolute top-4 right-4 z-20 backdrop-blur-md bg-white/10 border border-white/20 p-2.5 rounded-full text-white shadow-lg">
          {isProcessing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Newspaper className="h-4 w-4" />
          )}
        </div>
      )}

      {/* ✅ Fallback Content (when no image) */}
      {!hasImage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-4 transition-opacity duration-300 group-hover:opacity-0">
          <div className="flex items-center justify-center p-4 rounded-full bg-muted border border-border">
            {isProcessing ? (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            ) : (
              <Newspaper className="h-6 w-6 text-muted-foreground" />
            )}
          </div>

          <h3 className="text-sm font-semibold text-foreground line-clamp-2">
            {isProcessing ? "Analyzing content..." : item.title}
          </h3>

          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {item.type}
          </span>
        </div>
      )}

      {/* Hover Overlay (same as before) */}
      <div className="absolute inset-0 z-10 bg-linear-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
        <div className="mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2 opacity-100 flex items-center gap-2">
            {item.type}
            {isProcessing && (
              <span className="flex items-center gap-1 text-white/50 lowercase animate-pulse italic">
                <span className="h-1 w-1 rounded-full bg-white/50" />
                processing...
              </span>
            )}
          </span>

          <h3 className="text-lg font-semibold text-white leading-tight line-clamp-2">
            {item.title}
          </h3>
        </div>

        {item.summary && (
          <p className="text-xs text-white/70 line-clamp-3 mb-4 leading-relaxed">
            {item.summary}
          </p>
        )}

        {item.aiTags && item.aiTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.aiTags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-[9px] text-white/90 font-medium whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
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
