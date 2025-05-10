"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getTopStreams,
  getStreamByUsername,
  getTopGames,
  TwitchStream,
  TwitchGame,
} from "@/services/twitchClientService";
import { Loader2, ExternalLink, Search, RefreshCw } from "lucide-react";
import ClientOnly from "@/components/ClientOnly";

export function TwitchDashboard() {
  const [topStreams, setTopStreams] = useState<TwitchStream[]>([]);
  const [games, setGames] = useState<TwitchGame[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingGames, setIsLoadingGames] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchUsername, setSearchUsername] = useState("");
  const [searchedStream, setSearchedStream] = useState<TwitchStream | null>(
    null
  );
  const [isSearching, setIsSearching] = useState(false);

  // Load top streams on mount or when game filter changes
  useEffect(() => {
    async function loadTopStreams() {
      setIsLoading(true);
      try {
        const streams = await getTopStreams(selectedGameId);
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
  }, [selectedGameId]);

  // Load games on mount
  useEffect(() => {
    async function loadGames() {
      setIsLoadingGames(true);
      try {
        const gameData = await getTopGames(20);
        setGames(gameData);
      } catch (err) {
        console.error("Failed to load Twitch games:", err);
      } finally {
        setIsLoadingGames(false);
      }
    }

    loadGames();
  }, []);

  // Handle search
  const handleSearch = async () => {
    if (!searchUsername.trim()) return;

    setIsSearching(true);
    setSearchedStream(null);
    try {
      const stream = await getStreamByUsername(searchUsername);
      setSearchedStream(stream);
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

  // Format game box art
  const formatGameBoxArt = (url: string): string => {
    return url.replace("{width}", "144").replace("{height}", "192");
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    getTopStreams(selectedGameId)
      .then((streams) => {
        setTopStreams(streams);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to refresh streams:", err);
        setError("Failed to refresh streams. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <ClientOnly>
      <div className="space-y-6">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Twitch Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-900 text-white p-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-2">
                Search for a Stream
              </h2>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Twitch username"
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
                  className="bg-purple-700 hover:bg-purple-600 text-white"
                  onClick={handleSearch}
                  disabled={isSearching || !searchUsername.trim()}
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  <span className="ml-2">Search</span>
                </Button>
              </div>
            </div>

            {searchedStream && (
              <Card className="bg-gray-800 border-gray-700 mb-6">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative w-full md:w-1/3">
                      <img
                        src={formatThumbnail(searchedStream.thumbnail_url)}
                        alt={searchedStream.title}
                        className="w-full rounded-md"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-red-600 text-white">
                          {formatViewers(searchedStream.viewer_count)} viewers
                        </Badge>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-2">
                        {searchedStream.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className="bg-blue-600 text-white">
                          {searchedStream.user_name}
                        </Badge>
                        <Badge className="bg-green-600 text-white">
                          {searchedStream.game_name}
                        </Badge>
                        <Badge className="bg-gray-700 text-gray-300">
                          {searchedStream.language.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">
                        Started streaming{" "}
                        {new Date(searchedStream.started_at).toLocaleString()}
                      </p>
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
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Top Streams</h2>
              <div className="flex gap-2 items-center">
                <Select
                  value={selectedGameId}
                  onValueChange={setSelectedGameId}
                  disabled={isLoadingGames}
                >
                  <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value={undefined}>All Categories</SelectItem>
                    {games.map((game) => (
                      <SelectItem key={game.id} value={game.id}>
                        {game.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-400">Loading streams...</p>
              </div>
            ) : topStreams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topStreams.map((stream) => (
                  <Card key={stream.id} className="bg-gray-800 border-gray-700">
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
