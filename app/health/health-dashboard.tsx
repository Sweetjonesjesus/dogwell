"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, AlertTriangle, TrendingUp, TrendingDown, Minus, Calendar, Filter } from "lucide-react"
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
  BarChart,
  Bar,
} from "recharts"

// Define types for health records
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

export default function HealthDashboard() {
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

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Health Dashboard</h1>
        <Button onClick={() => router.push("/health/add-record")}>Add Record</Button>
      </div>

      <div className="flex justify-between items-center">
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
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Weight</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{weightStats.current} kg</div>
                <div className="flex items-center mt-1">
                  {weightStats.trend === "increasing" ? (
                    <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                  ) : weightStats.trend === "decreasing" ? (
                    <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <Minus className="h-4 w-4 text-gray-500 mr-1" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {weightStats.change} kg {weightStats.trend}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Temperature</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{temperatureStats.current} °C</div>
                <div className="flex items-center mt-1">
                  {temperatureStats.trend === "increasing" ? (
                    <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                  ) : temperatureStats.trend === "decreasing" ? (
                    <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <Minus className="h-4 w-4 text-gray-500 mr-1" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {temperatureStats.change} °C {temperatureStats.trend}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{heartRateStats.current || "N/A"} bpm</div>
                <div className="flex items-center mt-1">
                  {heartRateStats.trend === "increasing" ? (
                    <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                  ) : heartRateStats.trend === "decreasing" ? (
                    <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <Minus className="h-4 w-4 text-gray-500 mr-1" />
                  )}
                  <span className="text-sm text-muted-foreground">
                    {heartRateStats.change} bpm {heartRateStats.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Health Metrics</CardTitle>
                <CardDescription>Track your dog's vital signs over time</CardDescription>
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
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Common Symptoms</CardTitle>
                <CardDescription>Most frequently reported symptoms</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                {symptomData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={symptomData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="symptom" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="count" fill width={100} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#6200EA" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <InfoIcon className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No symptom data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next Checkup</CardTitle>
                <CardDescription>Upcoming veterinary appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Calendar className="h-10 w-10 text-purple-700 mr-4" />
                  <div>
                    <p className="font-medium">Regular Checkup</p>
                    <p className="text-sm text-muted-foreground">June 15, 2023 at 10:00 AM</p>
                    <p className="text-sm text-muted-foreground">Dr. Sarah Johnson</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Appointments
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Health Trends Analysis</CardTitle>
              <CardDescription>Long-term patterns in your dog's health data</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" stroke="#6200EA" />
                  <YAxis yAxisId="right" orientation="right" stroke="#FF5252" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="weight"
                    stroke="#6200EA"
                    activeDot={{ r: 8 }}
                    name="Weight (kg)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="temperature"
                    stroke="#FF5252"
                    activeDot={{ r: 8 }}
                    name="Temperature (°C)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                <InfoIcon className="h-4 w-4 inline mr-1" />
                This chart shows the correlation between weight and temperature over time.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="records">
          <Card>
            <CardHeader>
              <CardTitle>Health Records</CardTitle>
              <CardDescription>Complete history of health measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <Card key={record.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="p-4 md:w-1/4 bg-muted">
                          <p className="font-medium">{format(new Date(record.date), "MMMM d, yyyy")}</p>
                          <p className="text-sm text-muted-foreground">{format(new Date(record.date), "h:mm a")}</p>
                        </div>
                        <div className="p-4 md:w-3/4">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Weight</p>
                              <p className="font-medium">{record.weight} kg</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Temperature</p>
                              <p className="font-medium">{record.temperature} °C</p>
                            </div>
                            {record.heartRate && (
                              <div>
                                <p className="text-sm text-muted-foreground">Heart Rate</p>
                                <p className="font-medium">{record.heartRate} bpm</p>
                              </div>
                            )}
                          </div>

                          {record.symptoms && record.symptoms.length > 0 && (
                            <div className="mb-2">
                              <p className="text-sm text-muted-foreground">Symptoms</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {record.symptoms.map((symptom) => (
                                  <Badge key={symptom} variant="outline">
                                    {symptom}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {record.notes && (
                            <div>
                              <p className="text-sm text-muted-foreground">Notes</p>
                              <p className="text-sm">{record.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No health records found for this time period.</p>
                    <Button variant="outline" className="mt-4" onClick={() => router.push("/health/add-record")}>
                      Add Your First Record
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Export Health Records
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

