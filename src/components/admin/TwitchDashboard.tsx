"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  getTopStreams,
  getStreamByUsername,
  TwitchStream,
} from "@/services/twitchService";
import { Loader2, ExternalLink, Search } from "lucide-react";
import ClientOnly from "@/components/ClientOnly";

export function TwitchDashboard() {
  const [topStreams, setTopStreams] = useState<TwitchStream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchUsername, setSearchUsername] = useState("");
  const [searchedStream, setSearchedStream] = useState<TwitchStream | null>(
    null
  );
  const [isSearching, setIsSearching] = useState(false);

  // Load top streams on mount
  useEffect(() => {
    async function loadTopStreams() {
      setIsLoading(true);
      try {
        const streams = await getTopStreams();
        setTopStreams(streams);
        setError(null);
      } catch (err) {
        console.error("Failed to load Twitch streams:", err);
        setError(
          "Failed to load Twitch streams. Please check your API credentials."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadTopStreams();
  }, []);

  // Handle search
  const handleSearch = async () => {
    if (!searchUsername.trim()) return;

    setIsSearching(true);
    try {
      const stream = await getStreamByUsername(searchUsername);
      setSearchedStream(stream);
      setError(null);
    } catch (err) {
      console.error("Failed to search for stream:", err);
      setError("Failed to search for stream. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Format viewer count
  const formatViewers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Format thumbnail URL
  const formatThumbnail = (url: string): string => {
    return url.replace("{width}", "320").replace("{height}", "180");
  };

  return (
    <ClientOnly>
      <div className="space-y-6">
        <Card className="bg-black bg-opacity-50 border-green-500 text-white">
          <CardHeader>
            <CardTitle className="text-[20px] text-white">
              Twitch Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-900 text-white p-4 rounded-md mb-4">
                {error}
              </div>
            )}

            <div className="flex gap-2 mb-6">
              <Input
                placeholder="Search by username"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <Button
                variant="outline"
                className="bg-green-600 text-white border-green-500 hover:bg-green-500"
                onClick={handleSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Search
              </Button>
            </div>

            {searchedStream && (
              <Card className="bg-gray-900 border-gray-700 mb-6">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white text-lg">
                      {searchedStream.user_name}
                    </CardTitle>
                    <Badge className="bg-red-600 text-white">LIVE</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <img
                        src={formatThumbnail(searchedStream.thumbnail_url)}
                        alt={searchedStream.title}
                        className="w-full rounded-md"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-white font-medium mb-2">
                        {searchedStream.title}
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-400">Game:</div>
                        <div className="text-white">
                          {searchedStream.game_name}
                        </div>

                        <div className="text-gray-400">Viewers:</div>
                        <div className="text-white">
                          {formatViewers(searchedStream.viewer_count)}
                        </div>

                        <div className="text-gray-400">Started:</div>
                        <div className="text-white">
                          {new Date(searchedStream.started_at).toLocaleString()}
                        </div>
                      </div>

                      <div className="mt-4">
                        <Button
                          variant="outline"
                          className="bg-purple-700 text-white border-purple-600 hover:bg-purple-600"
                          onClick={() =>
                            window.open(
                              `https://twitch.tv/${searchedStream.user_login}`,
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
                </CardContent>
              </Card>
            )}

            <h2 className="text-xl font-bold text-white mb-4">Top Streams</h2>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-400">Loading streams...</p>
              </div>
            ) : topStreams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topStreams.map((stream) => (
                  <Card key={stream.id} className="bg-gray-900 border-gray-700">
                    <div className="relative">
                      <img
                        src={formatThumbnail(stream.thumbnail_url)}
                        alt={stream.title}
                        className="w-full rounded-t-md"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-red-600 text-white">
                          {formatViewers(stream.viewer_count)} viewers
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="text-white font-medium truncate">
                        {stream.title}
                      </h3>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-gray-300 text-sm">
                          {stream.user_name}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {stream.game_name}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3 bg-purple-700 text-white border-purple-600 hover:bg-purple-600"
                        onClick={() =>
                          window.open(
                            `https://twitch.tv/${stream.user_login}`,
                            "_blank"
                          )
                        }
                      >
                        <ExternalLink className="h-3 w-3 mr-2" />
                        Watch
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No streams found
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ClientOnly>
  );
}
