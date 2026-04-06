import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuthContext } from "@/context/AuthContext";
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
import { Button, buttonVariants } from "@/components/ui/button";
import TimelineSection from "@/components/TimelineSection";
import CollectionSection from "@/components/CollectionSection";
import { useItem } from "@/hooks/useItem";
import PopoverForm from "@/components/PopoverForm";

const Home = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [sidebarTab, setSidebarTab] = useState("Home");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerTarget = useRef(null);
  const { user } = useAuthContext();
  const { fetchItems, fetchDeletedItems, isLoading } = useItem();

  useEffect(() => {
    if (!user?._id) return;

    const socketUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:8000";
    const socket = io(socketUrl, {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
      socket.emit("join-room", user._id);
    });

    socket.on("new-item", (newItem) => {
      console.log("Received new-item via socket:", newItem);
      setItems((prev) => {
        // Prevent duplicate if already added via manual UI
        const exists = prev.some((item) => item._id === newItem._id);
        if (exists) return prev;
        return [newItem, ...prev];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [user?._id]);

  useEffect(() => {
    const getInitialItems = async () => {
      setItems([]);
      setPage(1);
      setHasMore(true);

      const result =
        sidebarTab === "Trash" ? await fetchDeletedItems(1, 20) : await fetchItems(1, 20);

      if (result.success && result.items) {
        setItems(result.items);
        setHasMore(result.hasMore);
      }
    };
    getInitialItems();
  }, [sidebarTab]);

  const loadMore = async () => {
    if (isFetchingMore || !hasMore || isSearching) return;

    setIsFetchingMore(true);
    const nextPage = page + 1;
    const result =
      sidebarTab === "Trash"
        ? await fetchDeletedItems(nextPage, 20)
        : await fetchItems(nextPage, 20);

    if (result.success) {
      setItems((prev) => {
        const newItems = result.items.filter(
          (newItem) => !prev.some((p) => p._id === newItem._id)
        );
        return [...prev, ...newItems];
      });
      setHasMore(result.hasMore);
      setPage(nextPage);
    }
    setIsFetchingMore(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isFetchingMore &&
          !isSearching
        ) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isFetchingMore, page, isSearching]);

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
      const result =
        sidebarTab === "Trash" ? await fetchDeletedItems(1, 20) : await fetchItems(1, 20);
      if (result.success) {
        setItems(result.items || []);
        setHasMore(result.hasMore);
        setPage(1);
      }
      return;
    }

    setIsSearching(true);
    setHasMore(false); // Disable infinite scroll during search for now
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
    const result =
      sidebarTab === "Trash" ? await fetchDeletedItems(1, 20) : await fetchItems(1, 20);
    if (result.success) {
      setItems(result.items || []);
      setHasMore(result.hasMore);
      setPage(1);
    }
  };

  const filteredItems =
    activeTab === "all"
      ? items
      : items.filter((item) => item.type === activeTab);

  return (
    <SidebarProvider defaultOpen={false} className="h-screen overflow-hidden">
      <AppSidebar activeTab={sidebarTab} onTabChange={setSidebarTab} />

      <SidebarInset className="h-full overflow-y-auto">
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

        <div className="p-4 md:p-6">
          {sidebarTab === "Trash" && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                <span className="p-2 rounded-2xl bg-destructive/10 text-destructive">
                  <Plus className="h-6 w-6 rotate-45" /> 
                </span>
                Delete Section
              </h1>
              <p className="text-muted-foreground mt-2">
                Items you've soft-deleted will appear here for 30 days.
              </p>
            </div>
          )}

          {sidebarTab === "Home" && (
            <TimelineSection
              items={filteredItems}
              isLoading={isLoading && page === 1}
              onItemUpdate={handleItemUpdated}
              onItemDelete={handleItemDeleted}
            />
          )}

          {sidebarTab === "Trash" && (
            <TimelineSection
              items={filteredItems}
              isLoading={isLoading && page === 1}
              onItemUpdate={handleItemUpdated}
              onItemDelete={handleItemDeleted}
            />
          )}

          {sidebarTab === "Collection" && (
            <CollectionSection
              onItemUpdate={handleItemUpdated}
              onItemDelete={handleItemDeleted}
            />
          )}

          {/* Sentinel for infinite scroll */}
          <div ref={observerTarget} className="h-10 w-full flex items-center justify-center mt-4">
            {isFetchingMore && (
              <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                <div className="h-2 w-2 bg-primary rounded-full" />
                <div className="h-2 w-2 bg-primary rounded-full delay-75" />
                <div className="h-2 w-2 bg-primary rounded-full delay-150" />
                <span className="text-sm font-medium ml-2">Loading more ideas...</span>
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-5 right-5 z-50">
          <Popover>
            <PopoverTrigger className={buttonVariants({ variant: "default" })}>
              <Plus className="h-4 w-4" />
              Add Item
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
