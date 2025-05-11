"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentAdmin } from "@/services/adminService";
import { getCurrentUser } from "@/services/eventService";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in as admin
    const admin = getCurrentAdmin();
    if (admin) {
      router.push("/admin");
      return;
    }

    // Check if user is already logged in as regular user
    const user = getCurrentUser();
    if (user) {
      router.push("/user");
      return;
    }

    // Default to user login
    router.push("/user");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="animate-pulse text-green-500 text-xl">Redirecting...</div>
    </div>
  );
}
