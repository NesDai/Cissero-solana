"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCurrentUser, logoutUser } from "@/services/eventService";
import { useEffect, useState } from "react";
import { LogOut, MessageSquare, Bell } from "lucide-react";
import Link from "next/link";

export function UserHeader({ onLogout }: { onLogout: () => void }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  if (!user) return null;

  // Handle logout with error checking
  const handleLogout = () => {
    try {
      // Call logoutUser from the service
      logoutUser();

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
        <div className="flex items-center">
          <Link href="/user" className="text-2xl font-bold text-green-500 mr-8">
            Predictions
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/user" className="text-white hover:text-green-400">
              Events
            </Link>
            <Link
              href="/user/my-predictions"
              className="text-white hover:text-green-400"
            >
              My Predictions
            </Link>
            <Link
              href="/user/streamers"
              className="text-white hover:text-green-400"
            >
              Streamers
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-gray-800 px-3 py-1 rounded-full text-green-400">
            <span className="font-medium">{user.balance}</span> points
          </div>

          <Link href="/user/messages" className="relative">
            <MessageSquare className="h-6 w-6 text-white hover:text-green-400" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              2
            </span>
          </Link>

          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarFallback className="bg-green-600 text-white">
                {user.displayName?.substring(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-white hidden md:inline">
              {user.displayName}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="bg-red-600 text-white border-red-500 hover:bg-red-500"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
