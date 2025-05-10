"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCurrentAdmin, logoutAdmin } from "@/services/adminService";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";

export function AdminHeader({ onLogout }: { onLogout: () => void }) {
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    const currentAdmin = getCurrentAdmin();
    setAdmin(currentAdmin);
  }, []);

  if (!admin) return null;

  // Handle logout with error checking
  const handleLogout = () => {
    try {
      // Call logoutAdmin from the service
      logoutAdmin();

      // Then call the onLogout prop if it exists and is a function
      if (onLogout && typeof onLogout === "function") {
        onLogout();
      } else {
        console.error("onLogout is not a function or is undefined");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-500">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              {/* Don't try to load an image that doesn't exist */}
              <AvatarFallback className="bg-green-600 text-white">
                {admin.name?.substring(0, 2).toUpperCase() || "AD"}
              </AvatarFallback>
            </Avatar>
            <span className="text-white">{admin.name || "Admin"}</span>
          </div>
          <Button
            variant="outline"
            className="bg-red-600 text-white border-red-500 hover:bg-red-500"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
