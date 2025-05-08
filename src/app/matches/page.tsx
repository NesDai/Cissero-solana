"use client"

import { useState } from "react"
import { Search, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SiteHeader } from "@/components/layout/site-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Dummy data for events and streamers
const ongoingEvents = [
  {
    id: 1,
    title: "Dream Team vs A Team",
    description: "Valorant Showdown - Happening Now!",
    status: "Live",
    timeLeft: "20 mins until closing",
  },
  {
    id: 2,
    title: "CS:GO Tournament Finals",
    description: "Team Alpha vs Team Omega - Last Map!",
    status: "Live",
    timeLeft: "Open for prediction",
  },
  {
    id: 3,
    title: "CS:GO Tournament Finals with an extremely long title that should be truncated",
    description:
      "This is a very long description that should be truncated to maintain consistent card heights across all event cards in the layout.",
    status: "Live",
    timeLeft: "Open for prediction",
  },
  {
    id: 4,
    title: "Apex Legends Championship",
    description: "Final rounds - Top teams competing!",
    status: "Live",
    timeLeft: "15 mins left",
  },
  {
    id: 5,
    title: "Rocket League Showmatch",
    description: "Pro players exhibition match",
    status: "Live",
    timeLeft: "30 mins left",
  },
]

const upcomingEvents = [
  {
    id: 6,
    title: "LoL Grand Finals",
    description: "Biggest League Event - Starts Soon",
    status: "Upcoming",
    timeLeft: "Starts in 3h",
  },
  {
    id: 7,
    title: "Fortnite Cup Qualifiers",
    description: "Top 10 players advance to finals",
    status: "Upcoming",
    timeLeft: "Starts in 5h",
  },
  {
    id: 8,
    title: "Dota 2 International Qualifiers with an extremely long title that needs truncation",
    description:
      "This is another very long description for an upcoming event that should be truncated to maintain consistent card heights in the layout.",
    status: "Upcoming",
    timeLeft: "Starts in 8h",
  },
  {
    id: 9,
    title: "Dota 2 International Qualifiers with an extremely long title that needs truncation",
    description:
      "This is another very long description for an upcoming event that should be truncated to maintain consistent card heights in the layout.",
    status: "Upcoming",
    timeLeft: "Starts in 8h",
  },
  {
    id: 10,
    title: "Dota 2 International Qualifiers with an extremely long title that needs truncation",
    description:
      "This is another very long description for an upcoming event that should be truncated to maintain consistent card heights in the layout.",
    status: "Upcoming",
    timeLeft: "Starts in 8h",
  },
  {
    id: 11,
    title: "Dota 2 International Qualifiers with an extremely long title that needs truncation",
    description:
      "This is another very long description for an upcoming event that should be truncated to maintain consistent card heights in the layout.",
    status: "Upcoming",
    timeLeft: "Starts in 8h",
  },
]

const topStreamers = [
  { id: 1, name: "Toasted", points: 5200 },
  { id: 2, name: "Xcocobar", points: 4700 },
  { id: 3, name: "Hafoo", points: 4300 },
  { id: 4, name: "7up", points: 4000 },
]

// Dynamic notification - set to null to hide
const notification = "🔔 Stay tuned: New matches launching this weekend!"
// const notification = null; // Uncomment to hide notification

export default function Matches() {
  const [activeTab, setActiveTab] = useState<"ongoing" | "upcoming">("ongoing")
  const events = activeTab === "ongoing" ? ongoingEvents : upcomingEvents

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Green glow effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-[#22c55e]/20 blur-[150px] -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-[#22c55e]/10 blur-[150px] translate-y-1/3"></div>

      {/* Site Header */}
      <div className="relative z-10 mx-auto max-w-[1200px]">
        <SiteHeader />
      </div>

      {/* Notification Banner - Dynamic */}
      {notification && (
        <div className="border-y border-green-900/30 py-2 text-center text-sm text-gray-300">
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-semibold">Matches</h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
            <div className="flex rounded-full overflow-hidden">
              <Button
                variant="ghost"
                className={`px-4 py-1.5 text-sm font-medium rounded-l-full rounded-r-none ${
                  activeTab === "ongoing"
                    ? "bg-green-500 text-black hover:bg-green-500 hover:text-black"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
                onClick={() => setActiveTab("ongoing")}
              >
                Ongoing
              </Button>
              <Button
                variant="ghost"
                className={`px-4 py-1.5 text-sm font-medium rounded-r-full rounded-l-none ${
                  activeTab === "upcoming"
                    ? "bg-green-500 text-black hover:bg-green-500 hover:text-black"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
                onClick={() => setActiveTab("upcoming")}
              >
                Upcoming
              </Button>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search matches..."
                className="bg-gray-800 border-gray-700 rounded-full pl-10 pr-4 py-5 text-sm w-full focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>

        {/* Two-column layout with fixed heights */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Events section - 2/3 width, scrollable */}
          <div className="lg:w-2/3 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Cards - Dynamic */}
              {events.map((event) => (
                <Card key={event.id} className="w-full bg-[#09090b]/80 border-[#27272a] backdrop-blur-sm text-white">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-medium truncate max-w-[70%]" title={event.title}>
                        {event.title}
                      </h2>
                      <Badge
                        variant="outline"
                        className={`${
                          event.status === "Live"
                            ? "bg-green-900/50 text-green-500 border-green-900/50"
                            : "bg-yellow-900/50 text-yellow-500 border-yellow-900/50"
                        }`}
                      >
                        {event.status}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm mb-6 line-clamp-2 h-10" title={event.description}>
                      {event.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <Button
                        variant={event.status === "Live" ? "default" : "outline"}
                        className={
                          event.status === "Live"
                            ? "bg-green-500 text-black hover:bg-green-400"
                            : "border-gray-600 text-black hover:bg-gray-800"
                        }
                      >
                        {event.status === "Live" ? "Predict" : "View Details"}
                      </Button>
                      <span className="text-xs text-gray-400">{event.timeLeft}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Top Streamers section - 1/3 width, fixed */}
          <div className="lg:w-1/3">
            <Card className="w-full sticky top-4 bg-[#09090b]/80 border-[#27272a] backdrop-blur-sm text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="text-yellow-500 w-5 h-5" />
                  <h2 className="text-xl font-medium">Top Streamers</h2>
                </div>
                <ul className="space-y-3">
                  {topStreamers.map((streamer) => (
                    <li key={streamer.id} className="flex justify-between items-center">
                      <span className="text-sm">{streamer.name}</span>
                      <span className="text-sm text-green-500">+ {streamer.points}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}