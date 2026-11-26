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
import {
  ArchiveX,
  BellOff,
  MessageSquareX,
  UserRoundMinus,
  VolumeX,
} from "lucide-react";
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
          {userGuilds.length > 0 && <span className="dc-group-count">{userGuilds.length}</span>}
        </SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/servers"}>
              <Link href="/servers">
                <ArchiveX aria-hidden="true" />
                <span>Leave</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/mutes"}>
              <Link href="/mutes">
                <VolumeX aria-hidden="true" />
                <span>Mute</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>
          Friends
          {userFriends.length > 0 && <span className="dc-group-count">{userFriends.length}</span>}
        </SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/friends"}>
              <Link href="/friends">
                <UserRoundMinus aria-hidden="true" />
                <span>Remove</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>
          Conversations
          {userDms.length > 0 && <span className="dc-group-count">{userDms.length}</span>}
        </SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dms"}>
              <Link href="/dms">
                <MessageSquareX aria-hidden="true" />
                <span>Close</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dm-mutes"}>
              <Link href="/dm-mutes">
                <BellOff aria-hidden="true" />
                <span>Mute</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
