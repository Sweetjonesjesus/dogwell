"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  Clock,
  Heart,
  Activity,
  Scale,
  ChevronRight,
  BarChart,
  BookOpen,
  Check,
  AlertTriangle,
} from "lucide-react"
import { format } from "date-fns"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock data
const DOG_PROFILE = {
  name: "Max",
  breed: "Golden Retriever",
  age: 3,
  weight: 32.5,
  lastCheckup: "2023-12-15",
  photo: "/placeholder.svg?height=100&width=100",
}

const HEALTH_SCORE = 87
const RECENT_WEIGHT = [32.1, 32.3, 32.5, 32.4, 32.5]
const TODAY_ACTIVITIES = [
  { id: "1", time: "08:00 AM", title: "Morning Walk", completed: true, icon: "walk", category: "exercise" },
  { id: "2", time: "12:00 PM", title: "Lunch", completed: true, icon: "food-variant", category: "feeding" },
  { id: "3", time: "03:00 PM", title: "Medication", completed: false, icon: "pill", category: "medication" },
  { id: "4", time: "06:00 PM", title: "Evening Walk", completed: false, icon: "walk", category: "exercise" },
]

export default function Dashboard() {
  const router = useRouter()
  const [profile, setProfile] = useState(DOG_PROFILE)
  const [healthScore, setHealthScore] = useState(HEALTH_SCORE)
  const [recentWeight, setRecentWeight] = useState(RECENT_WEIGHT)
  const [todayActivities, setTodayActivities] = useState(TODAY_ACTIVITIES)
  const [isLoading, setIsLoading] = useState(true)
  const [healthAlerts, setHealthAlerts] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, fetch data from APIs
        // const profileData = await profileApi.getProfile()
        // const healthData = await healthApi.getRecords()
        // const reminderData = await reminderApi.getReminders()

        // For now, use mock data
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const toggleActivityCompletion = (id: string) => {
    setTodayActivities((prev) =>
      prev.map((activity) => (activity.id === id ? { ...activity, completed: !activity.completed } : activity)),
    )
  }

  // Get activity icon
  const getActivityIcon = (icon: string) => {
    switch (icon) {
      case "walk":
        return <Activity className="h-5 w-5" />
      case "food-variant":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        )
      case "pill":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        )
      default:
        return <Activity className="h-5 w-5" />
    }
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "exercise":
        return "bg-purple-100 text-purple-800"
      case "feeding":
        return "bg-green-100 text-green-800"
      case "medication":
        return "bg-red-100 text-red-800"
      case "grooming":
        return "bg-amber-100 text-amber-800"
      case "vet":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Prepare chart data
  const weightData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        data: recentWeight,
      },
    ],
  }

  const chartData = recentWeight.map((weight, index) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri"][index],
    weight,
  }))

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mb-4"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {healthAlerts.length > 0 && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-center">
            <div className="mr-4 bg-amber-100 p-2 rounded-full">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Health Alerts</h3>
              <p className="text-sm">{healthAlerts[0]}</p>
            </div>
            {healthAlerts.length > 1 && (
              <Badge variant="outline" className="ml-2">
                +{healthAlerts.length - 1} more
              </Badge>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.photo} alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <p className="text-muted-foreground">
                {profile.breed}, {profile.age} years old
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                <Badge variant="outline" className="flex items-center">
                  <Scale className="h-3 w-3 mr-1" />
                  {profile.weight} kg
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Last checkup: {format(new Date(profile.lastCheckup), "MMM d, yyyy")}
                </Badge>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{healthScore}</span>
                </div>
                <svg className="w-20 h-20" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E0E0E0"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#6200EA"
                    strokeWidth="2"
                    strokeDasharray={`${healthScore}, 100`}
                  />
                </svg>
              </div>
              <span className="text-sm font-medium mt-1">Health Score</span>
              <Button variant="link" size="sm" className="text-xs" onClick={() => router.push("/analyzer")}>
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>{format(new Date(), "EEEE, MMMM d")}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => router.push("/schedule")}>
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {todayActivities.length > 0 ? (
              <div className="space-y-4">
                {todayActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center">
                    <div className="w-16 text-sm text-muted-foreground">{activity.time}</div>
                    <div
                      className={`flex-1 flex items-center p-3 rounded-lg ${
                        activity.completed ? "bg-gray-50" : "bg-white border"
                      }`}
                    >
                      <button
                        onClick={() => toggleActivityCompletion(activity.id)}
                        className={`flex-shrink-0 h-6 w-6 rounded-full border flex items-center justify-center mr-3 ${
                          activity.completed
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {activity.completed && <Check className="h-4 w-4" />}
                      </button>

                      <div className="flex items-center flex-1">
                        <div className={`p-2 rounded-full mr-3 ${getCategoryColor(activity.category)}`}>
                          {getActivityIcon(activity.icon)}
                        </div>
                        <span className={activity.completed ? "line-through text-gray-500" : ""}>{activity.title}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No activities scheduled for today</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/schedule/add-reminder")}>
              Add New Reminder
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Recent Weight</CardTitle>
              <CardDescription>Last 5 measurements</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => router.push("/health")}>
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[Math.min(...recentWeight) - 1, Math.max(...recentWeight) + 1]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" stroke="#6200EA" activeDot={{ r: 8 }} name="Weight (kg)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/health/add-record")}>
              Add New Measurement
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-4 gap-2"
              onClick={() => router.push("/health/add-record")}
            >
              <Heart className="h-6 w-6 text-red-500" />
              <span>Add Health Record</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-4 gap-2"
              onClick={() => router.push("/schedule/add-reminder")}
            >
              <Clock className="h-6 w-6 text-purple-500" />
              <span>Add Reminder</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-4 gap-2"
              onClick={() => router.push("/coach")}
            >
              <BookOpen className="h-6 w-6 text-green-500" />
              <span>Training Tips</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-4 gap-2"
              onClick={() => router.push("/analyzer")}
            >
              <BarChart className="h-6 w-6 text-blue-500" />
              <span>Health Analysis</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Learning Recommendations</CardTitle>
            <CardDescription>Personalized content for your dog</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.push("/coach")}>
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <div className="flex h-full">
                <div className="w-1/3">
                  <img
                    src="/placeholder.svg?height=150&width=150"
                    alt="Training Tips"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="w-2/3 p-4">
                  <Badge className="mb-2">Training</Badge>
                  <h3 className="font-medium">Essential Training for Golden Retrievers</h3>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>15 min</span>
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2 w-full">
                    Start Learning
                  </Button>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex h-full">
                <div className="w-1/3">
                  <img
                    src="/placeholder.svg?height=150&width=150"
                    alt="Nutrition Guide"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="w-2/3 p-4">
                  <Badge className="mb-2">Nutrition</Badge>
                  <h3 className="font-medium">Nutrition Basics for Adult Dogs</h3>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>5 min read</span>
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2 w-full">
                    Read Article
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

