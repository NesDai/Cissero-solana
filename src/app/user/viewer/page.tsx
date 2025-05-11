"use client";
import React, { useState, useEffect } from "react";
import { Loader2, Calendar, Users, Clock } from "lucide-react";
import Link from "next/link";

type Tab = "chat" | "analyst" | "results";

// Mock Twitch stream data
const mockStreamData = {
  id: "41375541868",
  user_id: "38746172",
  user_login: "chess",
  user_name: "Chess",
  game_id: "743",
  game_name: "Chess",
  type: "live",
  title: "GM Hikaru Nakamura | Bullet Chess Session",
  viewer_count: 12500,
  started_at: "2023-05-15T12:00:00Z",
  language: "en",
  thumbnail_url:
    "https://static-cdn.jtvnw.net/previews-ttv/live_user_chess-{width}x{height}.jpg",
  is_mature: false,
};

// Mock upcoming events
const mockUpcomingEvents = [
  {
    id: "1",
    title: "Chess Championship Finals",
    streamer: "ChessMaster",
    game: "Chess",
    scheduledTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    participants: ["Magnus Carlsen", "Hikaru Nakamura"],
    viewers: 0,
    thumbnail: "https://static-cdn.jtvnw.net/ttv-boxart/743_IGDB-285x380.jpg",
  },
  {
    id: "2",
    title: "Poker Tournament",
    streamer: "PokerPro",
    game: "Poker",
    scheduledTime: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
    participants: ["Daniel Negreanu", "Phil Ivey"],
    viewers: 0,
    thumbnail: "https://static-cdn.jtvnw.net/ttv-boxart/743_IGDB-285x380.jpg",
  },
  {
    id: "3",
    title: "Tennis Match",
    streamer: "TennisLive",
    game: "Tennis",
    scheduledTime: new Date(Date.now() + 10800000).toISOString(), // 3 hours from now
    participants: ["Roger Federer", "Rafael Nadal"],
    viewers: 0,
    thumbnail: "https://static-cdn.jtvnw.net/ttv-boxart/743_IGDB-285x380.jpg",
  },
];

const ViewerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<number>(0);
  const [streamData, setStreamData] = useState<any>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const balance = 10.0;

  // Simulate API call with mock data
  useEffect(() => {
    const loadStream = async () => {
      setIsLoading(true);
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Use mock data instead of API call
        setStreamData(mockStreamData);
        setError(null);
      } catch (err) {
        console.error("Failed to load stream:", err);
        setError("Failed to load stream. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    const loadUpcomingEvents = async () => {
      setIsLoadingEvents(true);
      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Use mock data instead of API call
        setUpcomingEvents(mockUpcomingEvents);
      } catch (err) {
        console.error("Failed to load upcoming events:", err);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    loadStream();
    loadUpcomingEvents();
  }, []);

  const handleSubmitBet = () => {
    if (!selectedPlayer) return alert("Select a player");
    if (isNaN(betAmount) || betAmount <= 0) return alert("Enter valid amount");
    if (betAmount > balance) return alert("Insufficient balance");
    alert(`Bet ${betAmount} SOL on ${selectedPlayer}`);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    // In a real app, you would send this to your backend
    // For now, we'll just clear the input
    setChatMessage("");
    alert(`Message sent: ${chatMessage}`);
  };

  // Format thumbnail URL for better quality
  const formatThumbnail = (url: string): string => {
    return url?.replace("{width}", "1280").replace("{height}", "720");
  };

  // Format date to readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex justify-center items-center bg-black min-h-screen text-white text-[16px]">
      <div className="w-[1920px] h-[1080px] bg-gradient-to-b from-black to-green-900 overflow-hidden flex flex-col">
        {/* Navbar */}
        <header className="h-16 flex items-center">
          <div className="max-w-[1200px] mx-auto w-full flex justify-between items-center px-0">
            <div className="text-white text-lg">Cissero</div>
            <nav className="flex items-center space-x-4">
              <a href="#" className="hover:underline">
                Home
              </a>
              <a href="#" className="hover:underline">
                Buy Tokens
              </a>
              <a href="#" className="hover:underline">
                Dashboard
              </a>
              <a href="#" className="hover:underline">
                Login
              </a>
              <button className="bg-white text-black px-3 py-1 rounded">
                Sign Up
              </button>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex gap-8 px-0">
          <div className="max-w-[1200px] mx-auto w-full h-full flex flex-col space-y-8">
            {/* Top Row */}
            <div className="flex h-[720px] gap-8">
              <div className="flex-1 border border-green-500 rounded-xl overflow-hidden shadow-lg bg-black">
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="h-12 w-12 text-green-500 animate-spin" />
                  </div>
                ) : error ? (
                  <div className="w-full h-full flex items-center justify-center flex-col">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-green-500 text-black px-4 py-2 rounded-full"
                    >
                      Retry
                    </button>
                  </div>
                ) : streamData ? (
                  <div className="w-full h-full">
                    <div className="relative w-full h-full">
                      <img
                        src={formatThumbnail(streamData.thumbnail_url)}
                        alt={streamData.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col items-center justify-center">
                        <h2 className="text-2xl font-bold mb-2">
                          {streamData.title}
                        </h2>
                        <p className="mb-4">
                          Streamer:{" "}
                          <span className="text-green-400">
                            {streamData.user_name}
                          </span>
                        </p>
                        <p className="mb-6">
                          Viewers:{" "}
                          <span className="text-green-400">
                            {streamData.viewer_count.toLocaleString()}
                          </span>
                        </p>
                        <button
                          onClick={() =>
                            window.open(
                              `https://twitch.tv/${streamData.user_login}`,
                              "_blank"
                            )
                          }
                          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full flex items-center"
                        >
                          Watch on Twitch
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    No stream available
                  </div>
                )}
              </div>
              <div className="w-[360px] border border-green-500 rounded-xl bg-black flex flex-col">
                <div className="flex">
                  {(["chat", "analyst", "results"] as Tab[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-2 text-center font-semibold ${
                        activeTab === tab
                          ? "bg-white text-green-800"
                          : "bg-green-800 text-white"
                      } ${tab === "chat" && "rounded-tl-xl"} ${
                        tab === "results" && "rounded-tr-xl"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                  {activeTab === "chat" && (
                    <>
                      <div className="flex items-start gap-2">
                        <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">User A</span>
                            <span className="text-xs text-gray-400">
                              2m ago
                            </span>
                          </div>
                          <p className="mt-1 text-gray-200">Great match!</p>
                        </div>
                      </div>
                      {streamData && (
                        <div className="flex items-start gap-2">
                          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {streamData.user_name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-purple-400">
                                {streamData.user_name}
                              </span>
                              <span className="text-xs text-gray-400">
                                Just now
                              </span>
                            </div>
                            <p className="mt-1 text-gray-200">
                              Welcome to the stream! Enjoy the match!
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === "analyst" && (
                    <div className="flex items-start gap-2">
                      <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Analyst B</span>
                          <span className="text-xs text-gray-400">5m ago</span>
                        </div>
                        <p className="mt-1 text-gray-200">
                          Player 2 has a strong serve.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === "results" && (
                    <div>
                      <h3 className="text-[20px] font-semibold text-center">
                        Past Results
                      </h3>
                      <ul className="space-y-2 text-[16px]">
                        <li>Match 1: Player 1 won</li>
                        <li>Match 2: Player 2 won</li>
                        <li>Match 3: Player 1 won</li>
                        <li>Match 4: Draw</li>
                      </ul>
                    </div>
                  )}
                </div>

                <form
                  onSubmit={handleSendMessage}
                  className="p-3 border-t border-green-500"
                >
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-full bg-gray-700 text-white focus:outline-none text-[16px]"
                  />
                </form>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex h-[280px] gap-8">
              {/* Upcoming Events Section (replaces betting section for viewers) */}
              <div className="flex-1 border border-green-500 rounded-xl bg-black p-4 overflow-hidden">
                <h2 className="text-[20px] font-semibold mb-4">
                  Upcoming Events
                </h2>

                {isLoadingEvents ? (
                  <div className="flex items-center justify-center h-[200px]">
                    <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4 overflow-y-auto h-[200px]">
                    {upcomingEvents.map((event) => (
                      <Link href={`/user/event/${event.id}`} key={event.id}>
                        <div className="border border-green-500 rounded-lg p-3 hover:bg-green-900/30 transition cursor-pointer h-full flex flex-col">
                          <div className="font-semibold text-green-400 mb-1 truncate">
                            {event.title}
                          </div>
                          <div className="text-sm text-gray-300 mb-1">
                            {event.streamer} • {event.game}
                          </div>
                          <div className="flex items-center text-xs text-gray-400 mb-2">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(event.scheduledTime)}
                          </div>
                          <div className="text-xs text-gray-400 flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {event.participants.join(" vs ")}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Ad Section */}
              <div className="w-[360px] border-dashed border-lime-400 bg-lime-200 text-black text-sm p-4 rounded flex items-center justify-center">
                {streamData ? (
                  <div className="text-center">
                    <p className="font-bold mb-2">Currently Playing</p>
                    <p className="text-green-800 mb-1">
                      {streamData.game_name}
                    </p>
                    <p className="text-xs">Sponsored by Cissero</p>
                  </div>
                ) : (
                  "Static ad (MVP placeholder)"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewerPage;
