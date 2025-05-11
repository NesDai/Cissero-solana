"use client";

import { useState, useEffect } from "react";
import { UserHeader } from "@/components/user/UserHeader";
import {
  getCurrentUser,
  getUserPrivateMessages,
  PrivateMessage,
} from "@/services/eventService";
import { Loader2, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ClientOnly from "@/components/ClientOnly";

export default function MessagesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/user");
      return;
    }

    loadMessages();
  }, [router]);

  const loadMessages = async () => {
    try {
      const userMessages = await getUserPrivateMessages();
      setMessages(userMessages);

      // Select the most recent conversation by default
      if (userMessages.length > 0) {
        const uniqueConversations = [
          ...new Set(
            userMessages.map((m) =>
              m.senderId === getCurrentUser()?.id ? m.recipientId : m.senderId
            )
          ),
        ];

        if (uniqueConversations.length > 0) {
          setSelectedConversation(uniqueConversations[0]);
        }
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique conversations
  const conversations = [
    ...new Set(
      messages.map((m) =>
        m.senderId === getCurrentUser()?.id ? m.recipientId : m.senderId
      )
    ),
  ];

  // Get messages for the selected conversation
  const conversationMessages = selectedConversation
    ? messages
        .filter(
          (m) =>
            (m.senderId === selectedConversation &&
              m.recipientId === getCurrentUser()?.id) ||
            (m.recipientId === selectedConversation &&
              m.senderId === getCurrentUser()?.id)
        )
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )
    : [];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setIsSending(true);
    try {
      // In a real app, you'd call an API to send the message
      // For now, we'll just add it to the local state
      const message: PrivateMessage = {
        id: `pm${Date.now()}`,
        senderId: getCurrentUser()?.id || "",
        recipientId: selectedConversation,
        message: newMessage,
        timestamp: new Date(),
        read: false,
      };

      setMessages([...messages, message]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
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

  return (
    <div className="min-h-screen bg-black text-white">
      <UserHeader onLogout={() => router.push("/user")} />

      <ClientOnly>
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Messages</h1>

          {messages.length === 0 ? (
            <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
              <h2 className="text-xl text-gray-400 mb-2">No messages yet</h2>
              <p className="text-gray-500">
                You can send messages to admins from event pages by using the
                Report button.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Conversations list */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-800">
                  <h2 className="font-bold">Conversations</h2>
                </div>

                <div className="divide-y divide-gray-800">
                  {conversations.map((conversationId) => {
                    const lastMessage = [...messages]
                      .filter(
                        (m) =>
                          (m.senderId === conversationId &&
                            m.recipientId === getCurrentUser()?.id) ||
                          (m.recipientId === conversationId &&
                            m.senderId === getCurrentUser()?.id)
                      )
                      .sort(
                        (a, b) =>
                          new Date(b.timestamp).getTime() -
                          new Date(a.timestamp).getTime()
                      )[0];

                    const isAdmin = conversationId.startsWith("admin");
                    const displayName = isAdmin
                      ? "Admin"
                      : "User " + conversationId;

                    return (
                      <div
                        key={conversationId}
                        className={`p-4 cursor-pointer hover:bg-gray-800 ${
                          selectedConversation === conversationId
                            ? "bg-gray-800"
                            : ""
                        }`}
                        onClick={() => setSelectedConversation(conversationId)}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback
                              className={`${
                                isAdmin ? "bg-blue-600" : "bg-green-600"
                              } text-white`}
                            >
                              {displayName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <p className="font-medium truncate">
                                {displayName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(
                                  lastMessage.timestamp
                                ).toLocaleDateString()}
                              </p>
                            </div>

                            <p className="text-sm text-gray-400 truncate">
                              {lastMessage.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Message thread */}
              <div className="md:col-span-2 bg-gray-900 border border-gray-800 rounded-lg overflow-hidden flex flex-col h-[600px]">
                {selectedConversation ? (
                  <>
                    <div className="p-4 border-b border-gray-800">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback
                            className={`${
                              selectedConversation.startsWith("admin")
                                ? "bg-blue-600"
                                : "bg-green-600"
                            } text-white`}
                          >
                            {selectedConversation.startsWith("admin")
                              ? "AD"
                              : `U${selectedConversation.substring(0, 1)}`}
                          </AvatarFallback>
                        </Avatar>

                        <h2 className="font-bold">
                          {selectedConversation.startsWith("admin")
                            ? "Admin"
                            : `User ${selectedConversation}`}
                        </h2>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {conversationMessages.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                          No messages yet. Start the conversation!
                        </div>
                      ) : (
                        conversationMessages.map((message) => {
                          const isCurrentUser =
                            message.senderId === getCurrentUser()?.id;

                          return (
                            <div
                              key={message.id}
                              className={`flex ${
                                isCurrentUser ? "justify-end" : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-[80%] rounded-lg p-3 ${
                                  isCurrentUser
                                    ? "bg-green-800 text-white"
                                    : "bg-gray-800 text-white"
                                }`}
                              >
                                <div>{message.message}</div>
                                <div className="text-xs text-gray-400 mt-1 text-right">
                                  {new Date(
                                    message.timestamp
                                  ).toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <form
                      onSubmit={handleSendMessage}
                      className="border-t border-gray-800 p-4 flex items-center space-x-2"
                    >
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                        disabled={isSending}
                      />
                      <Button
                        type="submit"
                        size="icon"
                        className="bg-green-600 hover:bg-green-500"
                        disabled={isSending || !newMessage.trim()}
                      >
                        {isSending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </form>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Select a conversation to view messages
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </ClientOnly>
    </div>
  );
}
