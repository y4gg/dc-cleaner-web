"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAppStore } from "@/store/app-store";

export function AppNav() {
  const pathname = usePathname();
  const userGuilds = useAppStore((state) => state.userGuilds);
  const userFriends = useAppStore((state) => state.userFriends);
  const userDms = useAppStore((state) => state.userDms);

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>
          Servers
          {userGuilds.length > 0 && <span className="ml-auto opacity-60">{userGuilds.length}</span>}
        </SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/servers"}>
              <Link href="/servers">
                <span>Leave</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/mutes"}>
              <Link href="/mutes">
                <span>Mute</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>
          Friends
          {userFriends.length > 0 && <span className="ml-auto opacity-60">{userFriends.length}</span>}
        </SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/friends"}>
              <Link href="/friends">
                <span>Remove</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/friend-mutes"}>
              <Link href="/friend-mutes">
                <span>Mute</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>
          DMs
          {userDms.length > 0 && <span className="ml-auto opacity-60">{userDms.length}</span>}
        </SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dms"}>
              <Link href="/dms">
                <span>Close</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dm-mutes"}>
              <Link href="/dm-mutes">
                <span>Mute</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
