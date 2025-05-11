export interface Participant {
  id: string;
  name: string;
}

export interface Event {
  id: string;
  title: string;
  date: Date; // Changed from string to Date to match your usage
  time: string;
  status:
    | "Pending Approval"
    | "Scheduled"
    | "Needs Admin"
    | "Completed"
    | "Rejected";
  participants: Participant[];
  createdBy?: string; // Who created this event (admin or streamer name)
  createdById?: string; // ID of the admin who created the event
  assignedTo?: string; // ID of the admin assigned to this event
  assignedToName?: string; // Name of the admin assigned to this event
  lastModifiedBy?: string; // ID of the admin who last modified the event
  lastModifiedAt?: Date; // When the event was last modified
  rejectionReason?: string; // Optional reason for rejection
  rejectedBy?: string; // ID of the admin who rejected the event
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  balance: number;
  joinedAt: Date;
  lastActive: Date;
}

export interface Prediction {
  id: string;
  eventId: string;
  userId: string;
  participantId: string;
  amount: number;
  timestamp: Date;
  status: "active" | "won" | "lost" | "refunded";
}

export interface ChatMessage {
  id: string;
  eventId: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  type: "public" | "admin" | "system" | "user";
}

export interface PrivateMessage {
  id: string;
  senderId: string;
  recipientId: string;
  message: string;
  timestamp: Date;
  read: boolean;
  eventId?: string; // Optional reference to an event
}

// Mock data for development
const mockEvents: Event[] = [
  {
    id: "e1",
    title: "Tournament Finals",
    date: new Date(new Date().setHours(0, 0, 0, 0)), // Already normalized
    time: "8:00 PM",
    status: "Scheduled",
    participants: [
      { id: "p1", name: "Player A" },
      { id: "p2", name: "Player B" },
    ],
  },
  {
    id: "e2",
    title: "Qualifier Match",
    date: new Date(new Date(Date.now() + 86400000).setHours(0, 0, 0, 0)), // tomorrow, normalized
    time: "6:00 PM",
    status: "Needs Admin",
    participants: [
      { id: "p3", name: "Player C" },
      { id: "p4", name: "Player D" },
    ],
  },
  {
    id: "e3",
    title: "Exhibition Game",
    date: new Date(new Date(Date.now() + 172800000).setHours(0, 0, 0, 0)), // day after tomorrow, normalized
    time: "7:30 PM",
    status: "Completed",
    participants: [
      { id: "p5", name: "Player E" },
      { id: "p6", name: "Player F" },
    ],
  },
  {
    id: "e4",
    title: "Community Tournament",
    date: new Date(new Date(Date.now() + 259200000).setHours(0, 0, 0, 0)), // 3 days from now, normalized
    time: "7:00 PM",
    status: "Pending Approval",
    participants: [
      { id: "p7", name: "Player G" },
      { id: "p8", name: "Player H" },
    ],
    createdBy: "StreamerXYZ",
  },
  {
    id: "e5",
    title: "Charity Match",
    date: new Date(new Date(Date.now() + 345600000).setHours(0, 0, 0, 0)), // 4 days from now, normalized
    time: "6:30 PM",
    status: "Pending Approval",
    participants: [
      { id: "p9", name: "Player I" },
      { id: "p10", name: "Player J" },
    ],
    createdBy: "StreamerABC",
  },
  {
    id: "e6",
    title: "Controversial Match",
    date: new Date(new Date(Date.now() + 432000000).setHours(0, 0, 0, 0)), // 5 days from now, normalized
    time: "9:00 PM",
    status: "Rejected",
    participants: [
      { id: "p11", name: "Player K" },
      { id: "p12", name: "Player L" },
    ],
    createdBy: "StreamerDEF",
    rejectionReason: "Violates community guidelines",
  },
];

