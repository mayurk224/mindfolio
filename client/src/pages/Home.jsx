import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import SearchNavbar from "@/components/navbar/SearchNavbar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TimelineSection from "@/components/TimelineSection";
import { useItem } from "@/hooks/useItem";
import PopoverForm from "@/components/PopoverForm";

const Home = () => {
  const [items, setItems] = useState([]);
  const { fetchItems, isLoading } = useItem();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const getInitialItems = async () => {
      const result = await fetchItems();
      if (result.success && result.items) {
        setItems(result.items);
      } else if (result.success && !result.items) {
        // Fallback for different return structure if any
        setItems(result.data?.items || []);
      }
    };
    getInitialItems();
  }, []);

  const handleItemAdded = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
  };

  const handleItemUpdated = (updatedItem) => {
    setItems((prev) =>
      prev.map((item) => (item._id === updatedItem._id ? updatedItem : item)),
    );
  };

  const handleItemDeleted = (deletedId) => {
    setItems((prev) => prev.filter((item) => item._id !== deletedId));
  };

  // 1. Your existing fetch function (make sure it's reusable like this)

  // 2. The NEW AI Vector Search function
  const handleSearch = async (e) => {
    e.preventDefault(); // Stop page reload

    // If the search bar is empty, just grab the normal timeline
    if (!searchQuery.trim()) {
      const result = await fetchItems();
      if (result.success) setItems(result.items || []);
      return;
    }

    setIsSearching(true);
    try {
      const baseUrl =
        import.meta.env.VITE_API_URL || "http://localhost:8000/api";
      // Notice we use encodeURIComponent to safely pass spaces and symbols in the URL
      const response = await fetch(
        `${baseUrl}/items/search?q=${encodeURIComponent(searchQuery)}`,
        {
          credentials: "include",
        },
      );

      if (response.ok) {
        const searchResults = await response.json();
        setItems(searchResults); // Instantly replaces the timeline with search results!
      }
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  // 3. A quick helper to clear the search
  const clearSearch = async () => {
    setSearchQuery("");
    const result = await fetchItems();
    if (result.success) setItems(result.items || []);
  };

  const filteredItems =
    activeTab === "all"
      ? items
      : items.filter((item) => item.type === activeTab);

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />

      <SidebarInset>
        <header className="sticky top-0 flex flex-col shrink-0 gap-4 border-b bg-background/95 backdrop-blur-sm z-50 px-4 md:px-6 pt-4 md:pt-6">
          <div className="flex gap-2">
            <SidebarTrigger className="-ml-1 h-8 w-8 hover:bg-accent transition-colors" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 hidden md:block"
            />
            <SearchNavbar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              isSearching={isSearching}
              clearSearch={clearSearch}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              className="flex-1"
            />
          </div>
        </header>

        <div className="p-4">
          <TimelineSection
            items={filteredItems}
            isLoading={isLoading}
            onItemUpdate={handleItemUpdated}
            onItemDelete={handleItemDeleted}
          />
        </div>

        <div className="fixed bottom-5 right-5 z-50">
          <Popover>
            <PopoverTrigger>
              <Button>
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96">
              <PopoverForm onSuccess={handleItemAdded} />
            </PopoverContent>
          </Popover>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Home;
