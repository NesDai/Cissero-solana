"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";

// Import the tab components
import { EventsTab } from "@/components/admin/EventsTab";
import { ReportsTab } from "@/components/admin/ReportsTab";
import { SettingsTab } from "@/components/admin/SettingsTab";
import { TwitchDashboard } from "@/components/admin/TwitchDashboard";

export default function AdminPage() {
  const [message, setMessage] = useState("");
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [gameStatus, setGameStatus] = useState("In Progress");
  const [currentRound, setCurrentRound] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Mock data
  const upcomingEvents = [
    {
      id: "1234",
      title: "Tournament Finals",
      time: "Today, 8:00 PM",
      status: "Scheduled",
      hasAdmin: true,
    },
    {
      id: "1235",
      title: "Qualifier Match",
      time: "Tomorrow, 6:00 PM",
      status: "Needs Admin",
      hasAdmin: false,
    },
    {
      id: "1236",
      title: "Exhibition Game",
      time: "Sep 15, 7:30 PM",
      status: "Scheduled",
      hasAdmin: true,
    },
  ];

  const activeMatches = [
    {
      id: "1230",
      title: "Semi-Finals",
      bettingStatus: "Open",
      viewers: 1240,
      player1: "Alex",
      player2: "Jordan",
    },
  ];

  const reports = [
    {
      id: "r101",
      time: "10:23",
      date: "Today",
      user: "UserXYZ",
      type: "Technical",
      message: "Stream lagging",
      status: "New",
    },
    {
      id: "r102",
      time: "10:45",
      date: "Today",
      user: "Streamer1",
      type: "Game",
      message: "Score not updating",
      status: "In Progress",
    },
    {
      id: "r103",
      time: "11:02",
      date: "Today",
      user: "Viewer123",
      type: "Betting",
      message: "Can't place bet",
      status: "New",
    },
  ];

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleScoreUpdate = () => {
    // Here you would update the scores in your database
    alert(`Scores updated: ${player1Score} - ${player2Score}`);
  };

  const handleRoundChange = (direction: string) => {
    if (direction === "next") {
      setCurrentRound((prev) => prev + 1);
    } else if (direction === "prev" && currentRound > 1) {
      setCurrentRound((prev) => prev - 1);
    }
  };

  const handleGameStatusChange = (status: string) => {
    setGameStatus(status);
    // Here you would update the game status in your database
  };

  // Game status button style generator function
  const getStatusButtonStyle = (buttonStatus: string) => {
    if (gameStatus === buttonStatus) {
      // Active state
      switch (buttonStatus) {
        case "In Progress":
          return "bg-blue-600 text-white hover:bg-blue-500";
        case "Paused":
          return "bg-yellow-500 text-black hover:bg-yellow-400";
        case "Completed":
          return "bg-green-500 text-black hover:bg-green-400";
      }
    }
    // Inactive state
    return "bg-gray-700 text-white hover:bg-gray-600";
  };

  return (
    <div className="bg-gradient-to-b from-black to-green-900 text-white min-h-screen">
      {/* Navbar */}
      <header className="py-4 border-b border-green-800">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <div className="text-lg font-semibold text-white">Cissero Admin</div>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink className="text-white hover:text-green-400 px-4 py-2">
                  Dashboard
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className="text-white hover:text-green-400 px-4 py-2">
                  Events
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className="text-white hover:text-green-400 px-4 py-2">
                  Reports
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className="text-white hover:text-green-400 px-4 py-2">
                  Settings
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button variant="destructive">Logout</Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1200px] mx-auto mt-8 pb-16">
        <Tabs defaultValue="dashboard">
          <TabsList className="bg-black bg-opacity-50 mb-4">
            <TabsTrigger
              value="dashboard"
              className="text-white data-[state=active]:bg-green-500 data-[state=active]:text-black"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="text-white data-[state=active]:bg-green-500 data-[state=active]:text-black"
            >
              Events
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="text-white data-[state=active]:bg-green-500 data-[state=active]:text-black"
            >
              Reports
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="text-white data-[state=active]:bg-green-500 data-[state=active]:text-black"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            {/* Active Matches Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">
                  Active Matches
                </h2>
                <Button className="bg-green-500 text-black hover:bg-green-400">
                  Create New Event
                </Button>
              </div>

              {activeMatches.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {activeMatches.map((match) => (
                    <Card
                      key={match.id}
                      className="bg-black bg-opacity-50 border-green-500 text-white"
                    >
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-[20px] text-white">
                            {match.title} (#{match.id})
                          </CardTitle>
                          <Badge
                            className={
                              match.bettingStatus === "Open"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }
                          >
                            Betting {match.bettingStatus}
                          </Badge>
                        </div>
                        <CardDescription className="text-gray-300">
                          Live Viewers: {match.viewers} • Started 45 minutes ago
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-900 p-4 rounded">
                            <h3 className="text-[16px] mb-2 text-blue-300 font-bold">
                              {match.player1}
                            </h3>
                            <div className="h-4 w-full bg-blue-950 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-400"
                                style={{ width: "40%" }}
                              ></div>
                            </div>
                            <p className="mt-2 text-[14px] text-white">
                              Votes: 120
                            </p>
                          </div>
                          <div className="bg-red-900 p-4 rounded">
                            <h3 className="text-[16px] mb-2 text-red-300 font-bold">
                              {match.player2}
                            </h3>
                            <div className="h-4 w-full bg-red-950 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-red-400"
                                style={{ width: "60%" }}
                              ></div>
                            </div>
                            <p className="mt-2 text-[14px] text-white">
                              Votes: 180
                            </p>
                          </div>
                        </div>

                        {/* Game Data Control Panel */}
                        <Card className="bg-gray-900 border border-gray-700">
                          <CardHeader>
                            <CardTitle className="text-[18px] text-white">
                              Game Data Control Panel
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Round Controls */}
                            <div className="flex items-center justify-center space-x-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-gray-700 text-white hover:bg-gray-600"
                                onClick={() => handleRoundChange("prev")}
                                disabled={currentRound <= 1}
                              >
                                Previous
                              </Button>
                              <div className="text-center">
                                <span className="text-sm text-gray-300 block">
                                  Current Round
                                </span>
                                <span className="text-xl font-bold text-white">
                                  {currentRound}
                                </span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-gray-700 text-white hover:bg-gray-600"
                                onClick={() => handleRoundChange("next")}
                              >
                                Next
                              </Button>
                            </div>

                            {/* Score Controls */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm text-blue-300 block mb-1 font-semibold">
                                  Player 1 Score
                                </label>
                                <div className="flex items-center">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-gray-700 text-white hover:bg-gray-600"
                                    onClick={() =>
                                      setPlayer1Score((prev) =>
                                        Math.max(0, prev - 1)
                                      )
                                    }
                                  >
                                    -
                                  </Button>
                                  <span className="mx-3 text-xl font-bold text-white">
                                    {player1Score}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-gray-700 text-white hover:bg-gray-600"
                                    onClick={() =>
                                      setPlayer1Score((prev) => prev + 1)
                                    }
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                              <div className="text-right">
                                <label className="text-sm text-red-300 block mb-1 font-semibold text-right">
                                  Player 2 Score
                                </label>
                                <div className="flex items-center justify-end">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-gray-700 text-white hover:bg-gray-600"
                                    onClick={() =>
                                      setPlayer2Score((prev) =>
                                        Math.max(0, prev - 1)
                                      )
                                    }
                                  >
                                    -
                                  </Button>
                                  <span className="mx-3 text-xl font-bold text-white">
                                    {player2Score}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-gray-700 text-white hover:bg-gray-600"
                                    onClick={() =>
                                      setPlayer2Score((prev) => prev + 1)
                                    }
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {/* Game Status Controls */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm text-gray-300 block mb-1 font-semibold">
                                  Game Status
                                </label>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    className={`${getStatusButtonStyle(
                                      "In Progress"
                                    )} font-semibold`}
                                    onClick={() =>
                                      handleGameStatusChange("In Progress")
                                    }
                                  >
                                    In Progress
                                  </Button>
                                  <Button
                                    size="sm"
                                    className={`${getStatusButtonStyle(
                                      "Paused"
                                    )} font-semibold`}
                                    onClick={() =>
                                      handleGameStatusChange("Paused")
                                    }
                                  >
                                    Paused
                                  </Button>
                                  <Button
                                    size="sm"
                                    className={`${getStatusButtonStyle(
                                      "Completed"
                                    )} font-semibold`}
                                    onClick={() =>
                                      handleGameStatusChange("Completed")
                                    }
                                  >
                                    Completed
                                  </Button>
                                </div>
                              </div>
                              <div className="flex items-end justify-end">
                                <Button
                                  className="bg-green-500 text-black hover:bg-green-400 font-semibold"
                                  onClick={handleScoreUpdate}
                                >
                                  Update Game Data
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Stream Monitors */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-900 bg-opacity-20 border border-blue-700 rounded p-2">
                            <div className="text-sm text-blue-300 mb-1 font-semibold">
                              Player 1 Stream
                            </div>
                            <div className="bg-gray-800 aspect-video flex items-center justify-center">
                              <div className="text-gray-500">
                                Stream preview would appear here
                              </div>
                            </div>
                          </div>
                          <div className="bg-red-900 bg-opacity-20 border border-red-700 rounded p-2">
                            <div className="text-sm text-red-300 mb-1 font-semibold">
                              Player 2 Stream
                            </div>
                            <div className="bg-gray-800 aspect-video flex items-center justify-center">
                              <div className="text-gray-500">
                                Stream preview would appear here
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="flex justify-between">
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            className="bg-gray-700 text-white hover:bg-gray-600"
                          >
                            Manage Stream
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button className="bg-green-500 text-black hover:bg-green-400">
                            Refresh Data
                          </Button>
                          <Button variant="destructive">Close Betting</Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-black bg-opacity-50 border-green-500 text-white p-8 text-center">
                  <p>No active matches at the moment.</p>
                  <Button className="mt-4 bg-green-500 text-black hover:bg-green-400">
                    Start a Match
                  </Button>
                </Card>
              )}
            </section>

            {/* Upcoming Events */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Upcoming Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {upcomingEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="bg-black bg-opacity-50 border-green-500 text-white"
                  >
                    <CardHeader>
                      <CardTitle className="text-[18px] text-white">
                        {event.title}
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        {event.time}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge
                        className={
                          event.hasAdmin
                            ? "bg-green-500 text-black"
                            : "bg-yellow-500 text-black"
                        }
                      >
                        {event.status}
                      </Badge>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="secondary"
                        className="bg-gray-700 text-white hover:bg-gray-600"
                      >
                        View
                      </Button>
                      {!event.hasAdmin && (
                        <Button className="bg-green-500 text-black hover:bg-green-400">
                          Assign Me
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>

            {/* Communication Hub */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-black bg-opacity-50 border-green-500 text-white">
                <CardHeader>
                  <CardTitle className="text-[20px] text-white">
                    Communication Hub
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="streamer" className="w-full">
                    <TabsList className="bg-gray-800 w-full mb-4">
                      <TabsTrigger
                        value="streamer"
                        className="text-white data-[state=active]:bg-green-500 data-[state=active]:text-black flex-1"
                      >
                        Streamer
                      </TabsTrigger>
                      <TabsTrigger
                        value="moderator"
                        className="text-white data-[state=active]:bg-green-500 data-[state=active]:text-black flex-1"
                      >
                        Moderator
                      </TabsTrigger>
                      <TabsTrigger
                        value="viewer"
                        className="text-white data-[state=active]:bg-green-500 data-[state=active]:text-black flex-1"
                      >
                        Viewer
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="streamer" className="space-y-4">
                      <div className="bg-gray-800 p-4 rounded h-[200px] overflow-y-auto">
                        <div className="mb-2">
                          <span className="text-green-400 font-semibold">
                            Streamer:
                          </span>{" "}
                          Is the score updating correctly?
                        </div>
                        <div className="mb-2">
                          <span className="text-blue-400 font-semibold">
                            Admin:
                          </span>{" "}
                          Yes, I've updated it. Please confirm it looks right on
                          your end.
                        </div>
                        <div className="mb-2">
                          <span className="text-green-400 font-semibold">
                            Streamer:
                          </span>{" "}
                          Perfect, thanks!
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type your message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                        <Button className="bg-green-500 text-black hover:bg-green-400">
                          Send
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="moderator" className="space-y-4">
                      <div className="bg-gray-800 p-4 rounded h-[200px] overflow-y-auto">
                        <div className="mb-2">
                          <span className="text-purple-400 font-semibold">
                            Moderator:
                          </span>{" "}
                          We have a user spamming in chat
                        </div>
                        <div className="mb-2">
                          <span className="text-blue-400 font-semibold">
                            Admin:
                          </span>{" "}
                          I'll take care of it right away
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type your message..."
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                        <Button className="bg-green-500 text-black hover:bg-green-400">
                          Send
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="viewer" className="space-y-4">
                      <div className="bg-gray-800 p-4 rounded h-[200px] overflow-y-auto">
                        <div className="mb-2">
                          <span className="text-gray-400 font-semibold">
                            Viewer123:
                          </span>{" "}
                          I can't place a bet, getting an error
                        </div>
                        <div className="mb-2">
                          <span className="text-blue-400 font-semibold">
                            Admin:
                          </span>{" "}
                          Let me help you troubleshoot that
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type your message..."
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                        <Button className="bg-green-500 text-black hover:bg-green-400">
                          Send
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Recent Reports */}
              <Card className="bg-black bg-opacity-50 border-green-500 text-white">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-[20px] text-white">
                    Recent Reports
                  </CardTitle>
                  <Button
                    variant="secondary"
                    className="bg-gray-700 text-white hover:bg-gray-600"
                  >
                    View All Reports
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-white">Time</TableHead>
                        <TableHead className="text-white">User</TableHead>
                        <TableHead className="text-white">Type</TableHead>
                        <TableHead className="text-white">Report</TableHead>
                        <TableHead className="text-white">Status</TableHead>
                        <TableHead className="text-white">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-700">
                      {reports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="text-white">
                            {report.time}
                          </TableCell>
                          <TableCell className="text-white">
                            {report.user}
                          </TableCell>
                          <TableCell className="text-white">
                            <Badge
                              className={
                                report.type === "Technical"
                                  ? "bg-blue-500"
                                  : report.type === "Game"
                                  ? "bg-purple-500"
                                  : "bg-orange-500"
                              }
                            >
                              {report.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white">
                            {report.message}
                          </TableCell>
                          <TableCell className="text-white">
                            <Badge
                              className={
                                report.status === "New"
                                  ? "bg-red-500"
                                  : report.status === "In Progress"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }
                            >
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="destructive" size="sm">
                              Resolve
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events">
            <EventsTab />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsTab />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
