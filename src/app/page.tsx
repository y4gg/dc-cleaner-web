"use client";
import { FriendTab } from "@/components/friend-tab";
import { ServerTab } from "@/components/leave-server-tab";
import { AuthTab } from "@/components/auth-tab";
import { DmTab } from "../components/dm-tab";
import { ServerTab as MuteServerTab } from "@/components/mute-servers-tab";
import { MuteFriendsTab } from "@/components/mute-friends-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";
import { toast } from "sonner";
import { InfoTab } from "@/components/info-tab";
import { useAppStore } from "@/store/app-store";

export default function Page() {
  const token = useAppStore((state) => state.token);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const userGuilds = useAppStore((state) => state.userGuilds);
  const userFriends = useAppStore((state) => state.userFriends);
  const userDms = useAppStore((state) => state.userDms);
  const isLoading = useAppStore((state) => state.isLoading);
  const isRefetching = useAppStore((state) => state.isRefetching);
  const loadingItems = useAppStore((state) => state.loadingItems);
  const activeTab = useAppStore((state) => state.activeTab);
  const deletionProgress = useAppStore((state) => state.deletionProgress);
  const selectedItems = useAppStore((state) => state.selectedItems);

  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const setToken = useAppStore((state) => state.setToken);
  const setLoading = useAppStore((state) => state.setLoading);

  const handleSelectItem = useAppStore((state) => state.selectItem);
  const handleLogout = useAppStore((state) => state.handleLogout);
  const handleRefetch = useAppStore((state) => state.handleRefetch);
  const fetchUserData = useAppStore((state) => state.fetchUserData);

  const leaveServer = useAppStore((state) => state.leaveServer);
  const removeFriend = useAppStore((state) => state.removeFriend);
  const closeDm = useAppStore((state) => state.closeDm);
  const muteServer = useAppStore((state) => state.muteServer);
  const muteFriend = useAppStore((state) => state.muteFriend);

  const handleSelectAll = useAppStore((state) => state.selectAll);
  const handleDeleteSelected = useAppStore((state) => state.handleDeleteSelected);
  const handleMuteSelected = useAppStore((state) => state.handleMuteSelected);
  const handleMuteFriendsSelected = useAppStore((state) => state.handleMuteFriendsSelected);

  const handleTokenSave = async () => {
    if (!token.trim()) {
      toast.error("Please enter a Discord token");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://discord.com/api/users/@me/guilds", {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.ok) {
        toast.success("Token saved successfully!");
        await fetchUserData();
        setActiveTab("servers");
      } else {
        toast.error("Invalid token. Please check your Discord token.");
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      toast.error("Error verifying token. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserData();
      setActiveTab("servers");
    } else {
      setActiveTab("auth");
    }
  }, [token, fetchUserData, setActiveTab]);

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
