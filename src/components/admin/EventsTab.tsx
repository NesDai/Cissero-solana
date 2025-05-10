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
import { useState, useEffect } from "react";
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
import ClientOnly from "@/components/ClientOnly";

export function EventsTab() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEventHistory, setSelectedEventHistory] = useState<
    string | null
  >(null);
  const [eventHistory, setEventHistory] = useState<EventHistory[]>([]);

  // fetch once on mount
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (err) {
        console.error("Failed loading events:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // editing state & handlers
  const [editing, setEditing] = useState<EventType | null>(null);
  const [isCreating, setIsCreating] = useState(false);
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

  // Handle creating a new event
  const handleCreateNew = () => {
    setIsCreating(true);
  };

  // Handle saving a new event
  const handleSaveNew = async (data: Omit<EventType, "id">) => {
    await createEvent(data);
    setIsCreating(false);
    const refreshedEvents = await fetchEvents();
    setEvents(refreshedEvents);
  };

  // Add these handlers
  const handleApprove = async (id: string) => {
    await approveEvent(id);
    const data = await fetchEvents();
    setEvents(data);
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Please provide a reason for rejection:", "");
    if (reason === null) return; // User cancelled

    await rejectEvent(id, reason);
    const data = await fetchEvents();
    setEvents(data);
  };

  // Filter events based on search term and status filter
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.participants.some((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

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
    setCalendarMonth(new Date());
  };

  // Update your filter options
  const filterOptions = [
    "All",
    "Pending Approval",
    "Scheduled",
    "Needs Admin",
    "Completed",
    "Rejected",
  ];

  // Add a function to handle viewing history for a specific event
  const handleViewHistory = async (eventId: string) => {
    setIsLoading(true);
    try {
      const history = await getEventHistory(eventId);
      setEventHistory(history);
      setSelectedEventHistory(eventId);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Simplify the undo function
  const handleUndo = async (eventId: string) => {
    if (
      !confirm(
        "Are you sure you want to undo this action? This will revert the event to its previous state."
      )
    ) {
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

      // Show success message
      alert("Action successfully undone!");
    } catch (err) {
      console.error("Failed to undo action:", err);
      alert("Failed to undo action. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="bg-black bg-opacity-50 border-green-500 text-white lg:col-span-2">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-[20px] text-white">
              Event Management
            </CardTitle>
            <ClientOnly>
              <Button
                variant="outline"
                className="bg-green-600 text-white border-green-500 hover:bg-green-500"
                onClick={handleCreateNew}
              >
                Create New Event
              </Button>
            </ClientOnly>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Search events by title or participant..."
                  className="bg-gray-800 border-gray-700 text-white w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                className="bg-green-500 text-black hover:bg-green-400"
                onClick={() => {
                  /* Additional search logic if needed */
                }}
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            {filterOptions.map((option) => (
              <Badge
                key={option}
                className={`cursor-pointer ${
                  activeFilter === option
                    ? "bg-green-500 text-black"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
                onClick={() => setActiveFilter(option)}
              >
                {option}
              </Badge>
            ))}
          </div>

          <ClientOnly>
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading events...</p>
                </div>
              ) : filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="bg-gray-900 border-gray-700 mb-4"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-white text-lg">
                          {event.title}
                        </CardTitle>
                        <Badge
                          className={
                            event.status === "Completed"
                              ? "bg-green-500 text-black"
                              : event.status === "Scheduled"
                              ? "bg-blue-500 text-white"
                              : event.status === "Pending Approval"
                              ? "bg-purple-500 text-white"
                              : event.status === "Rejected"
                              ? "bg-red-500 text-white"
                              : "bg-yellow-500 text-black"
                          }
                        >
                          {event.status}
                        </Badge>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                        <div className="flex items-center text-gray-400">
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          <span>Date:</span>
                        </div>
                        <div className="text-white">
                          {format(event.date, "MMM d, yyyy")}
                        </div>

                        <div className="flex items-center text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Time:</span>
                        </div>
                        <div className="text-white">{event.time}</div>
                      </div>

                      {event.createdBy && (
                        <div className="mt-1 flex items-center text-xs text-gray-400">
                          <span className="mr-1">Requested by:</span>
                          <span className="text-gray-300">
                            {event.createdBy}
                          </span>
                        </div>
                      )}

                      {event.status === "Rejected" && event.rejectionReason && (
                        <div className="mt-1 flex items-center text-xs text-red-400">
                          <span className="mr-1">Rejected:</span>
                          <span>{event.rejectionReason}</span>
                        </div>
                      )}
                    </CardHeader>

                    <CardContent className="py-2">
                      <div className="border-t border-gray-800 pt-2">
                        <h4 className="text-gray-400 text-xs uppercase mb-1">
                          Participants
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {event.participants.map((participant) => (
                            <Badge
                              key={participant.id}
                              className="bg-gray-800 text-gray-300 border border-gray-700"
                              title={`ID: ${participant.id}`}
                            >
                              {participant.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-2 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-auto bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
                        onClick={() => handleViewHistory(event.id)}
                      >
                        <History className="h-4 w-4 mr-1" />
                        History
                      </Button>

                      {event.status === "Pending Approval" ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-600 text-white border-green-500 hover:bg-green-500"
                            onClick={() => handleApprove(event.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-600 text-white border-red-500 hover:bg-red-500"
                            onClick={() => handleReject(event.id)}
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                            onClick={() => handleEdit(event)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-600 text-white border-red-500 hover:bg-red-500"
                            onClick={() => handleDelete(event.id)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No events found matching your criteria
                </div>
              )}
            </div>
          </ClientOnly>
        </CardContent>
      </Card>

      <Card className="bg-black bg-opacity-50 border-green-500 text-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-[18px] text-white">
              Event Calendar
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              onClick={goToCurrentMonth}
            >
              Today
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              onClick={() => handleMonthChange("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-white font-medium">
              {format(calendarMonth, "MMMM yyyy")}
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              onClick={() => handleMonthChange("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mb-4 flex justify-center items-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={calendarMonth}
              onMonthChange={setCalendarMonth}
              className="w-full"
              classNames={{
                day_today: "border border-green-500 text-white",
                day: "text-white hover:bg-gray-700 text-center",
                day_selected:
                  "!bg-green-500 !text-black !font-bold hover:!bg-green-500",
                day_outside: "text-gray-500 opacity-50",
                head_cell: "text-gray-400 font-medium text-center py-3",
                cell: "text-center p-0 relative h-12",
                button:
                  "h-10 w-10 p-0 font-normal text-center mx-auto rounded-md",
                nav: "hidden !important",
                nav_button: "hidden !important",
                nav_button_previous: "hidden !important",
                nav_button_next: "hidden !important",
                caption: "hidden",
                caption_label: "hidden",
                table: "w-full border-collapse space-y-1 mx-auto",
                row: "flex justify-center w-full mt-2",
                head_row: "flex justify-center w-full mb-2",
                root: "bg-gray-900 border-gray-700 p-6 rounded-md mx-auto",
                months: "flex justify-center w-full",
                month: "w-full flex flex-col items-center",
              }}
            />
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="h-4 w-4 text-green-500" />
              <h3 className="text-white font-medium">
                Events on{" "}
                {selectedDate
                  ? format(selectedDate, "MMM d, yyyy")
                  : "Selected Date"}
              </h3>
            </div>
            {eventsOnSelectedDate.length > 0 ? (
              <div className="space-y-2">
                {eventsOnSelectedDate.map((event) => (
                  <div
                    key={event.id}
                    className="bg-gray-800 p-3 rounded text-sm border-l-4 border-green-500"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{event.title}</span>
                      <Badge
                        className={
                          event.status === "Completed"
                            ? "bg-green-500 text-black"
                            : event.status === "Scheduled"
                            ? "bg-blue-500 text-white"
                            : "bg-yellow-500 text-black"
                        }
                      >
                        {event.status}
                      </Badge>
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      {event.time} • {event.participants.join(" vs ")}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No events on this date</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* render the edit‐form modal when an event is being edited */}
      {editing && (
        <EditEventModal
          event={editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}

      {isCreating && (
        <CreateEventModal
          onSave={handleSaveNew}
          onClose={() => setIsCreating(false)}
        />
      )}

      {selectedEventHistory && (
        <Modal onClose={() => setSelectedEventHistory(null)}>
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">
              {events.find((e) => e.id === selectedEventHistory)?.title ||
                "Event"}{" "}
              History
            </h2>

            {eventHistory.length === 0 ? (
              <p className="text-gray-400">
                No history available for this event.
              </p>
            ) : (
              <div className="space-y-3">
                {eventHistory.map((record, index) => {
                  const event = events.find((e) => e.id === record.eventId);
                  const actionLabels = {
                    approve: "Approved",
                    reject: "Rejected",
                    update: "Updated",
                    delete: "Deleted",
                  };

                  return (
                    <div key={index} className="bg-gray-800 p-3 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white font-medium">
                            <span className="font-bold">
                              {actionLabels[record.action]}
                            </span>{" "}
                            {event?.title || record.previousState.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(record.timestamp).toLocaleString()}
                          </p>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-blue-600 text-white border-blue-500 hover:bg-blue-500"
                          onClick={() => handleUndo(record.eventId)}
                        >
                          Undo This Action
                        </Button>
                      </div>

                      {record.action === "update" && (
                        <div className="mt-2 text-sm">
                          <p className="text-gray-400">Changed from:</p>
                          <div className="bg-gray-900 p-2 rounded mt-1">
                            <p>Status: {record.previousState.status}</p>
                            <p>
                              Participants:{" "}
                              {record.previousState.participants.join(", ")}
                            </p>
                            <p>Time: {record.previousState.time}</p>
                            <p>
                              Date:{" "}
                              {format(record.previousState.date, "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                      )}
                      {record.action === "reject" && (
                        <div className="mt-2 text-sm">
                          <p className="text-gray-400">Rejection details:</p>
                          <div className="bg-gray-900 p-2 rounded mt-1">
                            <p>
                              Reason:{" "}
                              {record.previousState.rejectionReason ||
                                "No reason provided"}
                            </p>
                            <p>
                              Previous status: {record.previousState.status}
                            </p>
                          </div>
                        </div>
                      )}
                      {record.action === "approve" && (
                        <div className="mt-2 text-sm">
                          <p className="text-gray-400">Approval details:</p>
                          <div className="bg-gray-900 p-2 rounded mt-1">
                            <p>Changed from: {record.previousState.status}</p>
                            <p>
                              Requested by:{" "}
                              {record.previousState.createdBy || "Unknown"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end mt-4">
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
                  {format(date, "MMMM d, yyyy")}
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
                          const prevMonth = new Date(date);
                          prevMonth.setMonth(prevMonth.getMonth() - 1);
                          setDate(prevMonth);
                        }}
                      >
                        <ChevronLeft className="h-4 w-4 text-green-500" />
                      </Button>
                      <span className="text-white font-medium">
                        {format(date, "MMMM yyyy")}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-gray-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextMonth = new Date(date);
                          nextMonth.setMonth(nextMonth.getMonth() + 1);
                          setDate(nextMonth);
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
                              const [_, minutes, ampm] = time.split(/[:\s]/);
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
                              const [hours, _, ampm] = time.split(/[:\s]/);
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
                  {format(date, "MMMM d, yyyy")}
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
                          const prevMonth = new Date(date);
                          prevMonth.setMonth(prevMonth.getMonth() - 1);
                          setDate(prevMonth);
                        }}
                      >
                        <ChevronLeft className="h-4 w-4 text-green-500" />
                      </Button>
                      <span className="text-white font-medium">
                        {format(date, "MMMM yyyy")}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-gray-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextMonth = new Date(date);
                          nextMonth.setMonth(nextMonth.getMonth() + 1);
                          setDate(nextMonth);
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
                              const [_, minutes, ampm] = time.split(/[:\s]/);
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
                              const [hours, _, ampm] = time.split(/[:\s]/);
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
            Separate participants with commas (e.g., "Player A, Player B")
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
