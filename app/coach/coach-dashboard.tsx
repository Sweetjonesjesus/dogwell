"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Search, BookOpen, Video, CheckSquare, Award, Bookmark, Play, Clock, ChevronRight } from "lucide-react"

// Mock data for coach content
const FEATURED_CONTENT = {
  id: "featured1",
  title: "Essential Training for Golden Retrievers",
  description: "Learn the most effective training techniques specifically designed for Golden Retrievers.",
  image: "/placeholder.svg?height=200&width=400",
  duration: "15 min",
  category: "training",
  progress: 0,
}

const RECOMMENDED_CONTENT = [
  {
    id: "1",
    title: "Nutrition Basics for Adult Dogs",
    category: "nutrition",
    type: "article",
    image: "/placeholder.svg?height=150&width=150",
    duration: "5 min read",
    isNew: true,
  },
  {
    id: "2",
    title: "Basic Commands Training",
    category: "training",
    type: "video",
    image: "/placeholder.svg?height=150&width=150",
    duration: "8 min watch",
    progress: 45,
  },
  {
    id: "3",
    title: "Dental Care Guide",
    category: "health",
    type: "article",
    image: "/placeholder.svg?height=150&width=150",
    duration: "4 min read",
    isCompleted: true,
  },
  {
    id: "4",
    title: "Leash Training Techniques",
    category: "training",
    type: "interactive",
    image: "/placeholder.svg?height=150&width=150",
    duration: "10 min activity",
  },
]

const LEARNING_PATHS = [
  {
    id: "path1",
    title: "Puppy Training Essentials",
    description: "A complete guide to training your new puppy",
    progress: 35,
    totalModules: 8,
    completedModules: 3,
    image: "/placeholder.svg?height=100&width=200",
  },
  {
    id: "path2",
    title: "Advanced Obedience",
    description: "Take your dog's training to the next level",
    progress: 10,
    totalModules: 6,
    completedModules: 1,
    image: "/placeholder.svg?height=100&width=200",
  },
]

const DAILY_TIP = {
  text: "Regular brushing helps reduce shedding and keeps your Golden Retriever's coat healthy and shiny.",
  category: "grooming",
}

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "nutrition", label: "Nutrition" },
  { id: "training", label: "Training" },
  { id: "health", label: "Health" },
  { id: "behavior", label: "Behavior" },
  { id: "grooming", label: "Grooming" },
]

