"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  X,
  History,
  Edit,
  UserCheck,
  Trash2,
  Info,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import {
  Event as EventType,
  fetchEvents,
  updateEvent,
  deleteEvent,
  createEvent,
  approveEvent,
  rejectEvent,
  getEventHistory,
  undoEventAction,
} from "@/services/eventService";
import { Modal } from "@/components/admin/modal";
import { toast } from "@/components/ui/use-toast";
import { getCurrentAdmin } from "@/services/adminService";
import ClientOnly from "@/components/ClientOnly";

// Define Event type
interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  status:
    | "Scheduled" // Has admin assigned and ready to go
    | "Needs Admin" // Approved but needs admin assignment
    | "Completed" // Event has ended
    | "Pending Approval" // Waiting for admin approval
    | "Rejected"; // Not approved
  participants: string[];
  assignedTo?: string; // Admin assigned to monitor the event
}

// Add this type definition for event history
interface EventHistory {
  id: string;
  eventId: string;
  action: string;
  timestamp: Date;
  adminId: string;
  adminName: string;
  details: string;
}

// Helper function to get status badge color
const getStatusColor = (status: string) => {
  switch (status) {
    case "Scheduled":
      return "bg-green-600 text-white";
    case "Completed":
      return "bg-blue-600 text-white";
    case "Needs Admin":
      return "bg-yellow-600 text-black";
    case "Pending Approval":
      return "bg-orange-500 text-white";
    case "Rejected":
      return "bg-red-600 text-white";
    default:
      return "bg-gray-600 text-white";
  }
};

interface EventsTabProps {
  eventToView?: string | null;
  eventToAssign?: string | null;
}

