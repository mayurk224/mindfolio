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
            <SearchNavbar className="flex-1" />
          </div>
        </header>

        <div className="p-4">
          <TimelineSection items={items} isLoading={isLoading} />
        </div>

        <div className="fixed bottom-5 right-5">
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
