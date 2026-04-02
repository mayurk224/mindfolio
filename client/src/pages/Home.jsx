import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import SearchNavbar from "@/components/navbar/SearchNavbar";

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

        <div className="flex flex-1 flex-col gap-4 p-4">
          {Array.from({ length: 24 }).map((_, index) => (
            <div
              key={index}
              className="aspect-video h-12 w-full rounded-lg bg-muted/50"
            />
          ))}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Home;