// Mock users for development
const mockUsers: User[] = [
  {
    id: "user1",
    username: "viewer123",
    displayName: "Enthusiastic Viewer",
    avatar: "/avatars/user1.png",
    balance: 1000,
    joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    lastActive: new Date(),
  },
  {
    id: "user2",
    username: "predictionking",
    displayName: "Prediction King",
    avatar: "/avatars/user2.png",
    balance: 5000,
    joinedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 120 days ago
    lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: "user3",
    username: "chatmaster",
    displayName: "Chat Master",
    avatar: "/avatars/user3.png",
    balance: 2500,
    joinedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
    lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
];

// Mock predictions for development
const mockPredictions: Prediction[] = [
  {
    id: "pred1",
    eventId: "e1",
    userId: "user1",
    participantId: "p1",
    amount: 100,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: "active",
  },
  {
    id: "pred2",
    eventId: "e1",
    userId: "user2",
    participantId: "p2",
    amount: 250,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    status: "active",
  },
  {
    id: "pred3",
    eventId: "e3",
    userId: "user1",
    participantId: "p5",
    amount: 150,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    status: "won",
  },
];

// Mock chat messages for development
const mockChatMessages: ChatMessage[] = [
  {
    id: "chat1",
    eventId: "e1",
    userId: "user1",
    username: "viewer123",
    message: "This match is going to be amazing!",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    type: "public",
  },
  {
    id: "chat2",
    eventId: "e1",
    userId: "user2",
    username: "predictionking",
    message: "I'm betting on Player B to win!",
    timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    type: "public",
  },
  {
    id: "chat3",
    eventId: "e1",
    userId: "admin1",
    username: "Super Admin",
    message: "Welcome everyone to the Tournament Finals!",
    timestamp: new Date(Date.now() - 35 * 60 * 1000), // 35 minutes ago
    type: "admin",
  },
];

// Mock private messages for development
const mockPrivateMessages: PrivateMessage[] = [
  {
    id: "pm1",
    senderId: "user1",
    recipientId: "admin1",
    message: "I think there's an issue with the scoring system.",
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    read: false,
    eventId: "e1",
  },
  {
    id: "pm2",
    senderId: "admin1",
    recipientId: "user1",
    message: "Thanks for reporting. I'll look into it right away.",
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    read: true,
    eventId: "e1",
  },
];

// Mock streamers data
const mockStreamers = [
  {
    id: "streamer1",
    username: "gamergirl",
    displayName: "Gamer Girl",
    followers: 125000,
    category: "Fighting Games",
    status: "online",
    bio: "Professional fighting game player specializing in Street Fighter and Tekken. Streaming tournaments and practice sessions daily.",
    totalEvents: 24,
    joinedDate: new Date(2021, 3, 15),
  },
  {
    id: "streamer2",
    username: "speedrunmaster",
    displayName: "Speedrun Master",
    followers: 78500,
    category: "Speedrunning",
    status: "offline",
    bio: "World record holder in multiple games. I stream speedruns of classic and modern games, always trying to beat my personal best.",
    totalEvents: 12,
    joinedDate: new Date(2020, 7, 22),
  },
  {
    id: "streamer3",
    username: "esportspro",
    displayName: "Esports Pro",
    followers: 250000,
    category: "Competitive Gaming",
    status: "online",
    bio: "Former professional player now full-time streamer. I focus on competitive gameplay and coaching.",
    totalEvents: 36,
    joinedDate: new Date(2019, 1, 10),
  },
];

// Mock implementation for development
export async function fetchEvents(): Promise<Event[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...mockEvents];
}

// Mock implementation for development
export async function updateEvent(
  id: string,
  data: Partial<Event>
): Promise<Event> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const index = mockEvents.findIndex((e) => e.id === id);
  if (index === -1) throw new Error(`Event with id ${id} not found`);

  // Save previous state to history
  addToHistory(id, { ...mockEvents[index] }, "update");

  mockEvents[index] = { ...mockEvents[index], ...data };
  return mockEvents[index];
}

// Mock implementation for development
export async function deleteEvent(id: string): Promise<void> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const index = mockEvents.findIndex((e) => e.id === id);
  if (index === -1) throw new Error(`Event with id ${id} not found`);

  // Save previous state to history
  addToHistory(id, { ...mockEvents[index] }, "delete");

  mockEvents.splice(index, 1);
}

// Create a new event
export async function createEvent(data: Omit<Event, "id">): Promise<Event> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Generate a random ID (in a real app, the server would do this)
  const newEvent: Event = {
    id: `e${Date.now()}`,
    ...data,
  };

  // Add to our mock data
  mockEvents.push(newEvent);
  return newEvent;
}