export function EventsTab({ eventToView, eventToAssign }: EventsTabProps = {}) {
  // All state hooks must be declared at the top level
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calendarMonth, setCalendarMonth] = useState<Date | undefined>(
    undefined
  );
  const [events, setEvents] = useState<EventType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEventHistory, setSelectedEventHistory] = useState<
    string | null
  >(null);
  const [eventHistory, setEventHistory] = useState<EventHistory[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [editing, setEditing] = useState<EventType | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<EventType | null>(null);

  const calendarRef = useRef<HTMLDivElement>(null);

  // Initialize state after component mounts
  useEffect(() => {
    setIsClient(true);

    // Set dates only on client-side to avoid hydration mismatch
    setSelectedDate(new Date());
    setCalendarMonth(new Date());

    // Load events
    fetchEvents()
      .then((data) => {
        setEvents(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load events:", err);
        setIsLoading(false);
      });
  }, []);

  // Effect for applying styles after every render
  useEffect(() => {
    // Function to apply styles to calendar items
    const applyCalendarStyles = () => {
      if (!calendarRef.current) return;

      // Find all selected day cells
      const selectedDays = calendarRef.current.querySelectorAll(
        '[data-selected="true"]'
      );
      selectedDays.forEach((day) => {
        const button = day.querySelector("button");
        if (button) {
          button.style.backgroundColor = "#2563EB";
          button.style.color = "white";
        }
      });

      // Find all highlighted day cells (those with events)
      const highlightedDays =
        calendarRef.current.querySelectorAll(".highlighted");
      highlightedDays.forEach((day) => {
        const button = day.querySelector("button");
        if (button) {
          button.style.backgroundColor = "#166534";
          button.style.color = "white";
        }
      });
    };

    // Apply styles and set up a mutation observer to catch DOM changes
    setTimeout(applyCalendarStyles, 100);

    // Set up a mutation observer to watch for changes
    if (calendarRef.current) {
      const observer = new MutationObserver(applyCalendarStyles);
      observer.observe(calendarRef.current, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["data-selected", "class"],
      });

      return () => observer.disconnect();
    }
  }, [selectedDate, calendarMonth, events]);

  // Add effect to handle viewing events
  useEffect(() => {
    if (eventToView) {
      const event = events.find((e) => e.id === eventToView);
      if (event) {
        handleViewEventDetails(event);
      }
    }
  }, [eventToView, events]);

  // Add effect to handle assigning events
  useEffect(() => {
    if (eventToAssign) {
      handleAssignEvent(eventToAssign);
    }
  }, [eventToAssign]);

  const handleEdit = (e: EventType) => setEditing(e);

  const handleDelete = async (id: string) => {
    if (!confirm("Really delete this event?")) return;
    await deleteEvent(id);
    const data = await fetchEvents();
    setEvents(data);
  };

  const handleSave = async (updates: Partial<EventType>) => {
    if (!editing) return;
    await updateEvent(editing.id, updates);
    setEditing(null);
    const data = await fetchEvents();
    setEvents(data);
  };

  // Filter events based on search term and status filter
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.participants.some((p) => {
        if (typeof p === "string") {
          return p.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (typeof p === "object" && p !== null && "name" in p) {
          return p.name.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      });

    const matchesFilter =
      activeFilter === "All" || event.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  // Get events for the selected date in the calendar
  const eventsOnSelectedDate = events.filter(
    (event) =>
      selectedDate && event.date.toDateString() === selectedDate.toDateString()
  );

  // Get dates that have events
  const eventDates = events.map((event) => event.date.toDateString());

  // Function to handle month navigation
  const handleMonthChange = (direction: "prev" | "next") => {
    setCalendarMonth((prevMonth) => {
      if (!prevMonth) return new Date();
      const newMonth = new Date(prevMonth);
      if (direction === "prev") {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  // Function to jump to current month
  const goToCurrentMonth = () => {
    setSelectedDate(new Date());
    setCalendarMonth(new Date());
  };

  // Filter options for the events list
  const filterOptions = [
    "All",
    "Scheduled",
    "Needs Admin",
    "Completed",
    "Pending Approval",
    "Rejected",
  ];

  // Add a function to handle viewing history for a specific event
  const handleViewHistory = async (eventId: string) => {
    setIsLoading(true);
    try {
      const history = await getEventHistory(eventId);
      setEventHistory(history as unknown as EventHistory[]);
      setSelectedEventHistory(eventId);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle undoing an event action
  const handleUndo = async (eventId: string) => {
    if (!confirm("Are you sure you want to undo this action?")) {
      return;
    }

    setIsLoading(true);
    try {
      await undoEventAction(eventId);

      // Refresh data
      const data = await fetchEvents();
      setEvents(data);

      // Close the history modal
      setSelectedEventHistory(null);

      toast({
        title: "Success",
        description: "Action successfully undone!",
        variant: "default",
      });
    } catch (err) {
      console.error("Failed to undo action:", err);
      toast({
        title: "Error",
        description: "Failed to undo action",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle assigning an event to the current admin
  const handleAssignEvent = async (eventId: string) => {
    setIsLoading(true);
    try {
      const admin = getCurrentAdmin();
      if (!admin) {
        toast({
          title: "Error",
          description: "You must be logged in to assign events",
          variant: "destructive",
        });
        return;
      }

      // Update the event with the admin assignment and change status to Scheduled
      const updatedEvent = await updateEvent(eventId, {
        status: "Scheduled",
        assignedTo: admin.name,
        assignedAt: new Date(),
      });

      // Update the events list
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? updatedEvent : e))
      );

      toast({
        title: "Event Assigned",
        description: "You have been assigned to monitor this event",
      });
    } catch (error) {
      console.error("Error assigning event:", error);
      toast({
        title: "Error",
        description: "Failed to assign event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle approving a pending event
  const handleApproveEvent = async (eventId: string) => {
    try {
      await approveEvent(eventId);
      const data = await fetchEvents();
      setEvents(data);

      toast({
        title: "Success",
        description: "Event approved successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error approving event:", error);
      toast({
        title: "Error",
        description: "Failed to approve event. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to handle rejecting a pending event
  const handleRejectEvent = async (eventId: string) => {
    try {
      await rejectEvent(eventId);
      const data = await fetchEvents();
      setEvents(data);

      toast({
        title: "Success",
        description: "Event rejected successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Error rejecting event:", error);
      toast({
        title: "Error",
        description: "Failed to reject event. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Add a function to handle viewing event details
  const handleViewEventDetails = (event: EventType) => {
    // Set the event for viewing details instead of editing
    setViewingEvent(event);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar Card */}
        <Card className="bg-black bg-opacity-50 border-green-500 text-white md:col-span-1">
          <CardHeader>
            <CardTitle className="text-[20px] text-white">
              Event Calendar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <Button
                variant="outline"
                className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                onClick={goToCurrentMonth}
              >
                Today
              </Button>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                  onClick={() => handleMonthChange("prev")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                  onClick={() => handleMonthChange("next")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Wrap the Calendar in ClientOnly to prevent hydration errors */}
            <ClientOnly>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={calendarMonth}
                onMonthChange={setCalendarMonth}
                className="border-gray-700 text-white calendar-custom"
                classNames={{
                  day_today: "bg-gray-700 text-white",
                  day_selected: "bg-gray-800 text-white",
                  day: "text-white hover:bg-gray-700",
                  day_disabled: "text-gray-600",
                  head_cell: "text-gray-400",
                  caption: "text-white",
                  nav_button:
                    "border border-gray-700 bg-gray-800 text-white hover:bg-gray-700",
                  table: "border-gray-700",
                }}
                modifiers={{
                  highlighted: (date) =>
                    eventDates.includes(date.toDateString()),
                }}
                modifiersClassNames={{
                  highlighted: "bg-green-800 text-white",
                }}
              />
            </ClientOnly>

            {/* Calendar Legend */}
            <div className="mt-4 flex items-center text-sm text-gray-400">
              <div className="flex items-center mr-4">
                <div className="w-4 h-4 bg-green-800 rounded-sm mr-2"></div>
                <span>Events scheduled</span>
              </div>
            </div>

            {selectedDate && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white">
                  Events on {format(selectedDate, "EEE MMM d yyyy")}
                </h3>
                {eventsOnSelectedDate.length === 0 ? (
                  <p className="text-gray-400">
                    No events scheduled for this day.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {eventsOnSelectedDate.map((event) => (
                      <div
                        key={event.id}
                        className="bg-gray-800 p-3 rounded border border-gray-700 mt-2"
                      >
                        <div className="flex justify-between">
                          <h4 className="font-medium text-white">
                            {event.title}
                          </h4>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm">{event.time}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {event.participants.map((participant, i) => (
                            <Badge key={i} className="bg-gray-700 text-white">
                              {typeof participant === "string"
                                ? participant
                                : participant.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Events List Card */}
        <Card className="bg-black bg-opacity-50 border-green-500 text-white md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[20px] text-white">
              Manage Events
            </CardTitle>
            <div>
              <Button
                className="bg-green-500 text-black hover:bg-green-400"
                onClick={() => setIsCreating(true)}
                data-create-event
              >
                Create New Event
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search events..."
                  className="pl-8 bg-gray-800 border-gray-700 text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex-shrink-0 w-full md:w-auto">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    variant={activeFilter === "All" ? "default" : "outline"}
                    className={
                      activeFilter === "All"
                        ? "bg-green-500 text-black hover:bg-green-400"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                    }
                    onClick={() => setActiveFilter("All")}
                  >
                    All
                  </Button>
                  <Button
                    variant={
                      activeFilter === "Scheduled" ? "default" : "outline"
                    }
                    className={
                      activeFilter === "Scheduled"
                        ? "bg-green-500 text-black hover:bg-green-400"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                    }
                    onClick={() => setActiveFilter("Scheduled")}
                  >
                    Scheduled
                  </Button>
                  <Button
                    variant={
                      activeFilter === "Needs Admin" ? "default" : "outline"
                    }
                    className={
                      activeFilter === "Needs Admin"
                        ? "bg-green-500 text-black hover:bg-green-400"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                    }
                    onClick={() => setActiveFilter("Needs Admin")}
                  >
                    Needs Admin
                  </Button>
                  <Button
                    variant={
                      activeFilter === "Pending Approval"
                        ? "default"
                        : "outline"
                    }
                    className={
                      activeFilter === "Pending Approval"
                        ? "bg-green-500 text-black hover:bg-green-400"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                    }
                    onClick={() => setActiveFilter("Pending Approval")}
                  >
                    Pending Approval
                  </Button>
                  <Button
                    variant={
                      activeFilter === "Completed" ? "default" : "outline"
                    }
                    className={
                      activeFilter === "Completed"
                        ? "bg-green-500 text-black hover:bg-green-400"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                    }
                    onClick={() => setActiveFilter("Completed")}
                  >
                    Completed
                  </Button>
                </div>
              </div>
            </div>

            {/* Events grid */}
            <div className="grid grid-cols-1 gap-4">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="bg-black bg-opacity-50 border-green-500 overflow-hidden"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg text-white">
                          {event.title}
                        </CardTitle>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center text-gray-400">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {event.date
                            ? format(new Date(event.date), "MMMM d, yyyy")
                            : "Date not set"}
                        </div>
                        <div className="flex items-center text-gray-400">
                          <Clock className="h-4 w-4 mr-1" />
                          {event.time || "Time not set"}
                        </div>
                        {event.assignedTo && (
                          <div className="flex items-center text-gray-400">
                            <UserCheck className="h-4 w-4 mr-1" />
                            Assigned to: {event.assignedTo}
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-between">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-gray-700 text-white hover:bg-gray-600"
                        data-view-event={event.id}
                        onClick={() => handleViewEventDetails(event)}
                      >
                        <Info className="h-3.5 w-3.5 mr-1" />
                        View
                      </Button>

                      {/* Show different action buttons based on status */}
                      {event.status === "Needs Admin" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-green-600 text-white border-green-500 hover:bg-green-500"
                          data-assign-event={event.id}
                          onClick={() => handleAssignEvent(event.id)}
                        >
                          <UserCheck className="h-3.5 w-3.5 mr-1" />
                          Assign Me
                        </Button>
                      )}

                      {event.status === "Pending Approval" && (
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-600 text-white border-green-500 hover:bg-green-500"
                            onClick={() => handleApproveEvent(event.id)}
                          >
                            <Check className="h-3.5 w-3.5 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-600 text-white border-red-500 hover:bg-red-500"
                            onClick={() => handleRejectEvent(event.id)}
                          >
                            <X className="h-3.5 w-3.5 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}

                      {event.status === "Scheduled" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-purple-600 text-white border-purple-500 hover:bg-purple-500"
                          onClick={() => handleCompleteEvent(event.id)}
                        >
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Complete
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center p-8 text-gray-400">
                  No events found matching your criteria
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event History Modal */}
      {selectedEventHistory && (
        <Modal onClose={() => setSelectedEventHistory(null)}>
          <div className="p-6 bg-gray-900 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-4">Event History</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {eventHistory.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-3 rounded border border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-semibold text-white">
                        {item.action}
                      </span>
                      <div className="text-sm text-gray-400">
                        by {item.adminName} on {format(item.timestamp, "PPP p")}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-yellow-600 text-white border-yellow-500 hover:bg-yellow-500"
                      onClick={() => handleUndo(item.eventId)}
                    >
                      Undo
                    </Button>
                  </div>
                  {item.details && (
                    <div className="mt-2 text-sm text-gray-300">
                      {item.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                onClick={() => setSelectedEventHistory(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Event Modal */}
      {editing && (
        <EditEventModal
          event={editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}

      {/* Create Event Modal */}
      {isCreating && (
        <CreateEventModal
          onSave={async (data) => {
            await createEvent(data);
            setIsCreating(false);
            const refreshedEvents = await fetchEvents();
            setEvents(refreshedEvents);
          }}
          onClose={() => setIsCreating(false)}
        />
      )}

      {/* Event Details Modal */}
      {viewingEvent && (
        <EventDetailsModal
          event={viewingEvent}
          onClose={() => setViewingEvent(null)}
        />
      )}
    </div>
  );
}

export function EditEventModal({
  event,
  onSave,
  onClose,
}: {
  event: EventType;
  onSave: (updates: Partial<EventType>) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState<Date | undefined>(event.date);
  const [time, setTime] = useState(event.time);
  const [status, setStatus] = useState<EventType["status"]>(event.status);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Instead of a comma-separated string, manage participants as objects
  const [participants, setParticipants] = useState<
    { id: string; name: string }[]
  >(event.participants);

  // For adding new participants
  const [newParticipant, setNewParticipant] = useState("");

  const handleAddParticipant = () => {
    if (!newParticipant.trim()) return;

    // Generate a unique ID for new participants
    const newId = `p${Date.now()}`;
    setParticipants([
      ...participants,
      { id: newId, name: newParticipant.trim() },
    ]);
    setNewParticipant("");
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants(participants.filter((p) => p.id !== id));
  };

  const handleSave = () => {
    if (!title || participants.length < 2) return;

    onSave({
      title,
      date,
      time,
      status,
      participants,
    });
  };

  return (
    <Modal onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Edit Event</h2>

        <div className="space-y-2">
          <Label htmlFor="title" className="text-white">
            Event Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-white">
              Date
            </Label>
            <div className="relative space-y-2">
              <div
                className="bg-gray-800 border border-gray-700 rounded-md p-2 flex justify-between items-center cursor-pointer"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                <span className="text-white">
                  {date ? format(date, "MMMM d, yyyy") : "Select date"}
                </span>
                <CalendarIcon className="h-4 w-4 text-green-500" />
              </div>

              {showDatePicker && (
                <div className="absolute z-50 mt-1">
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDatePicker(false)}
                  />
                  <div className="relative z-50 bg-gray-900 border border-gray-700 rounded-md shadow-lg">
                    <div className="flex justify-between items-center p-2 border-b border-gray-700">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-gray-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (date) {
                            const prevMonth = new Date(date);
                            prevMonth.setMonth(prevMonth.getMonth() - 1);
                            setDate(prevMonth);
                          }
                        }}
                      >
                        <ChevronLeft className="h-4 w-4 text-green-500" />
                      </Button>
                      <span className="text-white font-medium">
                        {date ? format(date, "MMMM yyyy") : "Select date"}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-gray-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (date) {
                            const nextMonth = new Date(date);
                            nextMonth.setMonth(nextMonth.getMonth() + 1);
                            setDate(nextMonth);
                          }
                        }}
                      >
                        <ChevronRight className="h-4 w-4 text-green-500" />
                      </Button>
                    </div>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => {
                        if (d) {
                          setDate(d);
                          setShowDatePicker(false);
                        }
                      }}
                      className="p-2"
                      classNames={{
                        day_today: "border border-green-500 text-white",
                        day: "text-white hover:bg-gray-700",
                        day_selected: "bg-green-500 text-black font-bold",
                        nav: "hidden",
                        caption: "hidden",
                        head_cell: "text-gray-400 font-medium text-center py-2",
                        table: "w-full border-collapse",
                        cell: "text-center p-0 relative h-9",
                        button:
                          "h-8 w-8 p-0 font-normal text-center mx-auto rounded-md",
                        root: "bg-gray-900",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time" className="text-white">
              Time
            </Label>
            <div className="relative">
              <div
                className="bg-gray-800 border border-gray-700 rounded-md p-2 flex justify-between items-center cursor-pointer"
                onClick={() => setShowTimePicker(!showTimePicker)}
              >
                <span className="text-white">{time}</span>
                <Clock className="h-4 w-4 text-green-500" />
              </div>

              {showTimePicker && (
                <div className="absolute z-50 mt-1 right-0">
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowTimePicker(false)}
                  />
                  <div className="relative z-50 bg-gray-900 border border-gray-700 rounded-md shadow-lg p-4 w-64">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">Set Time</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-gray-800"
                          onClick={() => setShowTimePicker(false)}
                        >
                          <X className="h-4 w-4 text-green-500" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-gray-400 text-xs">Hour</Label>
                          <select
                            className="w-full bg-gray-800 border border-gray-700 rounded-md p-1 text-white"
                            value={time.split(":")[0]}
                            onChange={(e) => {
                              const parts = time.split(/[:\s]/);
                              const minutes = parts[1];
                              const ampm = parts[2];
                              setTime(`${e.target.value}:${minutes} ${ampm}`);
                            }}
                          >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(
                              (hour) => (
                                <option key={hour} value={hour}>
                                  {hour}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-gray-400 text-xs">
                            Minute
                          </Label>
                          <select
                            className="w-full bg-gray-800 border border-gray-700 rounded-md p-1 text-white"
                            value={time.split(":")[1].split(" ")[0]}
                            onChange={(e) => {
                              const parts = time.split(/[:\s]/);
                              const hours = parts[0];
                              const ampm = parts[2];
                              setTime(`${hours}:${e.target.value} ${ampm}`);
                            }}
                          >
                            {Array.from({ length: 12 }, (_, i) => i * 5).map(
                              (minute) => (
                                <option
                                  key={minute}
                                  value={minute.toString().padStart(2, "0")}
                                >
                                  {minute.toString().padStart(2, "0")}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`rounded-full px-4 ${
                            time.includes("AM")
                              ? "bg-green-500 text-black"
                              : "bg-gray-800 text-white"
                          }`}
                          onClick={() => {
                            const [hours, minutes] = time.split(/[:\s]/);
                            setTime(`${hours}:${minutes} AM`);
                          }}
                        >
                          AM
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`rounded-full px-4 ${
                            time.includes("PM")
                              ? "bg-green-500 text-black"
                              : "bg-gray-800 text-white"
                          }`}
                          onClick={() => {
                            const [hours, minutes] = time.split(/[:\s]/);
                            setTime(`${hours}:${minutes} PM`);
                          }}
                        >
                          PM
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="text-white">
            Status
          </Label>
          <div className="flex gap-2">
            {["Scheduled", "Needs Admin", "Completed", "Rejected"].map((s) => (
              <Badge
                key={s}
                className={`cursor-pointer ${
                  status === s
                    ? s === "Completed"
                      ? "bg-green-500 text-black"
                      : s === "Scheduled"
                      ? "bg-blue-500 text-white"
                      : s === "Rejected"
                      ? "bg-red-500 text-white"
                      : "bg-yellow-500 text-black"
                    : "bg-gray-700 text-white"
                }`}
                onClick={() => setStatus(s as EventType["status"])}
              >
                {s}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="participants" className="text-white">
            Participants
          </Label>

          <div className="space-y-2">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center gap-2">
                <Input
                  value={participant.name}
                  onChange={(e) => {
                    setParticipants(
                      participants.map((p) =>
                        p.id === participant.id
                          ? { ...p, name: e.target.value }
                          : p
                      )
                    );
                  }}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-red-600 text-white border-red-500 hover:bg-red-500"
                  onClick={() => handleRemoveParticipant(participant.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <div className="flex items-center gap-2">
              <Input
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
                placeholder="Add new participant"
                className="bg-gray-800 border-gray-700 text-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddParticipant();
                  }
                }}
              />
              <Button
                variant="outline"
                size="sm"
                className="bg-green-600 text-white border-green-500 hover:bg-green-500"
                onClick={handleAddParticipant}
              >
                Add
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            className="bg-green-600 text-white border-green-500 hover:bg-green-500"
            onClick={handleSave}
            disabled={!title || participants.length < 2}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function CreateEventModal({
  onSave,
  onClose,
  isAdmin = true,
}: {
  onSave: (data: Omit<EventType, "id">) => void;
  onClose: () => void;
  isAdmin?: boolean;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("8:00 PM");
  const [status, setStatus] = useState<EventType["status"]>(
    isAdmin ? "Scheduled" : "Pending Approval"
  );
  const [createdBy, setCreatedBy] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Manage participants as objects with IDs
  const [participants, setParticipants] = useState<
    { id: string; name: string }[]
  >([]);
  const [newParticipant, setNewParticipant] = useState("");

  const handleAddParticipant = () => {
    if (!newParticipant.trim()) return;

    // Generate a unique ID for new participants
    const newId = `p${Date.now()}`;
    setParticipants([
      ...participants,
      { id: newId, name: newParticipant.trim() },
    ]);
    setNewParticipant("");
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants(participants.filter((p) => p.id !== id));
  };

  const handleSave = () => {
    if (!title || participants.length < 2) return;

    onSave({
      title,
      date: date!,
      time,
      status,
      participants,
      ...(isAdmin ? {} : { createdBy }),
    });
  };

  return (
    <Modal onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Create New Event</h2>

        <div className="space-y-2">
          <Label htmlFor="title" className="text-white">
            Event Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            placeholder="Enter event title"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-white">
              Date
            </Label>
            <div className="relative space-y-2">
              <div
                className="bg-gray-800 border border-gray-700 rounded-md p-2 flex justify-between items-center cursor-pointer"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                <span className="text-white">
                  {date ? format(date, "MMMM d, yyyy") : "Select date"}
                </span>
                <CalendarIcon className="h-4 w-4 text-green-500" />
              </div>

              {showDatePicker && (
                <div className="absolute z-50 mt-1">
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDatePicker(false)}
                  />
                  <div className="relative z-50 bg-gray-900 border border-gray-700 rounded-md shadow-lg">
                    <div className="flex justify-between items-center p-2 border-b border-gray-700">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-gray-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (date) {
                            const prevMonth = new Date(date);
                            prevMonth.setMonth(prevMonth.getMonth() - 1);
                            setDate(prevMonth);
                          }
                        }}
                      >
                        <ChevronLeft className="h-4 w-4 text-green-500" />
                      </Button>
                      <span className="text-white font-medium">
                        {date ? format(date, "MMMM yyyy") : "Select date"}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-gray-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (date) {
                            const nextMonth = new Date(date);
                            nextMonth.setMonth(nextMonth.getMonth() + 1);
                            setDate(nextMonth);
                          }
                        }}
                      >
                        <ChevronRight className="h-4 w-4 text-green-500" />
                      </Button>
                    </div>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => {
                        if (d) {
                          setDate(d);
                          setShowDatePicker(false);
                        }
                      }}
                      className="p-2"
                      classNames={{
                        day_today: "border border-green-500 text-white",
                        day: "text-white hover:bg-gray-700",
                        day_selected: "bg-green-500 text-black font-bold",
                        nav: "hidden",
                        caption: "hidden",
                        head_cell: "text-gray-400 font-medium text-center py-2",
                        table: "w-full border-collapse",
                        cell: "text-center p-0 relative h-9",
                        button:
                          "h-8 w-8 p-0 font-normal text-center mx-auto rounded-md",
                        root: "bg-gray-900",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time" className="text-white">
              Time
            </Label>
            <div className="relative">
              <div
                className="bg-gray-800 border border-gray-700 rounded-md p-2 flex justify-between items-center cursor-pointer"
                onClick={() => setShowTimePicker(!showTimePicker)}
              >
                <span className="text-white">{time}</span>
                <Clock className="h-4 w-4 text-green-500" />
              </div>

              {showTimePicker && (
                <div className="absolute z-50 mt-1 right-0">
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowTimePicker(false)}
                  />
                  <div className="relative z-50 bg-gray-900 border border-gray-700 rounded-md shadow-lg p-4 w-64">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">Set Time</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-gray-800"
                          onClick={() => setShowTimePicker(false)}
                        >
                          <X className="h-4 w-4 text-green-500" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-gray-400 text-xs">Hour</Label>
                          <select
                            className="w-full bg-gray-800 border border-gray-700 rounded-md p-1 text-white"
                            value={time.split(":")[0]}
                            onChange={(e) => {
                              const parts = time.split(/[:\s]/);
                              const minutes = parts[1];
                              const ampm = parts[2];
                              setTime(`${e.target.value}:${minutes} ${ampm}`);
                            }}
                          >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(
                              (hour) => (
                                <option key={hour} value={hour}>
                                  {hour}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-gray-400 text-xs">
                            Minute
                          </Label>
                          <select
                            className="w-full bg-gray-800 border border-gray-700 rounded-md p-1 text-white"
                            value={time.split(":")[1].split(" ")[0]}
                            onChange={(e) => {
                              const parts = time.split(/[:\s]/);
                              const hours = parts[0];
                              const ampm = parts[2];
                              setTime(`${hours}:${e.target.value} ${ampm}`);
                            }}
                          >
                            {Array.from({ length: 12 }, (_, i) => i * 5).map(
                              (minute) => (
                                <option
                                  key={minute}
                                  value={minute.toString().padStart(2, "0")}
                                >
                                  {minute.toString().padStart(2, "0")}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`rounded-full px-4 ${
                            time.includes("AM")
                              ? "bg-green-500 text-black"
                              : "bg-gray-800 text-white"
                          }`}
                          onClick={() => {
                            const [hours, minutes] = time.split(/[:\s]/);
                            setTime(`${hours}:${minutes} AM`);
                          }}
                        >
                          AM
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`rounded-full px-4 ${
                            time.includes("PM")
                              ? "bg-green-500 text-black"
                              : "bg-gray-800 text-white"
                          }`}
                          onClick={() => {
                            const [hours, minutes] = time.split(/[:\s]/);
                            setTime(`${hours}:${minutes} PM`);
                          }}
                        >
                          PM
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="text-white">
            Status
          </Label>
          <div className="flex gap-2">
            {["Scheduled", "Needs Admin", "Completed"].map((s) => (
              <Badge
                key={s}
                className={`cursor-pointer ${
                  status === s
                    ? s === "Completed"
                      ? "bg-green-500 text-black"
                      : s === "Scheduled"
                      ? "bg-blue-500 text-white"
                      : "bg-yellow-500 text-black"
                    : "bg-gray-700 text-white"
                }`}
                onClick={() => setStatus(s as EventType["status"])}
              >
                {s}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="participants" className="text-white">
            Participants
          </Label>
          <Input
            id="participants"
            value={participants.map((p) => p.name).join(", ")}
            onChange={(e) => {
              const newParticipants = e.target.value
                .split(",")
                .map((p) => ({ id: `p${Date.now()}`, name: p.trim() }));
              setParticipants(newParticipants);
            }}
            placeholder="Enter participants separated by commas"
            className="bg-gray-800 border-gray-700 text-white"
          />
          <p className="text-xs text-gray-400">
            Separate participants with commas (e.g., &quot;Player A, Player
            B&quot;)
          </p>
        </div>

        {!isAdmin && (
          <div className="space-y-2">
            <Label htmlFor="createdBy" className="text-white">
              Your Name/Channel
            </Label>
            <Input
              id="createdBy"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Enter your name or channel"
            />
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            className="bg-green-600 text-white border-green-500 hover:bg-green-500"
            onClick={handleSave}
            disabled={!title || participants.length < 2}
          >
            Create Event
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function EventDetailsModal({
  event,
  onClose,
}: {
  event: EventType;
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose}>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{event.title}</h2>
          <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Event Details
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-gray-400">Date:</span>{" "}
                <span className="text-white">
                  {event.date
                    ? format(new Date(event.date), "MMMM d, yyyy")
                    : "Not set"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Time:</span>{" "}
                <span className="text-white">{event.time || "Not set"}</span>
              </div>
              <div>
                <span className="text-gray-400">Created:</span>{" "}
                <span className="text-white">
                  {event.createdAt
                    ? format(
                        new Date(event.createdAt),
                        "MMM d, yyyy 'at' h:mm a"
                      )
                    : "Unknown"}
                </span>
              </div>
              {event.createdBy && (
                <div>
                  <span className="text-gray-400">Created By:</span>{" "}
                  <span className="text-white">{event.createdBy}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Assignment
            </h3>
            <div className="space-y-2">
              {event.assignedTo ? (
                <>
                  <div>
                    <span className="text-gray-400">Assigned To:</span>{" "}
                    <span className="text-white">{event.assignedTo}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Assigned On:</span>{" "}
                    <span className="text-white">
                      {event.assignedAt
                        ? format(
                            new Date(event.assignedAt),
                            "MMM d, yyyy 'at' h:mm a"
                          )
                        : "Unknown"}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-yellow-500">Not assigned</div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Participants
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {event.participants.map((participant, index) => (
              <div
                key={index}
                className="bg-gray-800 p-2 rounded-md text-white flex items-center"
              >
                {typeof participant === "string"
                  ? participant
                  : participant.name || "Unknown Participant"}
              </div>
            ))}
          </div>
        </div>

        {event.notes && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Notes</h3>
            <div className="bg-gray-800 p-3 rounded-md text-white">
              {event.notes}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <div>
            {event.status === "Needs Admin" && (
              <Button
                variant="outline"
                className="bg-green-600 text-white border-green-500 hover:bg-green-500 mr-2"
                onClick={() => {
                  onClose();
                  handleAssignEvent(event.id);
                }}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Assign Me
              </Button>
            )}
            {(event.status === "Scheduled" ||
              event.status === "Needs Admin") && (
              <Button
                variant="outline"
                className="bg-blue-600 text-white border-blue-500 hover:bg-blue-500"
                onClick={() => {
                  onClose();
                  handleEdit(event);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {event.status === "Scheduled" && (
              <Button
                variant="outline"
                className="bg-purple-600 text-white border-purple-500 hover:bg-purple-500 ml-2"
                onClick={() => {
                  onClose();
                  // Handle marking event as completed
                  handleCompleteEvent(event.id);
                }}
              >
                <Check className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Add a function to handle completing events
const handleCompleteEvent = async (eventId: string) => {
  setIsLoading(true);
  try {
    // Update the event status to Completed
    const updatedEvent = await updateEvent(eventId, {
      status: "Completed",
      completedAt: new Date(),
    });

    // Update the events list
    setEvents((prev) => prev.map((e) => (e.id === eventId ? updatedEvent : e)));

    toast({
      title: "Event Completed",
      description: "The event has been marked as completed",
    });
  } catch (error) {
    console.error("Error completing event:", error);
    toast({
      title: "Error",
      description: "Failed to complete event",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};
