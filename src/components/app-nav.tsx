"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
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
        <SidebarGroupLabel>Servers</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/servers"}>
              <Link href="/servers">
                <span>Leave Servers</span>
                {userGuilds.length > 0 && (
                  <SidebarMenuBadge className="ml-auto">
                    {userGuilds.length}
                  </SidebarMenuBadge>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/mutes"}>
              <Link href="/mutes">
                <span>Mute Servers</span>
                {userGuilds.length > 0 && (
                  <SidebarMenuBadge className="ml-auto">
                    {userGuilds.length}
                  </SidebarMenuBadge>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Friends & DMs</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/friends"}>
              <Link href="/friends">
                <span>Remove Friends</span>
                {userFriends.length > 0 && (
                  <SidebarMenuBadge className="ml-auto">
                    {userFriends.length}
                  </SidebarMenuBadge>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/friend-mutes"}>
              <Link href="/friend-mutes">
                <span>Mute Friends</span>
                {userFriends.length > 0 && (
                  <SidebarMenuBadge className="ml-auto">
                    {userFriends.length}
                  </SidebarMenuBadge>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dms"}>
              <Link href="/dms">
                <span>Close DMs</span>
                {userDms.length > 0 && (
                  <SidebarMenuBadge className="ml-auto">
                    {userDms.length}
                  </SidebarMenuBadge>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
