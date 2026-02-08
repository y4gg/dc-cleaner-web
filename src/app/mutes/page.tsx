"use client";

import { PageLayout } from "@/components/page-layout";
import { ServerTab as MuteServerTab } from "@/components/mute-servers-tab";
import { useAppStore } from "@/store/app-store";

export default function MutesPage() {
  const userGuilds = useAppStore((state) => state.userGuilds);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const selectedItems = useAppStore((state) => state.selectedItems);
  const isLoading = useAppStore((state) => state.isLoading);
  const loadingItems = useAppStore((state) => state.loadingItems);
  const deletionProgress = useAppStore((state) => state.deletionProgress);

  const muteServer = useAppStore((state) => state.muteServer);
  const handleSelectItem = useAppStore((state) => state.selectItem);
  const handleSelectAll = useAppStore((state) => state.selectAll);
  const handleMuteSelected = useAppStore((state) => state.handleMuteSelected);

  return (
    <PageLayout>
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
    </PageLayout>
  );
}
