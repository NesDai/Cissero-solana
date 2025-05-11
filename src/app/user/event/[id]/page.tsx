"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { UserHeader } from "@/components/user/UserHeader";
import {
  getCurrentUser,
  getEventWithPredictions,
  placePrediction,
  getEventChatMessages,
  sendChatMessage,
  sendPrivateMessage,
  Event,
  Prediction,
  ChatMessage,
  Participant,
} from "@/services/eventService";
import {
  Loader2,
  Send,
  AlertCircle,
  MessageSquare,
  BarChart,
  Trophy,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ClientOnly from "@/components/ClientOnly";

type Tab = "chat" | "analyst" | "results";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const [activeTab, setActiveTab] = useState<Tab>("chat");

  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState<Event | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [user, setUser] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [predictionAmount, setPredictionAmount] = useState<number>(0);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const [isSendingReport, setIsSendingReport] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push("/user");
      return;
    }
    setUser(currentUser);
    loadEventData();
  }, [eventId, router]);

  useEffect(() => {
    // Scroll to bottom of chat when messages change
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const loadEventData = async () => {
    try {
      setIsLoading(true);
      const eventData = await getEventWithPredictions(eventId);
      if (!eventData) {
        toast({
          title: "Event not found",
          description: "The event you're looking for doesn't exist",
          variant: "destructive",
        });
        return;
      }

      setEvent(eventData.event);
      setPredictions(eventData.predictions || []);

      // Load chat messages
      const messages = await getEventChatMessages(eventId);
      setChatMessages(messages);
    } catch (error) {
      console.error("Error loading event:", error);
      toast({
        title: "Error",
        description: "Failed to load event data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSendingMessage) return;

    setIsSendingMessage(true);
    try {
      const message = await sendChatMessage(eventId, newMessage);
      setChatMessages([...chatMessages, message]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handlePlacePrediction = async () => {
    if (!selectedParticipant) {
      toast({
        title: "Select a participant",
        description: "Please select a participant to predict on",
        variant: "destructive",
      });
      return;
    }

    if (predictionAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid prediction amount",
        variant: "destructive",
      });
      return;
    }

    if (user.balance < predictionAmount) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough points for this prediction",
        variant: "destructive",
      });
      return;
    }

    setIsPredicting(true);
    try {
      const prediction = await placePrediction(
        eventId,
        selectedParticipant.id,
        predictionAmount
      );
      setPredictions([...predictions, prediction]);

      toast({
        title: "Prediction Placed",
        description: `You predicted ${predictionAmount} points on ${selectedParticipant.name}`,
      });

      // Refresh user data to update balance
      loadEventData();
      setUser({
        ...user,
        balance: user.balance - predictionAmount,
      });

      // Reset form
      setSelectedParticipant(null);
      setPredictionAmount(0);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to place prediction",
        variant: "destructive",
      });
    } finally {
      setIsPredicting(false);
    }
  };

  const handleSendReport = async () => {
    if (!reportMessage.trim() || isSendingReport) return;

    setIsSendingReport(true);
    try {
      // Find an admin to send the report to (in a real app, you'd have a proper way to do this)
      const adminId = "admin1";
      await sendPrivateMessage(adminId, reportMessage, eventId);

      toast({
        title: "Report Sent",
        description: "Your report has been sent to the admin",
      });

      setReportMessage("");
      setIsReportDialogOpen(false);
    } catch (error) {
      console.error("Error sending report:", error);
      toast({
        title: "Error",
        description: "Failed to send report",
        variant: "destructive",
      });
    } finally {
      setIsSendingReport(false);
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

  // Show not found screen if event doesn't exist
  if (!event) {
    return (
      <div className="min-h-screen bg-black text-white">
        <UserHeader onLogout={() => router.push("/user")} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
          <p className="text-gray-400 mb-6">
            The event you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button onClick={() => router.push("/user")}>Back to Events</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <UserHeader onLogout={() => router.push("/user")} />

      <ClientOnly>
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <Badge
              variant={
                event.status === "Scheduled"
                  ? "default"
                  : event.status === "Completed"
                  ? "outline"
                  : "secondary"
              }
              className="text-base py-1 px-3"
            >
              {event.status}
            </Badge>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content area - Stream placeholder */}
            <div className="flex-1 h-[500px] lg:h-[720px] border border-green-500 rounded-xl overflow-hidden shadow-lg flex items-center justify-center text-gray-300 bg-gray-900">
              <div className="text-center p-8">
                <h2 className="text-2xl font-bold mb-4">Live Stream</h2>
                <p className="text-gray-400 mb-6">
                  {event.status === "Scheduled"
                    ? "This event is scheduled to start at " + event.time
                    : event.status === "Completed"
                    ? "This event has ended. Check the results tab for details."
                    : "Stream will be available soon"}
                </p>
                <div className="flex justify-center items-center space-x-12 my-8">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
                      {event.participants[0]?.name?.charAt(0) || "?"}
                    </div>
                    <div className="font-bold text-xl">
                      {event.participants[0]?.name}
                    </div>
                  </div>

                  <div className="text-4xl font-bold text-green-500">VS</div>

                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
                      {event.participants[1]?.name?.charAt(0) || "?"}
                    </div>
                    <div className="font-bold text-xl">
                      {event.participants[1]?.name}
                    </div>
                  </div>
                </div>

                <div className="text-gray-400">
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </div>
              </div>
            </div>

            {/* Chat/Analyst/Results sidebar */}
            <div className="w-full lg:w-[360px] border border-green-500 rounded-xl bg-gray-900 flex flex-col">
              <div className="flex">
                {(["chat", "analyst", "results"] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-center font-semibold ${
                      activeTab === tab
                        ? "bg-green-600 text-white"
                        : "bg-gray-800 text-gray-300"
                    } ${tab === "chat" && "rounded-tl-xl"} ${
                      tab === "results" && "rounded-tr-xl"
                    }`}
                  >
                    {tab === "chat" && (
                      <MessageSquare className="h-4 w-4 inline mr-2" />
                    )}
                    {tab === "analyst" && (
                      <BarChart className="h-4 w-4 inline mr-2" />
                    )}
                    {tab === "results" && (
                      <Trophy className="h-4 w-4 inline mr-2" />
                    )}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex-1 p-4 overflow-y-auto max-h-[500px]">
                {activeTab === "chat" && (
                  <div className="space-y-4">
                    {chatMessages.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        No messages yet. Be the first to chat!
                      </div>
                    ) : (
                      chatMessages.map((message) => {
                        const isCurrentUser = message.userId === user?.id;

                        return (
                          <div
                            key={message.id}
                            className={`flex items-start gap-3 ${
                              isCurrentUser ? "justify-end" : ""
                            }`}
                          >
                            {!isCurrentUser && (
                              <Avatar className="h-8 w-8">
                                <AvatarFallback
                                  className={`${
                                    message.type === "admin"
                                      ? "bg-red-600"
                                      : message.type === "system"
                                      ? "bg-blue-600"
                                      : "bg-gray-600"
                                  }`}
                                >
                                  {message.username
                                    .substring(0, 2)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            )}

                            <div
                              className={`max-w-[80%] rounded-lg p-3 ${
                                isCurrentUser
                                  ? "bg-green-800 text-white"
                                  : message.type === "admin"
                                  ? "bg-red-900 text-white"
                                  : message.type === "system"
                                  ? "bg-blue-900 text-white"
                                  : "bg-gray-800 text-white"
                              }`}
                            >
                              {!isCurrentUser && (
                                <div className="text-xs font-semibold mb-1">
                                  {message.username}
                                  {message.type === "admin" && " (Admin)"}
                                  {message.type === "system" && " (System)"}
                                </div>
                              )}
                              <div>{message.message}</div>
                              <div className="text-xs text-gray-400 mt-1 text-right">
                                {new Date(
                                  message.timestamp
                                ).toLocaleTimeString()}
                              </div>
                            </div>

                            {isCurrentUser && (
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-green-600">
                                  {user.displayName
                                    .substring(0, 2)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        );
                      })
                    )}
                    <div ref={chatEndRef} />
                  </div>
                )}

                {activeTab === "analyst" && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-purple-600">
                          AN
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-xs font-semibold mb-1">
                          Event Analyst
                        </div>
                        <div>
                          {event.participants[0]?.name} has won 3 out of their
                          last 5 matches.
                        </div>
                        <div className="text-xs text-gray-400 mt-1 text-right">
                          5m ago
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-purple-600">
                          AN
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-xs font-semibold mb-1">
                          Event Analyst
                        </div>
                        <div>
                          {event.participants[1]?.name} is currently on a
                          2-match winning streak.
                        </div>
                        <div className="text-xs text-gray-400 mt-1 text-right">
                          3m ago
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 mt-6">
                      <h3 className="font-semibold mb-2">Head-to-Head</h3>
                      <div className="flex justify-between items-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-500">
                            2
                          </div>
                          <div className="text-xs text-gray-400">
                            {event.participants[0]?.name}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">vs</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-500">
                            1
                          </div>
                          <div className="text-xs text-gray-400">
                            {event.participants[1]?.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "results" && (
                  <div>
                    <h3 className="text-xl font-semibold text-center mb-4">
                      Event Results
                    </h3>

                    {event.status === "Completed" ? (
                      <div className="bg-gray-800 rounded-lg p-4">
                        <div className="text-center mb-4">
                          <div className="text-sm text-gray-400">Winner</div>
                          <div className="text-2xl font-bold text-green-500">
                            {event.participants[0]?.name}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-center">
                            <div className="text-xl font-bold">
                              {event.participants[0]?.name}
                            </div>
                            <div className="text-3xl font-bold text-green-500">
                              3
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl">-</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold">
                              {event.participants[1]?.name}
                            </div>
                            <div className="text-3xl font-bold">1</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        Results will be available once the event is completed.
                      </div>
                    )}

                    <div className="mt-6">
                      <h4 className="font-semibold mb-2">Your Predictions</h4>
                      {predictions.length === 0 ? (
                        <div className="text-center py-4 text-gray-400 bg-gray-800 rounded-lg">
                          You haven't made any predictions for this event.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {predictions.map((prediction) => {
                            const participant = event.participants.find(
                              (p) => p.id === prediction.participantId
                            );

                            return (
                              <div
                                key={prediction.id}
                                className="bg-gray-800 rounded-lg p-3 flex justify-between items-center"
                              >
                                <div>
                                  <div className="font-medium">
                                    {participant?.name}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {new Date(
                                      prediction.timestamp
                                    ).toLocaleString()}
                                  </div>
                                </div>
                                <div>
                                  <div className="font-bold text-green-500">
                                    {prediction.amount} points
                                  </div>
                                  <div className="text-xs text-right">
                                    <Badge
                                      variant={
                                        prediction.status === "active"
                                          ? "default"
                                          : prediction.status === "won"
                                          ? "success"
                                          : "destructive"
                                      }
                                    >
                                      {prediction.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {activeTab === "chat" && (
                <form
                  onSubmit={handleSendMessage}
                  className="border-t border-gray-800 p-4 flex items-center space-x-2"
                >
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    disabled={isSendingMessage}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="bg-green-600 hover:bg-green-500"
                    disabled={isSendingMessage || !newMessage.trim()}
                  >
                    {isSendingMessage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Bottom row - Prediction and Ad */}
          <div className="flex flex-col lg:flex-row gap-8 mt-8">
            {/* Prediction card */}
            <div className="flex-1 border border-green-500 rounded-xl bg-gray-900 p-6 space-y-4">
              <h2 className="text-2xl font-semibold">Place Your Prediction</h2>

              {event.status !== "Scheduled" ? (
                <div className="text-center py-8 text-gray-400">
                  Predictions are only available for scheduled events.
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={() =>
                        setSelectedParticipant(event.participants[0])
                      }
                      className={`flex-1 py-6 rounded-xl border ${
                        selectedParticipant?.id === event.participants[0]?.id
                          ? "bg-green-600 border-green-400 text-white"
                          : "border-green-500 bg-transparent text-white hover:bg-green-900"
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-bold text-xl">
                          {event.participants[0]?.name}
                        </div>
                        <div className="text-sm mt-1">1.8x</div>
                      </div>
                    </Button>

                    <Button
                      onClick={() =>
                        setSelectedParticipant(event.participants[1])
                      }
                      className={`flex-1 py-6 rounded-xl border ${
                        selectedParticipant?.id === event.participants[1]?.id
                          ? "bg-green-600 border-green-400 text-white"
                          : "border-green-500 bg-transparent text-white hover:bg-green-900"
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-bold text-xl">
                          {event.participants[1]?.name}
                        </div>
                        <div className="text-sm mt-1">2.2x</div>
                      </div>
                    </Button>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">
                      Prediction Amount:
                    </label>
                    <Input
                      type="number"
                      min={1}
                      value={predictionAmount}
                      onChange={(e) =>
                        setPredictionAmount(parseInt(e.target.value) || 0)
                      }
                      placeholder="Enter amount"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="text-sm text-gray-400">
                    Your Balance:{" "}
                    <span className="text-green-500 font-medium">
                      {user?.balance || 0} points
                    </span>
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={handlePlacePrediction}
                      className="w-full bg-green-600 hover:bg-green-500 text-white py-6 text-lg"
                      disabled={
                        isPredicting ||
                        !selectedParticipant ||
                        predictionAmount <= 0
                      }
                    >
                      {isPredicting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Place Prediction"
                      )}
                    </Button>
                  </div>
                </>
              )}

              <div className="flex justify-center pt-4">
                <Dialog
                  open={isReportDialogOpen}
                  onOpenChange={setIsReportDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="link"
                      className="text-gray-400 hover:text-gray-300"
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Report an issue
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 text-white border-gray-800">
                    <DialogHeader>
                      <DialogTitle>Report an Issue</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Send a message to the admin about any issues with this
                        event.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                      <label className="block text-sm mb-2">Message:</label>
                      <textarea
                        value={reportMessage}
                        onChange={(e) => setReportMessage(e.target.value)}
                        placeholder="Describe the issue..."
                        className="w-full p-3 rounded bg-gray-800 border-gray-700 text-white min-h-[100px]"
                      />
                    </div>

                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsReportDialogOpen(false)}
                        className="border-gray-700 text-gray-300"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSendReport}
                        className="bg-green-600 hover:bg-green-500"
                        disabled={isSendingReport || !reportMessage.trim()}
                      >
                        {isSendingReport ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send Report"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Ad space */}
            <div className="w-full lg:w-[360px] border border-dashed border-green-400 bg-gray-900 rounded-xl flex items-center justify-center p-6">
              <div className="text-center">
                <div className="text-green-500 font-bold text-xl mb-2">
                  Premium Membership
                </div>
                <p className="text-gray-400 mb-4">
                  Get exclusive benefits and bonus points!
                </p>
                <Button className="bg-green-600 hover:bg-green-500">
                  Upgrade Now
                </Button>
              </div>
            </div>
          </div>
        </main>
      </ClientOnly>
    </div>
  );
}
