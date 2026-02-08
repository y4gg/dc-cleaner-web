"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <PageHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="w-full max-w-2xl mx-auto">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function PageHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <PageTitle />
    </header>
  );
}

function PageTitle() {
  const pathname = usePathname();
  
  const titles: Record<string, string> = {
    "/auth": "Discord Token",
    "/servers": "Leave Servers",
    "/mutes": "Mute Servers",
    "/friends": "Remove Friends",
    "/friend-mutes": "Mute Friends",
    "/dms": "Close DMs",
    "/info": "Q&A",
  };
  
  return (
    <h1 className="text-lg font-semibold">
      {titles[pathname] || "Discord Cleaner"}
    </h1>
  );
}

import { usePathname } from "next/navigation";