export default function CoachDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("discover")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [savedContent, setSavedContent] = useState<string[]>([])

  const toggleSaved = (contentId: string) => {
    setSavedContent((prev) => (prev.includes(contentId) ? prev.filter((id) => id !== contentId) : [...prev, contentId]))
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "article":
        return <BookOpen className="h-4 w-4" />
      case "interactive":
        return <CheckSquare className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const filteredContent = RECOMMENDED_CONTENT.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || item.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Coach</h1>
          <p className="text-muted-foreground">Personalized training and education for your dog</p>
        </div>
        <div className="w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for content..."
              className="w-full md:w-[300px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4 flex items-center">
          <div className="mr-4 bg-amber-100 p-2 rounded-full">
            <Award className="h-6 w-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">Daily Tip</h3>
            <p className="text-sm">{DAILY_TIP.text}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="learning">My Learning</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value="discover">
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={FEATURED_CONTENT.image || "/placeholder.svg"}
                  alt={FEATURED_CONTENT.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                  <Badge className="w-fit mb-2">{FEATURED_CONTENT.category}</Badge>
                  <h2 className="text-xl font-bold text-white">{FEATURED_CONTENT.title}</h2>
                  <p className="text-white/80 text-sm mt-1">{FEATURED_CONTENT.description}</p>
                  <div className="flex items-center mt-4">
                    <Button className="bg-white text-black hover:bg-white/90">
                      <Play className="h-4 w-4 mr-2" />
                      Start Learning
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 text-white hover:text-white hover:bg-white/20"
                      onClick={() => toggleSaved(FEATURED_CONTENT.id)}
                    >
                      <Bookmark
                        className="h-5 w-5"
                        fill={savedContent.includes(FEATURED_CONTENT.id) ? "white" : "none"}
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex overflow-x-auto pb-2 space-x-2 -mx-1 px-1">
              {CATEGORIES.map((category) => (
                <Badge
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  className="cursor-pointer whitespace-nowrap"
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.label}
                </Badge>
              ))}
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Recommended For You</h2>
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredContent.map((content) => (
                  <Card key={content.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={content.image || "/placeholder.svg"}
                        alt={content.title}
                        className="w-full h-32 object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-black/20 text-white hover:bg-black/30 hover:text-white"
                        onClick={() => toggleSaved(content.id)}
                      >
                        <Bookmark className="h-4 w-4" fill={savedContent.includes(content.id) ? "white" : "none"} />
                      </Button>
                      {content.isNew && <Badge className="absolute top-2 left-2">New</Badge>}
                      {content.isCompleted && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white p-1 rounded-full">
                          <CheckSquare className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        <Badge variant="outline" className="flex items-center gap-1 mr-2">
                          {getContentTypeIcon(content.type)}
                          <span className="capitalize">{content.type}</span>
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {content.duration}
                        </span>
                      </div>
                      <h3 className="font-medium line-clamp-2">{content.title}</h3>
                      {content.progress !== undefined && (
                        <div className="mt-2">
                          <Progress value={content.progress} className="h-1" />
                          <p className="text-xs text-muted-foreground mt-1">{content.progress}% complete</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button variant="ghost" className="w-full" size="sm">
                        {content.isCompleted ? "Review Again" : content.progress ? "Continue" : "Start"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="learning">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Learning Paths</h2>
              <div className="space-y-4">
                {LEARNING_PATHS.map((path) => (
                  <Card key={path.id}>
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4">
                        <img
                          src={path.image || "/placeholder.svg"}
                          alt={path.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 md:w-3/4">
                        <h3 className="font-bold">{path.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{path.description}</p>
                        <Progress value={path.progress} className="h-2 mb-2" />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            {path.completedModules} of {path.totalModules} modules completed
                          </span>
                          <Button size="sm">Continue</Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">In Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {RECOMMENDED_CONTENT.filter(
                  (content) => content.progress !== undefined && content.progress > 0 && !content.isCompleted,
                ).map((content) => (
                  <Card key={content.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={content.image || "/placeholder.svg"}
                        alt={content.title}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        <Badge variant="outline" className="flex items-center gap-1 mr-2">
                          {getContentTypeIcon(content.type)}
                          <span className="capitalize">{content.type}</span>
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {content.duration}
                        </span>
                      </div>
                      <h3 className="font-medium line-clamp-2">{content.title}</h3>
                      <div className="mt-2">
                        <Progress value={content.progress} className="h-1" />
                        <p className="text-xs text-muted-foreground mt-1">{content.progress}% complete</p>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button variant="ghost" className="w-full" size="sm">
                        Continue
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Completed</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {RECOMMENDED_CONTENT.filter((content) => content.isCompleted).map((content) => (
                  <Card key={content.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={content.image || "/placeholder.svg"}
                        alt={content.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-green-500 text-white p-1 rounded-full">
                        <CheckSquare className="h-4 w-4" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        <Badge variant="outline" className="flex items-center gap-1 mr-2">
                          {getContentTypeIcon(content.type)}
                          <span className="capitalize">{content.type}</span>
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {content.duration}
                        </span>
                      </div>
                      <h3 className="font-medium line-clamp-2">{content.title}</h3>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button variant="ghost" className="w-full" size="sm">
                        Review Again
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="saved">
          {savedContent.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[FEATURED_CONTENT, ...RECOMMENDED_CONTENT]
                .filter((content) => savedContent.includes(content.id))
                .map((content) => (
                  <Card key={content.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={content.image || "/placeholder.svg"}
                        alt={content.title}
                        className="w-full h-32 object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-black/20 text-white hover:bg-black/30 hover:text-white"
                        onClick={() => toggleSaved(content.id)}
                      >
                        <Bookmark className="h-4 w-4" fill="white" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        <Badge variant="outline" className="flex items-center gap-1 mr-2">
                          {getContentTypeIcon(content.type || "article")}
                          <span className="capitalize">{content.type || "article"}</span>
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {content.duration}
                        </span>
                      </div>
                      <h3 className="font-medium line-clamp-2">{content.title}</h3>
                      {"progress" in content && content.progress !== undefined && (
                        <div className="mt-2">
                          <Progress value={content.progress} className="h-1" />
                          <p className="text-xs text-muted-foreground mt-1">{content.progress}% complete</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button variant="ghost" className="w-full" size="sm">
                        {"isCompleted" in content && content.isCompleted
                          ? "Review Again"
                          : "progress" in content && content.progress
                            ? "Continue"
                            : "Start"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No saved content yet</h3>
              <p className="text-muted-foreground mb-4">Bookmark articles, videos, and guides to access them later.</p>
              <Button onClick={() => setActiveTab("discover")}>Discover Content</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

