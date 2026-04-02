import React from "react";
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
import PopoverForm from "@/components/PopoverForm";
import MediaCard from "@/components/MediaCard";
import MonthContainer from "@/components/TimelineSection";

const Home = () => {
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
          <MonthContainer />
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
              <PopoverForm />
            </PopoverContent>
          </Popover>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Home;
