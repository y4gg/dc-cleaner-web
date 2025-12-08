"use client";
import { FriendTab } from "@/components/friend-tab";
import { ServerTab } from "@/components/leave-server-tab";
import { AuthTab } from "@/components/auth-tab";
import { DmTab } from "../components/dm-tab";
import { ServerTab as MuteServerTab } from "@/components/mute-servers-tab";
import { MuteFriendsTab } from "@/components/mute-friends-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, useCallback } from "react";
import { setCookie, getCookie } from "cookies-next";
import { toast } from "sonner";
import { InfoTab } from "@/components/info-tab";

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

type SelectionType =
  | "servers"
  | "friends"
  | "dms"
  | "mutes"
  | "friendMutes";

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
    mutes: string[];
    friendMutes: string[];
  }>({
    servers: [],
    friends: [],
    dms: [],
    mutes: [],
    friendMutes: [],
  });

  const handleSelectItem = (
    id: string,
    type: SelectionType
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

  const fetchUserData = useCallback(async (userToken: string) => {
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
  }, [handleLogout]);

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
  }, [setActiveTab, fetchUserData]);

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

  const muteServer = async (guildId: string): Promise<boolean> => {
    setLoadingItems((prev) => [...prev, guildId]);
    try {
      const payload = {
        guilds: {
          [guildId]: {
            muted: true,
            mute_config: {
              selected_time_window: -1,
              end_time: null,
            },
          },
        },
      };

      const response = await fetch(
        "https://discord.com/api/v9/users/@me/guilds/settings",
        {
          method: "PATCH",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        toast.success(`Successfully muted server!`);
        return true;
      } else {
        toast.error("Failed to mute server.");
        return false;
      }
    } catch (error) {
      console.error("Error muting server:", error);
      toast.error("Error muting server.");
      return false;
    } finally {
      setLoadingItems((prev) => prev.filter((id) => id !== guildId));
    }
  };

  const handleSelectAll = (type: SelectionType, ids: string[]) => {
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

    setSelectedItems({
      servers: [],
      friends: [],
      dms: [],
      mutes: [],
      friendMutes: [],
    });
    setIsLoading(false);
    toast.success("Finished deleting selected items.");
    setTimeout(() => setDeletionProgress({ deleted: 0, total: 0 }), 2000);
  };

  const handleMuteSelected = async () => {
    const { mutes } = selectedItems;
    const totalCount = mutes.length;

    if (totalCount === 0) {
      toast.info("No servers selected for muting.");
      return;
    }

    setIsLoading(true);
    let mutedCount = 0;
    setDeletionProgress({ deleted: 0, total: totalCount });
    toast.info(`Starting to mute ${totalCount} selected servers...`);

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    for (const guildId of mutes) {
      const success = await muteServer(guildId);
      if (success) {
        mutedCount++;
        setDeletionProgress({ deleted: mutedCount, total: totalCount });
      }
      await delay(1000);
    }

    setSelectedItems((prev) => ({ ...prev, mutes: [] }));
    setIsLoading(false);
    toast.success("Finished muting selected servers.");
    setTimeout(() => setDeletionProgress({ deleted: 0, total: 0 }), 2000);
  };

  const muteFriend = async (userId: string): Promise<boolean> => {
    setLoadingItems((prev) => [...prev, userId]);
    try {
      const dmChannel = userDms.find(
        (dm) =>
          dm.type === 1 && dm.recipients.some((recipient) => recipient.id === userId)
      );

      if (!dmChannel) {
        toast.error("No DM channel found for this friend to mute.");
        return false;
      }

      const payload = {
        channel_overrides: [
          {
            channel_id: dmChannel.id,
            muted: true,
            mute_config: {
              selected_time_window: -1,
              end_time: null,
            },
          },
        ],
      };

      const response = await fetch(
        "https://discord.com/api/v9/users/@me/settings",
        {
          method: "PATCH",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        toast.success(`Successfully muted friend!`);
        return true;
      } else {
        toast.error("Failed to mute friend.");
        return false;
      }
    } catch (error) {
      console.error("Error muting friend:", error);
      toast.error("Error muting friend.");
      return false;
    } finally {
      setLoadingItems((prev) => prev.filter((id) => id !== userId));
    }
  };

  const handleMuteFriendsSelected = async () => {
    const { friendMutes } = selectedItems;
    const totalCount = friendMutes.length;

    if (totalCount === 0) {
      toast.info("No friends selected for muting.");
      return;
    }

    setIsLoading(true);
    let mutedCount = 0;
    setDeletionProgress({ deleted: 0, total: totalCount });
    toast.info(`Starting to mute ${totalCount} selected friends...`);

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    for (const userId of friendMutes) {
      const success = await muteFriend(userId);
      if (success) {
        mutedCount++;
        setDeletionProgress({ deleted: mutedCount, total: totalCount });
      }
      await delay(1000);
    }

    setSelectedItems((prev) => ({ ...prev, friendMutes: [] }));
    setIsLoading(false);
    toast.success("Finished muting selected friends.");
    setTimeout(() => setDeletionProgress({ deleted: 0, total: 0 }), 2000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="auth">Discord Token</TabsTrigger>
            <TabsTrigger value="servers">
              Leave Servers ({userGuilds.length})
            </TabsTrigger>
            <TabsTrigger value="mutes">
              Mute Servers ({userGuilds.length})
            </TabsTrigger>
            <TabsTrigger value="friends">
              Remove Friends ({userFriends.length})
            </TabsTrigger>
            <TabsTrigger value="friend-mutes">
              Mute Friends ({userFriends.length})
            </TabsTrigger>
            <TabsTrigger value="dms">Close dms ({userDms.length})</TabsTrigger>
            <TabsTrigger value="info">Q&A</TabsTrigger>
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
          <TabsContent value="friend-mutes">
            <MuteFriendsTab
              userFriends={userFriends}
              isAuthenticated={isAuthenticated}
              muteFriend={muteFriend}
              selectedItems={selectedItems}
              handleSelectItem={handleSelectItem}
              handleMuteFriendsSelected={handleMuteFriendsSelected}
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
          <TabsContent value="mutes">
            <MuteServerTab
              userGuilds={userGuilds}
              isAuthenticated={isAuthenticated}
              muteServer={muteServer}
              selectedItems={selectedItems}
              handleSelectItem={handleSelectItem}
              handleMuteSelected={handleMuteSelected}
              isLoading={isLoading}
              loadingItems={loadingItems}
              handleSelectAll={handleSelectAll}
              deletionProgress={deletionProgress}
            />
          </TabsContent>
          <TabsContent value="info">
            <InfoTab/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
