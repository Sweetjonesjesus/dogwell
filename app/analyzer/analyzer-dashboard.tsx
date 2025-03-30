"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Heart,
  Scale,
  Moon,
  Info,
  ArrowRight,
  Zap,
  FileText,
  Download,
} from "lucide-react"
import { format, subDays, subMonths } from "date-fns"
import { healthApi } from "@/lib/api-client"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

// Define types
interface HealthRecord {
  id: string
  date: string
  weight: number
  temperature: number
  heartRate?: number
  symptoms: string[]
  behavior?: string
  appetite?: string
  sleepQuality?: string
  medicationTaken?: boolean
  medicationDetails?: string
  photo?: string | null
  notes?: string
}

// Mock data for health score
const HEALTH_SCORE = {
  overall: 87,
  activity: 85,
  nutrition: 90,
  weight: 80,
  sleep: 92,
}

// Mock data for recommendations
const RECOMMENDATIONS = [
  {
    id: "1",
    title: "Increase Daily Exercise",
    description: "Add an extra 10-15 minutes of play or walking time to Max's daily routine.",
    icon: "activity",
    category: "activity",
    priority: "medium",
  },
  {
    id: "2",
    title: "Dental Check-up",
    description: "Schedule a dental cleaning in the next month to maintain oral health.",
    icon: "tooth",
    category: "health",
    priority: "high",
  },
  {
    id: "3",
    title: "Adjust Food Portions",
    description: "Consider reducing daily food intake by 5% to maintain ideal weight.",
    icon: "utensils",
    category: "nutrition",
    priority: "low",
  },
]

// Mock data for insights
const INSIGHTS = [
  {
    id: "1",
    title: "Activity Pattern",
    description: "Max is most active in the mornings between 7-9 AM.",
    icon: "chart-timeline-variant",
  },
  {
    id: "2",
    title: "Sleep Quality",
    description: "Sleep quality has improved by 15% in the last month.",
    icon: "sleep",
  },
]

// Colors for charts
const COLORS = {
  activity: "#FF5252",
  nutrition: "#00796B",
  weight: "#FFC107",
  sleep: "#6200EA",
}

