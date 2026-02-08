"use client";

import { PageLayout } from "@/components/page-layout";
import { FriendTab } from "@/components/friend-tab";
import { useAppStore } from "@/store/app-store";

export default function FriendsPage() {
  const userFriends = useAppStore((state) => state.userFriends);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const selectedItems = useAppStore((state) => state.selectedItems);
  const isLoading = useAppStore((state) => state.isLoading);
  const loadingItems = useAppStore((state) => state.loadingItems);
  const deletionProgress = useAppStore((state) => state.deletionProgress);

  const removeFriend = useAppStore((state) => state.removeFriend);
  const handleSelectItem = useAppStore((state) => state.selectItem);
  const handleSelectAll = useAppStore((state) => state.selectAll);
  const handleDeleteSelected = useAppStore((state) => state.handleDeleteSelected);

  return (
    <PageLayout>
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
    </PageLayout>
  );
}