// Approve a pending event
export async function approveEvent(id: string): Promise<Event> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const index = mockEvents.findIndex((e) => e.id === id);
  if (index === -1) throw new Error(`Event with id ${id} not found`);

  if (mockEvents[index].status !== "Pending Approval") {
    throw new Error("Only pending events can be approved");
  }

  // Save previous state to history
  addToHistory(id, { ...mockEvents[index] }, "approve");

  mockEvents[index].status = "Scheduled";
  return mockEvents[index];
}

// Reject a pending event
export async function rejectEvent(id: string, reason?: string): Promise<Event> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const index = mockEvents.findIndex((e) => e.id === id);
  if (index === -1) throw new Error(`Event with id ${id} not found`);

  if (mockEvents[index].status !== "Pending Approval") {
    throw new Error("Only pending events can be rejected");
  }

  // Save previous state to history
  addToHistory(id, { ...mockEvents[index] }, "reject");

  // Update status to rejected
  mockEvents[index].status = "Rejected";
  mockEvents[index].rejectionReason = reason || "No reason provided";

  return mockEvents[index];
}

// Add event history tracking
interface EventHistory {
  eventId: string;
  previousState: Event;
  timestamp: Date;
  action: "approve" | "reject" | "update" | "delete";
}

// Store event history
const eventHistory: EventHistory[] = [];

// Helper to add to history
function addToHistory(
  eventId: string,
  previousState: Event,
  action: EventHistory["action"]
) {
  eventHistory.push({
    eventId,
    previousState: { ...previousState },
    timestamp: new Date(),
    action,
  });

  // Limit history size (optional)
  if (eventHistory.length > 100) {
    eventHistory.shift();
  }
}

// Get event history
export async function getEventHistory(
  eventId?: string
): Promise<EventHistory[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (eventId) {
    return eventHistory.filter((h) => h.eventId === eventId);
  }
  return [...eventHistory];
}

// Undo last action for an event
export async function undoEventAction(eventId: string): Promise<Event | null> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Find the most recent history entry for this event
  const historyIndex = eventHistory.findIndex((h) => h.eventId === eventId);
  if (historyIndex === -1) return null;

  const history = eventHistory[historyIndex];

  // If the event was deleted, we need to add it back
  if (history.action === "delete") {
    mockEvents.push({ ...history.previousState });
    eventHistory.splice(historyIndex, 1);
    return history.previousState;
  }

  // Otherwise, find the event and restore its previous state
  const eventIndex = mockEvents.findIndex((e) => e.id === eventId);
  if (eventIndex === -1) return null;

  // Restore previous state
  mockEvents[eventIndex] = { ...history.previousState };

  // Remove this history entry
  eventHistory.splice(historyIndex, 1);

  return mockEvents[eventIndex];
}

// User authentication
let currentUser: User | null = null;

export function loginUser(username: string): User | null {
  const user = mockUsers.find((u) => u.username === username);
  if (user) {
    user.lastActive = new Date();
    currentUser = user;

    // Store in localStorage for persistence
    if (typeof window !== "undefined") {
      try {
        const userForStorage = {
          ...user,
          joinedAt: user.joinedAt.toISOString(),
          lastActive: user.lastActive.toISOString(),
        };
        localStorage.setItem("currentUser", JSON.stringify(userForStorage));
      } catch (error) {
        console.error("Error storing user in localStorage:", error);
      }
    }

    return user;
  }
  return null;
}

export function getCurrentUser(): User | null {
  if (currentUser) {
    return currentUser;
  }

  // Try to get from localStorage
  if (typeof window !== "undefined") {
    try {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        // Convert ISO strings back to Date objects
        if (parsedUser.joinedAt) {
          parsedUser.joinedAt = new Date(parsedUser.joinedAt);
        }
        if (parsedUser.lastActive) {
          parsedUser.lastActive = new Date(parsedUser.lastActive);
        }

        currentUser = parsedUser;
        return currentUser;
      }
    } catch (error) {
      console.error("Error retrieving user from localStorage:", error);
    }
  }

  return null;
}

export function logoutUser(): void {
  currentUser = null;
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser");
  }
}

// Fetch events for user view (only shows Scheduled and Completed events)
export async function fetchUserEvents(): Promise<Event[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Filter events to only show Scheduled and Completed events
  return mockEvents.filter(
    (event) => event.status === "Scheduled" || event.status === "Completed"
  );
}

