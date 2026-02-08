"use client";

import { PageLayout } from "@/components/page-layout";
import { DmTab } from "@/components/dm-tab";
import { useAppStore } from "@/store/app-store";

export default function DmsPage() {
  const userDms = useAppStore((state) => state.userDms);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const selectedItems = useAppStore((state) => state.selectedItems);
  const isLoading = useAppStore((state) => state.isLoading);
  const loadingItems = useAppStore((state) => state.loadingItems);
  const deletionProgress = useAppStore((state) => state.deletionProgress);

  const closeDm = useAppStore((state) => state.closeDm);
  const handleSelectItem = useAppStore((state) => state.selectItem);
  const handleSelectAll = useAppStore((state) => state.selectAll);
  const handleDeleteSelected = useAppStore((state) => state.handleDeleteSelected);

  return (
    <PageLayout>
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
    </PageLayout>
  );
}
