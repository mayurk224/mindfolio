import { useEffect } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Loader2 } from "lucide-react";
import MediaCard from "./MediaCard";
import { cn } from "@/lib/utils";

export default function TimelineSection({ items = [], isLoading = false }) {



  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">
          Loading your timeline...
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-3xl border-muted/20">
        <h3 className="text-xl font-semibold mb-2">No items found</h3>
        <p className="text-muted-foreground max-w-xs">
          Start building your mindfolio by adding links, articles, or notes.
        </p>
      </div>
    );
  }

  // Group items by Month Year -> Day ISO
  const groupedItems = items.reduce((acc, item) => {
    const date = new Date(item.createdAt);
    const monthYear = date.toLocaleString("en-IN", {
      month: "long",
      year: "numeric",
    });
    const dayKey = date.toISOString().split("T")[0];

    if (!acc[monthYear]) acc[monthYear] = { days: {}, sortDate: date };
    if (!acc[monthYear].days[dayKey]) acc[monthYear].days[dayKey] = [];
    acc[monthYear].days[dayKey].push(item);
    return acc;
  }, {});

  // Sort months latest first
  const sortedMonths = Object.entries(groupedItems).sort(
    ([, a], [, b]) => b.sortDate - a.sortDate,
  );

  return (
    <div className="flex flex-col gap-12">
      {sortedMonths.map(([monthYear, monthData]) => (
        <Collapsible key={monthYear} defaultOpen>
          {/* Header */}
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground/90">
              {monthYear}
            </h2>

            <Separator className="flex-1" />

            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-secondary/50 transition-all data-[state=open]:rotate-180"
              >
                <ChevronDown className="h-5 w-5" />
              </Button>
            </CollapsibleTrigger>
          </div>

          {/* Content (collapsible) */}
          <CollapsibleContent className="mt-6 flex flex-col gap-10">
            {Object.entries(monthData.days)
              .sort(([dayA], [dayB]) => new Date(dayB) - new Date(dayA))
              .map(([dayKey, dayItems]) => (
                <div key={dayKey} className="flex flex-col gap-4">
                  {/* Day Header */}
                  <h3 className="text-sm font-semibold text-muted-foreground/80 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {new Date(dayKey).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                    })}
                  </h3>

                  {/* MediaCard Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {dayItems.map((item) => (
                      <MediaCard
                        key={item._id}
                        title={item.title}
                        category={item.type}
                        image={item.thumbnailUrl || undefined}
                        className={cn(!item.thumbnailUrl && "aspect-auto")}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}
