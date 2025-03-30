"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, Clock, Plus, Check, Edit, Trash2, MoreVertical, ChevronRight, ChevronLeft } from "lucide-react"
import { format, addDays, isSameDay, parseISO, isToday, isTomorrow, addWeeks } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Define types
interface Reminder {
  id: string
  title: string
  time: string
  days: string[]
  category: string
  enabled: boolean
  completed?: boolean
  date?: string // For one-time reminders
  notes?: string
  priority?: "low" | "medium" | "high"
}

// Mock data
const REMINDERS: Reminder[] = [
  {
    id: "1",
    title: "Morning Walk",
    time: "07:30",
    days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
    category: "exercise",
    enabled: true,
    completed: true,
    priority: "medium",
  },
  {
    id: "2",
    title: "Breakfast",
    time: "08:00",
    days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
    category: "feeding",
    enabled: true,
    completed: true,
    priority: "high",
  },
  {
    id: "3",
    title: "Medication",
    time: "09:00",
    days: ["mon", "tue", "wed", "thu", "fri"],
    category: "medication",
    enabled: true,
    completed: false,
    priority: "high",
  },
  {
    id: "4",
    title: "Lunch",
    time: "12:00",
    days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
    category: "feeding",
    enabled: true,
    completed: false,
    priority: "high",
  },
  {
    id: "5",
    title: "Afternoon Walk",
    time: "15:00",
    days: ["mon", "tue", "wed", "thu", "fri"],
    category: "exercise",
    enabled: true,
    completed: false,
    priority: "medium",
  },
  {
    id: "6",
    title: "Vet Appointment",
    time: "14:30",
    days: [],
    category: "vet",
    enabled: true,
    date: "2023-06-15",
    notes: "Annual checkup and vaccinations",
    priority: "high",
  },
]

const DAYS_OF_WEEK = [
  { value: "mon", label: "Monday", short: "M" },
  { value: "tue", label: "Tuesday", short: "T" },
  { value: "wed", label: "Wednesday", short: "W" },
  { value: "thu", label: "Thursday", short: "T" },
  { value: "fri", label: "Friday", short: "F" },
  { value: "sat", label: "Saturday", short: "S" },
  { value: "sun", label: "Sunday", short: "S" },
]

const CATEGORIES = [
  { value: "feeding", label: "Feeding", icon: "🍽️" },
  { value: "medication", label: "Medication", icon: "💊" },
  { value: "exercise", label: "Exercise", icon: "🚶" },
  { value: "grooming", label: "Grooming", icon: "✂️" },
  { value: "vet", label: "Veterinary", icon: "🏥" },
  { value: "training", label: "Training", icon: "🎓" },
  { value: "other", label: "Other", icon: "📝" },
]

// Get priority badge color
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 hover:bg-red-200"
    case "medium":
      return "bg-amber-100 text-amber-800 hover:bg-amber-200"
    case "low":
      return "bg-green-100 text-green-800 hover:bg-green-200"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }
}

