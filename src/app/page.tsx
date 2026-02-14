"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageLayout } from "@/components/page-layout";
import { AuthTab } from "@/components/auth-tab";
import { InfoTab } from "@/components/info-tab";
import { useAppStore } from "@/store/app-store";

export default function Page() {
  const router = useRouter();
  const token = useAppStore((state) => state.token);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const isLoading = useAppStore((state) => state.isLoading);
  const isRefetching = useAppStore((state) => state.isRefetching);
  const setToken = useAppStore((state) => state.setToken);
  const setLoading = useAppStore((state) => state.setLoading);
  const handleLogout = useAppStore((state) => state.handleLogout);
  const handleRefetch = useAppStore((state) => state.handleRefetch);
  const fetchUserData = useAppStore((state) => state.fetchUserData);

  const handleTokenSave = async () => {

    if (!token.trim()) {
      toast.error("Please enter a Discord token");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://discord.com/api/users/@me", {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (response.ok) {
        toast.success("Token saved successfully!");
        await fetchUserData();
        router.push("/servers");
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

  return (
    <PageLayout>
      <div className="space-y-4">
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
        <InfoTab />
      </div>
    </PageLayout>
  );
}
