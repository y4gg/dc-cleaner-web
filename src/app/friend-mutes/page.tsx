"use client";

import { PageLayout } from "@/components/page-layout";
import { MuteFriendsTab } from "@/components/mute-friends-tab";
import { useAppStore } from "@/store/app-store";

export default function FriendMutesPage() {
  const userFriends = useAppStore((state) => state.userFriends);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const selectedItems = useAppStore((state) => state.selectedItems);
  const isLoading = useAppStore((state) => state.isLoading);
  const loadingItems = useAppStore((state) => state.loadingItems);
  const deletionProgress = useAppStore((state) => state.deletionProgress);

  const muteFriend = useAppStore((state) => state.muteFriend);
  const handleSelectItem = useAppStore((state) => state.selectItem);
  const handleSelectAll = useAppStore((state) => state.selectAll);
  const handleMuteFriendsSelected = useAppStore((state) => state.handleMuteFriendsSelected);

  return (
    <PageLayout>
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
    </PageLayout>
  );
}