export default function SchedulerDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("today")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [reminders, setReminders] = useState<Reminder[]>(REMINDERS)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // New reminder form state
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    title: "",
    time: "08:00",
    days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
    category: "feeding",
    enabled: true,
    priority: "medium",
    notes: "",
  })
  const [isRecurring, setIsRecurring] = useState(true)

  useEffect(() => {
    // In a real app, fetch reminders from API
    // For now, we'll use the mock data
  }, [])

  const handleAddReminder = async () => {
    setIsLoading(true)

    try {
      const newReminderData: Reminder = {
        id: Date.now().toString(),
        title: newReminder.title || "",
        time: newReminder.time || "08:00",
        days: isRecurring ? newReminder.days || [] : [],
        category: newReminder.category || "other",
        enabled: true,
        priority: (newReminder.priority as "low" | "medium" | "high") || "medium",
        notes: newReminder.notes,
      }

      if (!isRecurring && selectedDate) {
        newReminderData.date = format(selectedDate, "yyyy-MM-dd")
      }

      // In a real app, save to API
      // await reminderApi.addReminder(newReminderData)

      // Update local state
      setReminders((prev) => [newReminderData, ...prev])

      // Reset form
      setNewReminder({
        title: "",
        time: "08:00",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        category: "feeding",
        enabled: true,
        priority: "medium",
        notes: "",
      })
      setIsRecurring(true)
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Failed to add reminder:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleReminderCompletion = (id: string) => {
    setReminders((prev) =>
      prev.map((reminder) => (reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder)),
    )
  }

  const toggleReminderEnabled = (id: string) => {
    setReminders((prev) =>
      prev.map((reminder) => (reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder)),
    )
  }

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((reminder) => reminder.id !== id))
  }

  const toggleDay = (day: string) => {
    setNewReminder((prev) => {
      const days = prev.days || []
      return {
        ...prev,
        days: days.includes(day) ? days.filter((d) => d !== day) : [...days, day],
      }
    })
  }

  // Filter reminders based on selected tab/date
  const getFilteredReminders = () => {
    if (activeTab === "today") {
      return reminders.filter(
        (reminder) =>
          (reminder.days && reminder.days.includes(getDayOfWeek(new Date()))) ||
          (reminder.date && isToday(parseISO(reminder.date))),
      )
    } else if (activeTab === "tomorrow") {
      const tomorrow = addDays(new Date(), 1)
      return reminders.filter(
        (reminder) =>
          (reminder.days && reminder.days.includes(getDayOfWeek(tomorrow))) ||
          (reminder.date && isTomorrow(parseISO(reminder.date))),
      )
    } else if (activeTab === "upcoming") {
      const nextWeek = addWeeks(new Date(), 1)
      return reminders.filter(
        (reminder) =>
          reminder.date &&
          new Date(reminder.date) <= nextWeek &&
          !isToday(parseISO(reminder.date)) &&
          !isTomorrow(parseISO(reminder.date)),
      )
    } else if (activeTab === "calendar") {
      return reminders.filter(
        (reminder) =>
          (reminder.days && reminder.days.includes(getDayOfWeek(selectedDate))) ||
          (reminder.date && isSameDay(parseISO(reminder.date), selectedDate)),
      )
    }
    return reminders
  }

  // Helper to get day of week string
  const getDayOfWeek = (date: Date): string => {
    const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
    return days[date.getDay()]
  }

  // Group reminders by time
  const groupRemindersByTime = (reminders: Reminder[]) => {
    const grouped: Record<string, Reminder[]> = {}

    reminders.forEach((reminder) => {
      const timeKey = reminder.time
      if (!grouped[timeKey]) {
        grouped[timeKey] = []
      }
      grouped[timeKey].push(reminder)
    })

    // Sort by time
    return Object.keys(grouped)
      .sort()
      .map((time) => ({
        time,
        reminders: grouped[time],
      }))
  }

  const filteredReminders = getFilteredReminders()
  const timeGroups = groupRemindersByTime(filteredReminders)

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const found = CATEGORIES.find((c) => c.value === category)
    return found ? found.icon : "📝"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Daily Schedule</h1>
          <p className="text-muted-foreground">Manage your dog's daily activities and reminders</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Reminder
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="pt-4">
          <Card>
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 p-4 border-r">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                  />
                </div>
                <div className="md:w-1/2 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h2>
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedDate((prev) => addDays(prev, -1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => setSelectedDate((prev) => addDays(prev, 1))}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {timeGroups.length > 0 ? (
                    <div className="space-y-4">
                      {timeGroups.map((group) => (
                        <div key={group.time}>
                          <div className="flex items-center mb-2">
                            <Badge variant="outline" className="mr-2">
                              {format(parseISO(`2023-01-01T${group.time}`), "h:mm a")}
                            </Badge>
                            <Separator className="flex-1" />
                          </div>
                          <div className="space-y-2">
                            {group.reminders.map((reminder) => (
                              <ReminderItem
                                key={reminder.id}
                                reminder={reminder}
                                onToggleComplete={toggleReminderCompletion}
                                onToggleEnabled={toggleReminderEnabled}
                                onDelete={deleteReminder}
                                getPriorityColor={getPriorityColor}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="font-medium text-lg">No reminders for this day</h3>
                      <p className="text-muted-foreground mb-4">
                        Add a reminder to get started with your dog's schedule
                      </p>
                      <Button onClick={() => setIsAddDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Reminder
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="today">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>{format(new Date(), "EEEE, MMMM d, yyyy")}</CardDescription>
            </CardHeader>
            <CardContent>
              {timeGroups.length > 0 ? (
                <div className="space-y-6">
                  {timeGroups.map((group) => (
                    <div key={group.time}>
                      <div className="flex items-center mb-2">
                        <Badge variant="outline" className="mr-2">
                          {format(parseISO(`2023-01-01T${group.time}`), "h:mm a")}
                        </Badge>
                        <Separator className="flex-1" />
                      </div>
                      <div className="space-y-2">
                        {group.reminders.map((reminder) => (
                          <ReminderItem
                            key={reminder.id}
                            reminder={reminder}
                            onToggleComplete={toggleReminderCompletion}
                            onToggleEnabled={toggleReminderEnabled}
                            onDelete={deleteReminder}
                            getPriorityColor={getPriorityColor}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg">No reminders for today</h3>
                  <p className="text-muted-foreground mb-4">Add a reminder to get started with your dog's schedule</p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Reminder
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tomorrow">
          <Card>
            <CardHeader>
              <CardTitle>Tomorrow's Schedule</CardTitle>
              <CardDescription>{format(addDays(new Date(), 1), "EEEE, MMMM d, yyyy")}</CardDescription>
            </CardHeader>
            <CardContent>
              {timeGroups.length > 0 ? (
                <div className="space-y-6">
                  {timeGroups.map((group) => (
                    <div key={group.time}>
                      <div className="flex items-center mb-2">
                        <Badge variant="outline" className="mr-2">
                          {format(parseISO(`2023-01-01T${group.time}`), "h:mm a")}
                        </Badge>
                        <Separator className="flex-1" />
                      </div>
                      <div className="space-y-2">
                        {group.reminders.map((reminder) => (
                          <ReminderItem
                            key={reminder.id}
                            reminder={reminder}
                            onToggleComplete={toggleReminderCompletion}
                            onToggleEnabled={toggleReminderEnabled}
                            onDelete={deleteReminder}
                            getPriorityColor={getPriorityColor}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg">No reminders for tomorrow</h3>
                  <p className="text-muted-foreground mb-4">Plan ahead by adding reminders for tomorrow</p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Reminder
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>One-time events and appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredReminders.length > 0 ? (
                <div className="space-y-4">
                  {filteredReminders
                    .sort((a, b) => {
                      if (!a.date || !b.date) return 0
                      return new Date(a.date).getTime() - new Date(b.date).getTime()
                    })
                    .map((reminder) => (
                      <Card key={reminder.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <div
                                className={`p-2 rounded-full ${reminder.category === "vet" ? "bg-blue-100" : "bg-purple-100"}`}
                              >
                                <span className="text-xl">{getCategoryIcon(reminder.category)}</span>
                              </div>
                              <div>
                                <h3 className="font-medium">{reminder.title}</h3>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <CalendarIcon className="h-3 w-3 mr-1" />
                                  <span>{format(parseISO(reminder.date!), "EEEE, MMMM d, yyyy")}</span>
                                  <Clock className="h-3 w-3 ml-2 mr-1" />
                                  <span>{format(parseISO(`2023-01-01T${reminder.time}`), "h:mm a")}</span>
                                </div>
                                {reminder.notes && <p className="text-sm mt-2">{reminder.notes}</p>}
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => toggleReminderEnabled(reminder.id)}>
                                  {reminder.enabled ? "Disable" : "Enable"}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => deleteReminder(reminder.id)}>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg">No upcoming events</h3>
                  <p className="text-muted-foreground mb-4">Add one-time events like vet appointments</p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Reminder</DialogTitle>
            <DialogDescription>Create a new reminder for your dog's schedule</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., Morning Walk"
                value={newReminder.title}
                onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newReminder.category}
                  onValueChange={(value) => setNewReminder({ ...newReminder, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <div className="flex items-center">
                          <span className="mr-2">{cat.icon}</span>
                          <span>{cat.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="recurring">Recurring Reminder</Label>
                <Switch id="recurring" checked={isRecurring} onCheckedChange={setIsRecurring} />
              </div>

              {isRecurring ? (
                <div className="pt-2">
                  <Label className="mb-2 block">Repeat on days</Label>
                  <div className="flex justify-between">
                    {DAYS_OF_WEEK.map((day) => (
                      <div key={day.value} className="flex flex-col items-center">
                        <button
                          type="button"
                          onClick={() => toggleDay(day.value)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            newReminder.days?.includes(day.value)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {day.short}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="pt-2">
                  <Label htmlFor="date" className="mb-2 block">
                    Date
                  </Label>
                  <div className="border rounded-md p-2">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={newReminder.priority}
                onValueChange={(value) =>
                  setNewReminder({ ...newReminder, priority: value as "low" | "medium" | "high" })
                }
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                placeholder="Additional details"
                value={newReminder.notes}
                onChange={(e) => setNewReminder({ ...newReminder, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddReminder} disabled={isLoading || !newReminder.title}>
              {isLoading ? "Adding..." : "Add Reminder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Reminder Item Component
function ReminderItem({
  reminder,
  onToggleComplete,
  onToggleEnabled,
  onDelete,
  getPriorityColor,
}: {
  reminder: Reminder
  onToggleComplete: (id: string) => void
  onToggleEnabled: (id: string) => void
  onDelete: (id: string) => void
  getPriorityColor: (priority: string) => string
}) {
  return (
    <div
      className={`flex items-center p-3 rounded-lg border ${
        !reminder.enabled ? "bg-gray-50 opacity-60" : reminder.completed ? "bg-gray-50" : "bg-white"
      }`}
    >
      <button
        onClick={() => onToggleComplete(reminder.id)}
        className={`flex-shrink-0 h-6 w-6 rounded-full border flex items-center justify-center mr-3 ${
          reminder.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-gray-400"
        }`}
      >
        {reminder.completed && <Check className="h-4 w-4" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <p className={`font-medium truncate ${reminder.completed ? "line-through text-gray-500" : ""}`}>
            {reminder.title}
          </p>
          {reminder.priority && (
            <Badge variant="outline" className={`ml-2 ${getPriorityColor(reminder.priority)}`}>
              {reminder.priority}
            </Badge>
          )}
        </div>

        {reminder.days && reminder.days.length > 0 && (
          <div className="flex mt-1 text-xs text-gray-500 space-x-1">
            {DAYS_OF_WEEK.map((day) => (
              <span
                key={day.value}
                className={`w-5 h-5 flex items-center justify-center rounded-full ${
                  reminder.days?.includes(day.value) ? "bg-purple-100 text-purple-800" : "text-gray-300"
                }`}
              >
                {day.short}
              </span>
            ))}
          </div>
        )}

        {reminder.date && (
          <p className="text-xs text-gray-500 mt-1">{format(parseISO(reminder.date), "MMM d, yyyy")}</p>
        )}
      </div>

      <div className="flex items-center ml-2">
        <Switch checked={reminder.enabled} onCheckedChange={() => onToggleEnabled(reminder.id)} className="mr-2" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(reminder.id)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