// Get event details with predictions
export async function getEventWithPredictions(
  eventId: string
): Promise<{ event: Event; predictions: Prediction[] }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const event = mockEvents.find((e) => e.id === eventId);
  if (!event) return null;

  const user = getCurrentUser();
  if (!user) return event;

  // Get predictions for this event
  const eventPredictions = mockPredictions.filter(
    (p) => p.eventId === eventId && p.userId === user.id
  );

  return {
    ...event,
    predictions: eventPredictions,
  };
}

// Place a prediction
export async function placePrediction(
  eventId: string,
  participantId: string,
  amount: number
) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = getCurrentUser();
  if (!user) {
    throw new Error("You must be logged in to place a prediction");
  }

  const event = mockEvents.find((e) => e.id === eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  if (event.status !== "Scheduled") {
    throw new Error("You can only place predictions on scheduled events");
  }

  if (amount <= 0) {
    throw new Error("Prediction amount must be greater than 0");
  }

  if (user.balance < amount) {
    throw new Error("Insufficient balance");
  }

  // Check if participant exists in the event
  const participant = event.participants.find(
    (p) => typeof p === "object" && p.id === participantId
  );

  if (!participant) {
    throw new Error("Invalid participant");
  }

  // Create the prediction
  const prediction: Prediction = {
    id: `pred${Date.now()}`,
    eventId,
    userId: user.id,
    participantId,
    amount,
    timestamp: new Date(),
    status: "active",
  };

  // Update user balance
  user.balance -= amount;

  // Save the prediction
  mockPredictions.push(prediction);

  // Update the user in localStorage
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          ...user,
          joinedAt: user.joinedAt.toISOString(),
          lastActive: user.lastActive.toISOString(),
        })
      );
    } catch (error) {
      console.error("Error updating user in localStorage:", error);
    }
  }

  return prediction;
}

// Get chat messages for an event
export async function getEventChatMessages(
  eventId: string
): Promise<ChatMessage[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return mockChatMessages
    .filter((m) => m.eventId === eventId)
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
}

// Send a chat message
export async function sendChatMessage(
  eventId: string,
  message: string
): Promise<ChatMessage> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = getCurrentUser();
  if (!user) {
    throw new Error("You must be logged in to send a message");
  }

  const newMessage: ChatMessage = {
    id: `chat${Date.now()}`,
    eventId,
    userId: user.id,
    username: user.displayName,
    message,
    timestamp: new Date(),
    type: "user",
  };

  mockChatMessages.push(newMessage);

  return newMessage;
}

// Send a private message to an admin
export async function sendPrivateMessage(
  recipientId: string,
  message: string,
  eventId?: string
): Promise<PrivateMessage> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = getCurrentUser();
  if (!user) {
    throw new Error("You must be logged in to send a message");
  }

  const newMessage: PrivateMessage = {
    id: `pm${Date.now()}`,
    senderId: user.id,
    recipientId,
    message,
    timestamp: new Date(),
    read: false,
    eventId,
  };

  mockPrivateMessages.push(newMessage);

  return newMessage;
}

// Get private messages for the current user
export async function getUserPrivateMessages(): Promise<PrivateMessage[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = getCurrentUser();
  if (!user) {
    throw new Error("You must be logged in to view messages");
  }

  return mockPrivateMessages
    .filter((m) => m.senderId === user.id || m.recipientId === user.id)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// Get all streamers
export async function getStreamers() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockStreamers;
}

// Get a specific streamer profile
export async function getStreamerProfile(streamerId: string) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockStreamers.find((s) => s.id === streamerId) || null;
}

// Get events for a specific streamer
export async function getStreamerEvents(streamerId: string) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Filter events that are related to this streamer
  return mockEvents.filter(
    (event) =>
      event.createdBy ===
      mockStreamers.find((s) => s.id === streamerId)?.displayName
  );
}

// Get user predictions with event details
export async function getUserPredictions(): Promise<
  Array<Prediction & { event: Event; participantName: string }>
> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = getCurrentUser();
  if (!user) {
    throw new Error("You must be logged in to view predictions");
  }

  const userPredictions = mockPredictions.filter((p) => p.userId === user.id);

  return userPredictions.map((prediction) => {
    const event = mockEvents.find((e) => e.id === prediction.eventId)!;
    const participant = event.participants.find(
      (p) => typeof p === "object" && p.id === prediction.participantId
    ) as Participant;

    return {
      ...prediction,
      event,
      participantName: participant?.name || "Unknown",
    };
  });
}
