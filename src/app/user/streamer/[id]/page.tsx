"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { UserHeader } from "@/components/user/UserHeader";
import {
  getCurrentUser,
  getStreamerProfile,
  getStreamerEvents,
} from "@/services/eventService";
import { Loader2, Calendar, Users, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import ClientOnly from "@/components/ClientOnly";

interface Streamer {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  followers: number;
  category: string;
  status: "online" | "offline";
  bio: string;
  totalEvents: number;
  joinedDate: Date;
}

export default function StreamerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const streamerId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [streamer, setStreamer] = useState<Streamer | null>(null);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/user");
      return;
    }

    loadStreamerData();
  }, [streamerId, router]);

  const loadStreamerData = async () => {
    try {
      const streamerData = await getStreamerProfile(streamerId);
      setStreamer(streamerData);

      const eventsData = await getStreamerEvents(streamerId);
      setEvents(eventsData);
    } catch (error) {
      console.error("Error loading streamer data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading screen
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <Loader2 className="h-12 w-12 text-green-500 animate-spin" />
      </div>
    );
  }

  // Show not found message if streamer doesn't exist
  if (!streamer) {
    return (
      <div className="min-h-screen bg-black text-white">
        <UserHeader onLogout={() => router.push("/user")} />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Streamer Not Found</h1>
          <p className="text-gray-400 mb-6">
            The streamer you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push("/user/streamers")}>
            Back to Streamers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <UserHeader onLogout={() => router.push("/user")} />

      <ClientOnly>
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-green-600 text-white text-2xl">
                  {streamer.displayName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h1 className="text-3xl font-bold">{streamer.displayName}</h1>
                <div className="text-gray-400 mb-2">@{streamer.username}</div>

                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center text-gray-400">
                    <Users className="h-4 w-4 mr-1" />
                    {streamer.followers.toLocaleString()} followers
                  </div>

                  <div className="flex items-center text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    Joined {new Date(streamer.joinedDate).toLocaleDateString()}
                  </div>

                  <div
                    className={`px-2 py-1 rounded text-sm ${
                      streamer.status === "online"
                        ? "bg-green-900 text-green-400"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {streamer.status.charAt(0).toUpperCase() +
                      streamer.status.slice(1)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-500 hover:bg-green-900"
                    onClick={() =>
                      window.open(
                        `https://twitch.tv/${streamer.username}`,
                        "_blank"
                      )
                    }
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Watch Stream
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-8">
            <h2 className="text-xl font-bold mb-2">About</h2>
            <p className="text-gray-400">{streamer.bio}</p>
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="bg-gray-900 border-gray-800">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6">
              <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>

              {events.filter((e) => e.status === "Scheduled").length === 0 ? (
                <div className="text-center py-8 bg-gray-900 rounded-lg border border-gray-800">
                  <p className="text-gray-400">No upcoming events scheduled</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events
                    .filter((e) => e.status === "Scheduled")
                    .map((event) => (
                      <Card
                        key={event.id}
                        className="bg-gray-900 border-gray-800"
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-xl text-white">
                              {event.title}
                            </CardTitle>
                            <Badge variant="outline" className="bg-gray-700">
                              {event.status}
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent>
                          <div className="text-sm text-gray-400 mb-4">
                            {new Date(event.date).toLocaleDateString()} at{" "}
                            {event.time}
                          </div>

                          <div className="flex justify-between items-center bg-gray-800 p-3 rounded-md mb-2">
                            <div className="font-medium">
                              {event.participants[0]?.name}
                            </div>
                            <div className="text-xs text-gray-400">VS</div>
                            <div className="font-medium">
                              {event.participants[1]?.name}
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="pt-0">
                          <Link
                            href={`/user/event/${event.id}`}
                            className="w-full"
                          >
                            <Button className="w-full bg-green-600 hover:bg-green-500">
                              View Event
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-6">
              <h2 className="text-xl font-bold mb-4">Past Events</h2>

              {events.filter((e) => e.status === "Completed").length === 0 ? (
                <div className="text-center py-8 bg-gray-900 rounded-lg border border-gray-800">
                  <p className="text-gray-400">No past events</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events
                    .filter((e) => e.status === "Completed")
                    .map((event) => (
                      <Card
                        key={event.id}
                        className="bg-gray-900 border-gray-800"
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-xl text-white">
                              {event.title}
                            </CardTitle>
                            <Badge variant="outline" className="bg-gray-700">
                              {event.status}
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent>
                          <div className="text-sm text-gray-400 mb-4">
                            {new Date(event.date).toLocaleDateString()} at{" "}
                            {event.time}
                          </div>

                          <div className="flex justify-between items-center bg-gray-800 p-3 rounded-md mb-2">
                            <div className="font-medium">
                              {event.participants[0]?.name}
                            </div>
                            <div className="text-xs text-gray-400">VS</div>
                            <div className="font-medium">
                              {event.participants[1]?.name}
                            </div>
                          </div>
                        </CardContent>

                        <CardFooter className="pt-0">
                          <Link
                            href={`/user/event/${event.id}`}
                            className="w-full"
                          >
                            <Button
                              variant="outline"
                              className="w-full border-green-600 text-green-500 hover:bg-green-900"
                            >
                              View Results
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </ClientOnly>
    </div>
  );
}
