"use client";

import { PageLayout } from "@/components/page-layout";
import { MuteDmsTab } from "@/components/mute-dms-tab";
import { useAppStore } from "@/store/app-store";

export default function DmMutesPage() {
  const userDms = useAppStore((state) => state.userDms);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const selectedItems = useAppStore((state) => state.selectedItems);
  const isLoading = useAppStore((state) => state.isLoading);
  const loadingItems = useAppStore((state) => state.loadingItems);
  const deletionProgress = useAppStore((state) => state.deletionProgress);

  const muteDm = useAppStore((state) => state.muteDm);
  const handleSelectItem = useAppStore((state) => state.selectItem);
  const handleSelectAll = useAppStore((state) => state.selectAll);
  const handleMuteDmsSelected = useAppStore((state) => state.handleMuteDmsSelected);

  return (
    <PageLayout>
      <MuteDmsTab
        userDms={userDms}
        isAuthenticated={isAuthenticated}
        muteDm={muteDm}
        selectedItems={selectedItems}
        handleSelectItem={handleSelectItem}
        handleMuteDmsSelected={handleMuteDmsSelected}
        isLoading={isLoading}
        loadingItems={loadingItems}
        handleSelectAll={handleSelectAll}
        deletionProgress={deletionProgress}
      />
    </PageLayout>
  );
}
