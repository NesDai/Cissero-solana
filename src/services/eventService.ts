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
