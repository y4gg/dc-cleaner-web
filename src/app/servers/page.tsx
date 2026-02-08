"use client";

import { PageLayout } from "@/components/page-layout";
import { ServerTab } from "@/components/leave-server-tab";
import { useAppStore } from "@/store/app-store";

export default function ServersPage() {
  const userGuilds = useAppStore((state) => state.userGuilds);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const selectedItems = useAppStore((state) => state.selectedItems);
  const isLoading = useAppStore((state) => state.isLoading);
  const loadingItems = useAppStore((state) => state.loadingItems);
  const deletionProgress = useAppStore((state) => state.deletionProgress);

  const leaveServer = useAppStore((state) => state.leaveServer);
  const handleSelectItem = useAppStore((state) => state.selectItem);
  const handleSelectAll = useAppStore((state) => state.selectAll);
  const handleDeleteSelected = useAppStore((state) => state.handleDeleteSelected);

  return (
    <PageLayout>
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
    </PageLayout>
  );
}
