"use client";
import { FriendTab } from "@/components/friend-tab";
import { ServerTab } from "@/components/server-tab";
import { AuthTab } from "@/components/auth-tab";
import { DmTab } from "../components/dm-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, useCallback } from "react";
import { setCookie, getCookie } from "cookies-next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

interface Guild {
  id: string;
  name: string;
  icon?: string;
}

interface Relationship {
  id: string;
  type: number;
  user: {
    id: string;
    username: string;
    global_name: string;
    avatar?: string;
  };
}

interface Channel {
  id: string;
  type: number;
  recipients: Recipient[];
  name?: string;
  icon?: string;
}

interface Recipient {
  id: string;
  global_name: string;
  username: string;
  avatar?: string;
}

export default function Page() {
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userGuilds, setUserGuilds] = useState<Guild[]>([]);
  const [userFriends, setUserFriends] = useState<Relationship[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [userDms, setUserDms] = useState<Channel[]>([]);
  const [loadingItems, setLoadingItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("auth");
  const [deletionProgress, setDeletionProgress] = useState<{
    deleted: number;
    total: number;
  }>({ deleted: 0, total: 0 });
  const [selectedItems, setSelectedItems] = useState<{
    servers: string[];
    friends: string[];
    dms: string[];
  }>({
    servers: [],
    friends: [],
    dms: [],
  });

  const handleSelectItem = (
    id: string,
    type: "servers" | "friends" | "dms"
  ) => {
    setSelectedItems((prev) => {
      const newSelected = { ...prev };
      if (newSelected[type].includes(id)) {
        newSelected[type] = newSelected[type].filter((itemId) => itemId !== id);
      } else {
        newSelected[type].push(id);
      }
      return newSelected;
    });
  };

  const handleLogout = useCallback(() => {
    document.cookie =
      "discord_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsAuthenticated(false);
    setUserGuilds([]);
    setUserFriends([]);
    setUserDms([]);
    setToken("");
    setActiveTab("auth");
  }, [setActiveTab]);

  const handleRefetch = async () => {
    if (!token) return;
    
    setIsRefetching(true);
    try {
      await fetchUserData(token);
      toast.success("Data refreshed successfully!");
    } catch (error) {
      console.error("Error refetching data:", error);
      toast.error("Failed to refresh data. Please try again.");
    } finally {
      setIsRefetching(false);
    }
  };

  const fetchUserData = async (userToken: string) => {
    try {
      // Fetch user's guilds
      const guildsResponse = await fetch(
        "https://discord.com/api/users/@me/guilds",
        {
          headers: {
            Authorization: userToken,
          },
        }
      );
      if (guildsResponse.status === 401) {
        toast.error("Invalid token. You'll have to log in again.");
        handleLogout();
        return;
      }
      if (guildsResponse.ok) {
        const guilds = await guildsResponse.json();
        setUserGuilds(guilds);
      } else throw new Error("Failed to fetch user guilds");

      // Fetch user's friends (relationships)
      const friendsResponse = await fetch(
        "https://discord.com/api/users/@me/relationships",
        {
          headers: {
            Authorization: userToken,
          },
        }
      );
      if (friendsResponse.ok) {
        const relationships = await friendsResponse.json();
        const friends = relationships.filter(
          (rel: Relationship) => rel.type === 1
        ); // Type 1 = friends
        setUserFriends(friends);
      } else throw new Error("Failed to fetch user friends");
      // Fetch user's DMs
      const dmsResponse = await fetch(
        "https://discord.com/api/users/@me/channels",
        {
          headers: {
            Authorization: userToken,
          },
        }
      );
      if (dmsResponse.ok) {
        const dms = await dmsResponse.json();
        setUserDms(dms);
      } else throw new Error("Failed to fetch user DMs");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Load token from cookies on component mount
  useEffect(() => {
    const savedToken = getCookie("discord_token");
    if (savedToken) {
      setToken(savedToken as string);
      setIsAuthenticated(true);
      fetchUserData(savedToken as string);
      setActiveTab("servers");
    } else {
      setActiveTab("auth");
    }
  }, [setActiveTab]);

  const handleTokenSave = async () => {
    if (!token.trim()) {
      toast.error("Please enter a Discord token");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://discord.com/api/users/@me/guilds", {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.ok) {
        setCookie("discord_token", token, {
          // maxAge: 60 * 60 * 24 * 30, // 30 days
          secure: true,
          sameSite: "strict",
        });
        setIsAuthenticated(true);
        toast.success("Token saved successfully!");
        await fetchUserData(token);
        setActiveTab("servers");
      } else {
        toast.error("Invalid token. Please check your Discord token.");
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      toast.error("Error verifying token. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const leaveServer = async (guildId: string): Promise<boolean> => {
    setLoadingItems((prev) => [...prev, guildId]);
    try {
      const response = await fetch(
        `https://discord.com/api/users/@me/guilds/${guildId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success(`Successfully left server!`);
        setUserGuilds((prevGuilds) =>
          prevGuilds.filter((guild) => guild.id !== guildId)
        );
        return true;
      } else {
        toast.error("Failed to leave server.");
        return false;
      }
    } catch (error) {
      console.error("Error leaving server:", error);
      toast.error("Error leaving server.");
      return false;
    } finally {
      setLoadingItems((prev) => prev.filter((id) => id !== guildId));
    }
  };

  const removeFriend = async (userId: string): Promise<boolean> => {
    setLoadingItems((prev) => [...prev, userId]);
    try {
      const response = await fetch(
        `https://discord.com/api/users/@me/relationships/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success(`Successfully removed friend!`);
        setUserFriends((prevFriends) =>
          prevFriends.filter((friend) => friend.user.id !== userId)
        );
        return true;
      } else {
        toast.error("Failed to remove friend.");
        return false;
      }
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error("Error removing friend.");
      return false;
    } finally {
      setLoadingItems((prev) => prev.filter((id) => id !== userId));
    }
  };

  const closeDm = async (channelId: string): Promise<boolean> => {
    setLoadingItems((prev) => [...prev, channelId]);
    try {
      const response = await fetch(
        `https://discord.com/api/channels/${channelId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success(`Successfully closed DM!`);
        setUserDms((prevDms) => prevDms.filter((dm) => dm.id !== channelId));
        return true;
      } else {
        toast.error("Failed to close DM.");
        return false;
      }
    } catch (error) {
      console.error("Error closing DM:", error);
      toast.error("Error closing DM.");
      return false;
    } finally {
      setLoadingItems((prev) => prev.filter((id) => id !== channelId));
    }
  };

  const handleSelectAll = (
    type: "servers" | "friends" | "dms",
    ids: string[]
  ) => {
    setSelectedItems((prev) => {
      const newSelected = { ...prev };
      const currentSelected = newSelected[type];
      if (currentSelected.length === ids.length) {
        newSelected[type] = [];
      } else {
        newSelected[type] = ids;
      }
      return newSelected;
    });
  };

  const handleDeleteSelected = async () => {
    const { servers, friends, dms } = selectedItems;
    const totalCount = servers.length + friends.length + dms.length;

    if (totalCount === 0) {
      toast.info("No items selected for deletion.");
      return;
    }

    setIsLoading(true);
    let deletedCount = 0;
    setDeletionProgress({ deleted: 0, total: totalCount });
    toast.info(`Starting to delete ${totalCount} selected items...`);

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    for (const guildId of servers) {
      const success = await leaveServer(guildId);
      if (success) {
        deletedCount++;
        setDeletionProgress({ deleted: deletedCount, total: totalCount });
      }
      await delay(1000);
    }

    for (const userId of friends) {
      const success = await removeFriend(userId);
      if (success) {
        deletedCount++;
        setDeletionProgress({ deleted: deletedCount, total: totalCount });
      }
      await delay(1000);
    }

    for (const channelId of dms) {
      const success = await closeDm(channelId);
      if (success) {
        deletedCount++;
        setDeletionProgress({ deleted: deletedCount, total: totalCount });
      }
      await delay(1000);
    }

    setSelectedItems({ servers: [], friends: [], dms: [] });
    setIsLoading(false);
    toast.success("Finished deleting selected items.");
    setTimeout(() => setDeletionProgress({ deleted: 0, total: 0 }), 2000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="auth">Discord Token</TabsTrigger>
            <TabsTrigger value="servers">
              Servers ({userGuilds.length})
            </TabsTrigger>
            <TabsTrigger value="friends">
              Friends ({userFriends.length})
            </TabsTrigger>
            <TabsTrigger value="dms">Open dms ({userDms.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="auth">
            <AuthTab
              isAuthenticated={isAuthenticated}
              token={token}
              setToken={setToken}
              isLoading={isLoading}
              handleTokenSave={handleTokenSave}
              handleLogout={handleLogout}
              onRefetch={handleRefetch}
              isRefetching={isRefetching}
            />
          </TabsContent>
          <TabsContent value="servers">
            <ServerTab
              userGuilds={userGuilds}
              isAuthenticated={isAuthenticated}
              leaveServer={leaveServer}
              selectedItems={selectedItems}
              handleSelectItem={handleSelectItem}
              handleDeleteSelected={handleDeleteSelected}
              isLoading={isLoading}
              loadingItems={loadingItems}
              handleSelectAll={handleSelectAll}
              deletionProgress={deletionProgress}
            />
          </TabsContent>
          <TabsContent value="friends">
            <FriendTab
              userFriends={userFriends}
              isAuthenticated={isAuthenticated}
              removeFriend={removeFriend}
              selectedItems={selectedItems}
              handleSelectItem={handleSelectItem}
              handleDeleteSelected={handleDeleteSelected}
              isLoading={isLoading}
              loadingItems={loadingItems}
              handleSelectAll={handleSelectAll}
              deletionProgress={deletionProgress}
            />
          </TabsContent>
          <TabsContent value="dms">
            <DmTab
              userDms={userDms}
              isAuthenticated={isAuthenticated}
              closeDm={closeDm}
              selectedItems={selectedItems}
              handleSelectItem={handleSelectItem}
              handleDeleteSelected={handleDeleteSelected}
              isLoading={isLoading}
              loadingItems={loadingItems}
              handleSelectAll={handleSelectAll}
              deletionProgress={deletionProgress}
            />
          </TabsContent>
        </Tabs>
        <div className="flex gap-2 items-center justify-center mt-4">
          <Button variant={"link"} asChild>
            <a href="https://y4.gg">Developed by y4.gg</a>
          </Button>
          <Button variant={"ghost"} size={"icon"} className="size-8">
            <a href="https://github.com/y4gg/dc-cleaner-web">
              <Github />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
