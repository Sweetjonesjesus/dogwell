"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Camera, Upload, X } from "lucide-react"
import { healthApi } from "@/lib/api-client"
import { v4 as uuidv4 } from "uuid"

const SYMPTOM_OPTIONS = [
  { id: "coughing", label: "Coughing" },
  { id: "sneezing", label: "Sneezing" },
  { id: "lethargy", label: "Lethargy" },
  { id: "vomiting", label: "Vomiting" },
  { id: "diarrhea", label: "Diarrhea" },
  { id: "loss-appetite", label: "Loss of Appetite" },
  { id: "increased-thirst", label: "Increased Thirst" },
  { id: "itching", label: "Itching/Scratching" },
  { id: "limping", label: "Limping" },
]

const BEHAVIOR_OPTIONS = [
  { id: "normal", label: "Normal" },
  { id: "hyperactive", label: "Hyperactive" },
  { id: "lethargic", label: "Lethargic" },
  { id: "anxious", label: "Anxious" },
  { id: "aggressive", label: "Aggressive" },
  { id: "depressed", label: "Depressed" },
]

export default function AddHealthRecord() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("vitals")
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  // Form state
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5))
  const [weight, setWeight] = useState(32.5)
  const [temperature, setTemperature] = useState(38.2)
  const [heartRate, setHeartRate] = useState(80)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [customSymptom, setCustomSymptom] = useState("")
  const [behavior, setBehavior] = useState("normal")
  const [appetite, setAppetite] = useState("normal")
  const [sleepQuality, setSleepQuality] = useState("normal")
  const [medicationTaken, setMedicationTaken] = useState(false)
  const [medicationDetails, setMedicationDetails] = useState("")
  const [notes, setNotes] = useState("")

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId) ? prev.filter((id) => id !== symptomId) : [...prev, symptomId],
    )
  }

  const handleAddCustomSymptom = () => {
    if (customSymptom.trim()) {
      const newSymptomId = `custom-${uuidv4().slice(0, 8)}`
      setSelectedSymptoms((prev) => [...prev, newSymptomId])
      setCustomSymptom("")
      // In a real app, we would also add this to a custom symptoms list
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setPhotoPreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await healthApi.addRecord({
        id: uuidv4(),
        date: `${date}T${time}`,
        weight,
        temperature,
        heartRate,
        symptoms: selectedSymptoms,
        behavior,
        appetite,
        sleepQuality,
        medicationTaken,
        medicationDetails: medicationTaken ? medicationDetails : "",
        photo: photoPreview,
        notes,
      })

      // Navigate back to health tracker
      router.push("/health")
      router.refresh()
    } catch (error) {
      console.error("Failed to add health record:", error)
      // In a real app, show error message to user
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Health Record</CardTitle>
          <CardDescription>Record your dog's health metrics and observations</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="vitals">Vitals</TabsTrigger>
                <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
                <TabsTrigger value="behavior">Behavior</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>

              <TabsContent value="vitals" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <span className="text-sm font-medium">{weight.toFixed(1)} kg</span>
                  </div>
                  <Slider
                    id="weight"
                    min={1}
                    max={80}
                    step={0.1}
                    value={[weight]}
                    onValueChange={(values) => setWeight(values[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="temperature">Temperature (°C)</Label>
                    <span className="text-sm font-medium">{temperature.toFixed(1)} °C</span>
                  </div>
                  <Slider
                    id="temperature"
                    min={35}
                    max={42}
                    step={0.1}
                    value={[temperature]}
                    onValueChange={(values) => setTemperature(values[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                    <span className="text-sm font-medium">{heartRate} bpm</span>
                  </div>
                  <Slider
                    id="heartRate"
                    min={40}
                    max={180}
                    step={1}
                    value={[heartRate]}
                    onValueChange={(values) => setHeartRate(values[0])}
                  />
                </div>
              </TabsContent>

              <TabsContent value="symptoms" className="space-y-4">
                <div className="space-y-2">
                  <Label>Symptoms (select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {SYMPTOM_OPTIONS.map((symptom) => (
                      <div key={symptom.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={symptom.id}
                          checked={selectedSymptoms.includes(symptom.id)}
                          onCheckedChange={() => handleSymptomToggle(symptom.id)}
                        />
                        <Label htmlFor={symptom.id} className="text-sm">
                          {symptom.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Input
                    placeholder="Add custom symptom"
                    value={customSymptom}
                    onChange={(e) => setCustomSymptom(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCustomSymptom}
                    disabled={!customSymptom.trim()}
                  >
                    Add
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicationTaken">Medication Taken</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="medicationTaken" checked={medicationTaken} onCheckedChange={setMedicationTaken} />
                    <Label htmlFor="medicationTaken">{medicationTaken ? "Yes" : "No"}</Label>
                  </div>
                </div>

                {medicationTaken && (
                  <div className="space-y-2">
                    <Label htmlFor="medicationDetails">Medication Details</Label>
                    <Textarea
                      id="medicationDetails"
                      placeholder="Name, dosage, etc."
                      value={medicationDetails}
                      onChange={(e) => setMedicationDetails(e.target.value)}
                      rows={2}
                    />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="behavior" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="behavior">Overall Behavior</Label>
                  <Select value={behavior} onValueChange={setBehavior}>
                    <SelectTrigger id="behavior">
                      <SelectValue placeholder="Select behavior" />
                    </SelectTrigger>
                    <SelectContent>
                      {BEHAVIOR_OPTIONS.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appetite">Appetite</Label>
                  <Select value={appetite} onValueChange={setAppetite}>
                    <SelectTrigger id="appetite">
                      <SelectValue placeholder="Select appetite" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="increased">Increased</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="decreased">Decreased</SelectItem>
                      <SelectItem value="none">Not eating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sleepQuality">Sleep Quality</Label>
                  <Select value={sleepQuality} onValueChange={setSleepQuality}>
                    <SelectTrigger id="sleepQuality">
                      <SelectValue placeholder="Select sleep quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="restless">Restless</SelectItem>
                      <SelectItem value="insomnia">Difficulty sleeping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="other" className="space-y-4">
                <div className="space-y-2">
                  <Label>Photo Documentation</Label>
                  <div className="flex flex-col items-center space-y-2">
                    {photoPreview ? (
                      <div className="relative">
                        <img
                          src={photoPreview || "/placeholder.svg"}
                          alt="Health documentation"
                          className="w-full max-w-xs h-auto rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full"
                          onClick={removePhoto}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="flex items-center"
                            onClick={() => document.getElementById("photo-upload")?.click()}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Photo
                          </Button>
                          <Button type="button" variant="outline" className="flex items-center">
                            <Camera className="mr-2 h-4 w-4" />
                            Take Photo
                          </Button>
                        </div>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional observations or vet recommendations"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Record"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