export default function AnalyzerDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("1m")
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState("weight")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await healthApi.getRecords()
        setHealthRecords(data.records || [])
      } catch (error) {
        console.error("Failed to fetch health data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter records based on time range
  const getFilteredRecords = () => {
    const now = new Date()
    let cutoffDate: Date

    switch (timeRange) {
      case "1w":
        cutoffDate = subDays(now, 7)
        break
      case "1m":
        cutoffDate = subMonths(now, 1)
        break
      case "3m":
        cutoffDate = subMonths(now, 3)
        break
      case "1y":
        cutoffDate = subMonths(now, 12)
        break
      default:
        cutoffDate = subMonths(now, 1)
    }

    return healthRecords.filter((record) => new Date(record.date) >= cutoffDate)
  }

  const filteredRecords = getFilteredRecords()

  // Prepare chart data
  const chartData = filteredRecords
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((record) => ({
      date: format(new Date(record.date), "MMM dd"),
      weight: record.weight,
      temperature: record.temperature,
      heartRate: record.heartRate || null,
    }))

  // Calculate statistics
  const calculateStats = (metric: string) => {
    if (filteredRecords.length === 0) return { current: 0, average: 0, change: 0, trend: "stable" }

    const values = filteredRecords.map((record) => record[metric as keyof HealthRecord] as number)
    const current = values[0] || 0
    const average = values.reduce((sum, val) => sum + (val || 0), 0) / values.length

    let change = 0
    let trend = "stable"

    if (values.length > 1) {
      change = current - (values[1] || 0)
      if (change > 0.5) trend = "increasing"
      else if (change < -0.5) trend = "decreasing"
    }

    return { current, average: average.toFixed(1), change: Math.abs(change).toFixed(1), trend }
  }

  const weightStats = calculateStats("weight")
  const temperatureStats = calculateStats("temperature")
  const heartRateStats = calculateStats("heartRate")

  // Check for anomalies
  const hasAnomalies = filteredRecords.some((record) => {
    return (
      record.temperature > 39.5 ||
      record.temperature < 37.5 ||
      (record.heartRate && (record.heartRate > 140 || record.heartRate < 60))
    )
  })

  // Count symptoms
  const symptomCounts: Record<string, number> = {}
  filteredRecords.forEach((record) => {
    record.symptoms?.forEach((symptom) => {
      symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1
    })
  })

  const symptomData = Object.entries(symptomCounts)
    .map(([symptom, count]) => ({ symptom, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Prepare data for radar chart
  const radarData = [
    {
      subject: "Activity",
      score: HEALTH_SCORE.activity,
      fullMark: 100,
    },
    {
      subject: "Nutrition",
      score: HEALTH_SCORE.nutrition,
      fullMark: 100,
    },
    {
      subject: "Weight",
      score: HEALTH_SCORE.weight,
      fullMark: 100,
    },
    {
      subject: "Sleep",
      score: HEALTH_SCORE.sleep,
      fullMark: 100,
    },
  ]

  // Prepare data for pie chart
  const pieData = [
    { name: "Activity", value: HEALTH_SCORE.activity, color: COLORS.activity },
    { name: "Nutrition", value: HEALTH_SCORE.nutrition, color: COLORS.nutrition },
    { name: "Weight", value: HEALTH_SCORE.weight, color: COLORS.weight },
    { name: "Sleep", value: HEALTH_SCORE.sleep, color: COLORS.sleep },
  ]

  // Get icon for recommendation
  const getRecommendationIcon = (icon: string) => {
    switch (icon) {
      case "activity":
        return <Activity className="h-5 w-5" />
      case "tooth":
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
        )
      case "utensils":
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
      default:
        return <Info className="h-5 w-5" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mb-4"></div>
          <p>Loading health data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {hasAnomalies && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Health Anomalies Detected</AlertTitle>
          <AlertDescription>
            Some health metrics are outside normal ranges. Consider consulting your veterinarian.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Health Analyzer</h1>
          <p className="text-muted-foreground">AI-powered insights and recommendations for your dog's health</p>
        </div>
        <div className="flex space-x-2">
          <Badge
            variant={timeRange === "1w" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setTimeRange("1w")}
          >
            1 Week
          </Badge>
          <Badge
            variant={timeRange === "1m" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setTimeRange("1m")}
          >
            1 Month
          </Badge>
          <Badge
            variant={timeRange === "3m" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setTimeRange("3m")}
          >
            3 Months
          </Badge>
          <Badge
            variant={timeRange === "1y" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setTimeRange("1y")}
          >
            1 Year
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Health Score</CardTitle>
                <CardDescription>Comprehensive analysis of your dog's overall health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative w-40 h-40">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl font-bold">{HEALTH_SCORE.overall}</div>
                    </div>
                    <PieChart width={160} height={160}>
                      <Pie
                        data={pieData}
                        cx={80}
                        cy={80}
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-[#FF5252] mr-2" />
                          <span>Activity</span>
                        </div>
                        <span className="font-medium">{HEALTH_SCORE.activity}/100</span>
                      </div>
                      <Progress value={HEALTH_SCORE.activity} className="h-2" indicatorColor="bg-[#FF5252]" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-[#00796B] mr-2" />
                          <span>Nutrition</span>
                        </div>
                        <span className="font-medium">{HEALTH_SCORE.nutrition}/100</span>
                      </div>
                      <Progress value={HEALTH_SCORE.nutrition} className="h-2" indicatorColor="bg-[#00796B]" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-[#FFC107] mr-2" />
                          <span>Weight</span>
                        </div>
                        <span className="font-medium">{HEALTH_SCORE.weight}/100</span>
                      </div>
                      <Progress value={HEALTH_SCORE.weight} className="h-2" indicatorColor="bg-[#FFC107]" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-[#6200EA] mr-2" />
                          <span>Sleep</span>
                        </div>
                        <span className="font-medium">{HEALTH_SCORE.sleep}/100</span>
                      </div>
                      <Progress value={HEALTH_SCORE.sleep} className="h-2" indicatorColor="bg-[#6200EA]" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vital Signs</CardTitle>
                <CardDescription>Key health metrics and their trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-3 rounded-full mr-4">
                      <Scale className="h-6 w-6 text-purple-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium">Weight</h3>
                        <div className="text-2xl font-bold">{weightStats.current} kg</div>
                      </div>
                      <div className="flex items-center mt-1">
                        {weightStats.trend === "increasing" ? (
                          <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                        ) : weightStats.trend === "decreasing" ? (
                          <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <span className="h-4 w-4 mr-1">—</span>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {weightStats.change} kg {weightStats.trend}
                        </span>
                      </div>
                      <Progress value={HEALTH_SCORE.weight} className="h-1 mt-2" />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center">
                    <div className="bg-red-100 p-3 rounded-full mr-4">
                      <Activity className="h-6 w-6 text-red-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium">Temperature</h3>
                        <div className="text-2xl font-bold">{temperatureStats.current} °C</div>
                      </div>
                      <div className="flex items-center mt-1">
                        {temperatureStats.trend === "increasing" ? (
                          <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                        ) : temperatureStats.trend === "decreasing" ? (
                          <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <span className="h-4 w-4 mr-1">—</span>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {temperatureStats.change} °C {temperatureStats.trend}
                        </span>
                      </div>
                      <Progress value={80} className="h-1 mt-2" />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center">
                    <div className="bg-pink-100 p-3 rounded-full mr-4">
                      <Heart className="h-6 w-6 text-pink-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium">Heart Rate</h3>
                        <div className="text-2xl font-bold">{heartRateStats.current || "N/A"} bpm</div>
                      </div>
                      <div className="flex items-center mt-1">
                        {heartRateStats.trend === "increasing" ? (
                          <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                        ) : heartRateStats.trend === "decreasing" ? (
                          <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <span className="h-4 w-4 mr-1">—</span>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {heartRateStats.change} bpm {heartRateStats.trend}
                        </span>
                      </div>
                      <Progress value={75} className="h-1 mt-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Health Patterns</CardTitle>
                <CardDescription>Visualized health data analysis</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Health Score" dataKey="score" stroke="#6200EA" fill="#6200EA" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Health Trends</CardTitle>
                <CardDescription>Long-term patterns in your dog's health data</CardDescription>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight">Weight</SelectItem>
                    <SelectItem value="temperature">Temperature</SelectItem>
                    <SelectItem value="heartRate">Heart Rate</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {selectedMetric === "weight" && (
                      <Line type="monotone" dataKey="weight" stroke="#6200EA" activeDot={{ r: 8 }} name="Weight (kg)" />
                    )}
                    {selectedMetric === "temperature" && (
                      <Line
                        type="monotone"
                        dataKey="temperature"
                        stroke="#FF5252"
                        activeDot={{ r: 8 }}
                        name="Temperature (°C)"
                      />
                    )}
                    {selectedMetric === "heartRate" && (
                      <Line
                        type="monotone"
                        dataKey="heartRate"
                        stroke="#00796B"
                        activeDot={{ r: 8 }}
                        name="Heart Rate (bpm)"
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  <Info className="h-4 w-4 inline mr-1" />
                  This chart shows the trend of {selectedMetric} over time.
                </p>
              </CardFooter>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>AI-generated observations based on your dog's health data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start p-4 rounded-lg border bg-card">
                    <div className="bg-purple-100 p-2 rounded-full mr-4">
                      <Zap className="h-5 w-5 text-purple-700" />
                    </div>
                    <div>
                      <h3 className="font-medium">Weight is stable and healthy</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your dog's weight has remained within the ideal range for their breed and age over the past{" "}
                        {timeRange === "1w"
                          ? "week"
                          : timeRange === "1m"
                            ? "month"
                            : timeRange === "3m"
                              ? "3 months"
                              : "year"}
                        .
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start p-4 rounded-lg border bg-card">
                    <div className="bg-green-100 p-2 rounded-full mr-4">
                      <Activity className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <h3 className="font-medium">Activity level is improving</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        There's a 15% increase in activity levels compared to the previous period, indicating improved
                        fitness.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start p-4 rounded-lg border bg-card">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <Moon className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-medium">Sleep patterns are consistent</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your dog is maintaining regular sleep patterns, which is beneficial for overall health and
                        behavior.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  View Full Analysis Report
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Symptom Frequency</CardTitle>
                <CardDescription>Most commonly reported symptoms</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {symptomData.length > 0 ? (
                  <div className="space-y-4">
                    {symptomData.map((item) => (
                      <div key={item.symptom} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">{item.symptom}</span>
                          <span className="text-sm font-medium">{item.count} times</span>
                        </div>
                        <Progress value={(item.count / symptomData[0].count) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Info className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No symptom data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Personalized Recommendations</CardTitle>
                <CardDescription>AI-generated suggestions based on your dog's health data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {RECOMMENDATIONS.map((recommendation) => (
                    <Card key={recommendation.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <div
                            className={`p-3 rounded-full mr-4 ${
                              recommendation.category === "activity"
                                ? "bg-red-100"
                                : recommendation.category === "nutrition"
                                  ? "bg-green-100"
                                  : "bg-blue-100"
                            }`}
                          >
                            {getRecommendationIcon(recommendation.icon)}
                          </div>
                          <div>
                            <Badge
                              className={`mb-2 ${
                                recommendation.priority === "high"
                                  ? "bg-red-100 text-red-800 hover:bg-red-200"
                                  : recommendation.priority === "medium"
                                    ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                    : "bg-green-100 text-green-800 hover:bg-green-200"
                              }`}
                            >
                              {recommendation.priority.charAt(0).toUpperCase() + recommendation.priority.slice(1)}{" "}
                              Priority
                            </Badge>
                            <h3 className="font-medium">{recommendation.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{recommendation.description}</p>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full mt-4">
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Learn More
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Generate Custom Health Plan</Button>
              </CardFooter>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Breed-Specific Health Insights</CardTitle>
                <CardDescription>Health information tailored to your Golden Retriever</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border bg-card">
                    <h3 className="font-medium mb-2">Common Health Concerns</h3>
                    <p className="text-sm text-muted-foreground">
                      Golden Retrievers are predisposed to certain health conditions including hip dysplasia, heart
                      problems, and certain cancers. Regular check-ups and early detection are key to managing these
                      risks.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border bg-card">
                    <h3 className="font-medium mb-2">Ideal Weight Range</h3>
                    <p className="text-sm text-muted-foreground">
                      For a 3-year-old male Golden Retriever, the healthy weight range is typically between 29-34 kg.
                      Your dog's current weight of 32.5 kg is within the ideal range.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border bg-card">
                    <h3 className="font-medium mb-2">Exercise Requirements</h3>
                    <p className="text-sm text-muted-foreground">
                      Golden Retrievers are energetic dogs that require at least 1-2 hours of exercise daily. This
                      should include walks, play sessions, and mental stimulation activities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Health Reports</CardTitle>
                <CardDescription>Download and share health data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Health Summary (PDF)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Complete Health Records (CSV)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Vet Report (PDF)
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">
                  These reports can be shared with your veterinarian during appointments.
                </p>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

