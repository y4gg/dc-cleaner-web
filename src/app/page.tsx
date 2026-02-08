"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/app-store";

export default function Page() {
  const router = useRouter();
  const token = useAppStore((state) => state.token);

  useEffect(() => {
    if (token) {
      router.replace("/servers");
    } else {
      router.replace("/auth");
    }
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="animate-pulse">Loading...</div>
    </div>
  );
}
