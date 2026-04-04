import React, { useState } from "react";

import { cn } from "@/lib/utils";
import {
  CircleFadingPlus,
  File,
  FileCode,
  Globe,
  Image,
  Loader2,
  Newspaper,
  NotebookPen,
  Play,
  Quote,
  Search,
  Video,
  X,
} from "lucide-react";

const tabs = [
  { id: "web", label: "Web Pages", icon: Globe },
  { id: "images", label: "Images", icon: Image },
  { id: "videos", label: "Videos", icon: Video },
  { id: "documents", label: "Documents", icon: File },
  { id: "articles", label: "Articles", icon: Newspaper },
  { id: "notes", label: "Notes", icon: NotebookPen },
  { id: "youtube", label: "YouTube Videos", icon: Play },
  { id: "quotes", label: "Quotes", icon: Quote },
  { id: "posts", label: "Posts", icon: CircleFadingPlus },
  { id: "snippets", label: "Snippets", icon: FileCode },
];

const SearchNavbar = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  isSearching,
  clearSearch,
  className,
}) => {
  const [activeTab, setActiveTab] = useState("web");

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {/* Search Input Section */}
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-1 pointer-events-none">
          {isSearching ? (
            <Loader2 className="h-6 w-6 md:h-8 md:w-8 text-primary animate-spin" />
          ) : (
            <Search className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground/50 group-focus-within:text-primary transition-colors duration-300" />
          )}
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search my mind..."
          className="w-full bg-transparent pl-10 md:pl-12 pr-10 md:pr-12 py-2 text-2xl md:text-4xl italic font-light text-foreground placeholder:text-muted-foreground focus:outline-none border-b border-transparent focus:border-border transition-all duration-300"
        />
        {searchQuery && !isSearching && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-1 text-muted-foreground/50 hover:text-foreground transition-colors"
          >
            <X className="h-6 w-6 md:h-8 md:w-8" />
          </button>
        )}
        <div className="absolute bottom-0 left-0 w-0 h-px bg-primary group-focus-within:w-full transition-all duration-500" />
      </form>

      {/* Tabs Section */}
      <div className="flex w-full items-center gap-1.5 md:gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1 touch-pan-x">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-medium transition-all duration-200",
                "hover:scale-105 active:scale-95",
                isActive
                  ? "bg-accent text-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchNavbar;
