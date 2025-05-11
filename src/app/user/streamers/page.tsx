"use client";

import { useState, useEffect } from "react";
import { UserHeader } from "@/components/user/UserHeader";
import { getCurrentUser, getStreamers } from "@/services/eventService";
import { Loader2, Search, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ClientOnly from "@/components/ClientOnly";

interface Streamer {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  followers: number;
  category: string;
  status: "online" | "offline";
}

export default function StreamersPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [streamers, setStreamers] = useState<Streamer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/user");
      return;
    }

    loadStreamers();
  }, [router]);

  const loadStreamers = async () => {
    try {
      const streamersData = await getStreamers();
      setStreamers(streamersData);
    } catch (error) {
      console.error("Error loading streamers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter streamers based on search term
  const filteredStreamers = streamers.filter(
    (streamer) =>
      streamer.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      streamer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      streamer.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading screen
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <Loader2 className="h-12 w-12 text-green-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <UserHeader onLogout={() => router.push("/user")} />

      <ClientOnly>
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold">Streamers</h1>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search streamers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white pl-10"
              />
            </div>
          </div>

          {filteredStreamers.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl text-gray-400">No streamers found</h2>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStreamers.map((streamer) => (
                <Card key={streamer.id} className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-green-600 text-white">
                          {streamer.displayName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl text-white">
                          {streamer.displayName}
                        </CardTitle>
                        <div className="text-sm text-gray-400">
                          @{streamer.username}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm text-gray-400">
                        {streamer.followers.toLocaleString()} followers
                      </div>
                      <div
                        className={`text-sm px-2 py-1 rounded ${
                          streamer.status === "online"
                            ? "bg-green-900 text-green-400"
                            : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        {streamer.status.charAt(0).toUpperCase() +
                          streamer.status.slice(1)}
                      </div>
                    </div>

                    <div className="bg-gray-800 p-3 rounded-md">
                      <div className="text-sm font-medium mb-1">Category</div>
                      <div className="text-green-400">{streamer.category}</div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <div className="w-full flex space-x-2">
                      <Button
                        variant="outline"
                        className="flex-1 border-green-600 text-green-500 hover:bg-green-900"
                        onClick={() =>
                          router.push(`/user/streamer/${streamer.id}`)
                        }
                      >
                        View Profile
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-700 text-gray-400 hover:bg-gray-800"
                        onClick={() =>
                          window.open(
                            `https://twitch.tv/${streamer.username}`,
                            "_blank"
                          )
                        }
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </main>
      </ClientOnly>
    </div>
  );
}
