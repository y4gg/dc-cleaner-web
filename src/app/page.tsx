"use client";
import { FriendTab } from "@/components/friend-tab";
import { ServerTab } from "@/components/server-tab";
import { AuthTab } from "@/components/auth-tab";
import { DmTab } from "../components/dm-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, useCallback } from "react";
import { setCookie, getCookie } from "cookies-next";
import { toast } from "sonner";

interface Guild {
  id: string;
  name: string;
}

interface Relationship {
  id: string;
  type: number;
  user: {
    id: string;
    username: string;
    discriminator: string;
  };
}

interface Channel {
  id: string;
  type: number;
  recipients: Recipient[];
}

interface Recipient {
  id: string;
  username: string;
  discriminator: string;
}

export default function Page() {
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userGuilds, setUserGuilds] = useState<Guild[]>([]);
  const [userFriends, setUserFriends] = useState<Relationship[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userDms, setUserDms] = useState<Channel[]>([]);
  const [loadingItems, setLoadingItems] = useState<string[]>([]);
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
    setToken("");
  }, []);

  const fetchUserData = useCallback(
    async (userToken: string) => {
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
    },
    [handleLogout]
  );

  // Load token from cookies on component mount
  useEffect(() => {
    const savedToken = getCookie("discord_token");
    if (savedToken) {
      setToken(savedToken as string);
      setIsAuthenticated(true);
      fetchUserData(savedToken as string);
    }
  }, [fetchUserData]);

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
          maxAge: 60 * 60 * 24 * 30, // 30 days
          secure: true,
          sameSite: "strict",
        });
        setIsAuthenticated(true);
        toast.success("Token saved successfully!");
        fetchUserData(token);
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

  const leaveServer = async (guildId: string) => {
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
      } else {
        toast.error("Failed to leave server.");
      }
    } catch (error) {
      console.error("Error leaving server:", error);
      toast.error("Error leaving server.");
    } finally {
      setLoadingItems((prev) => prev.filter((id) => id !== guildId));
    }
  };

  const removeFriend = async (userId: string) => {
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
          prevFriends.filter((friend) => friend.id !== userId)
        );
      } else {
        toast.error("Failed to remove friend.");
      }
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error("Error removing friend.");
    } finally {
      setLoadingItems((prev) => prev.filter((id) => id !== userId));
    }
  };

  const closeDm = async (channelId: string) => {
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
      } else {
        toast.error("Failed to close DM.");
      }
    } catch (error) {
      console.error("Error closing DM:", error);
      toast.error("Error closing DM.");
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
    toast.info(`Starting to delete ${totalCount} selected items...`);

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    for (const guildId of servers) {
      await leaveServer(guildId);
      await delay(1000);
    }

    for (const userId of friends) {
      await removeFriend(userId);
      await delay(1000);
    }

    for (const channelId of dms) {
      await closeDm(channelId);
      await delay(1000);
    }

    setSelectedItems({ servers: [], friends: [], dms: [] });
    setIsLoading(false);
    toast.success("Finished deleting selected items.");
  };

  const defaultTab = isAuthenticated ? "servers" : "auth";

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <Tabs defaultValue={defaultTab}>
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
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
