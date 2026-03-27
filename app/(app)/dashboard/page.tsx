
"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  MessageCircle, 
  Fish, 
  AlertCircle, 
  Heart,
  Send,
  Clock
} from "lucide-react"

const mockData = {
  patientName: "Margaret",
  weekSummary: [
    "Most calm in mornings",
    "Enjoyed talking about fishing",
    "Showed signs of mild anxiety on Tuesday",
    "Responded well to gentle mode"
  ],
  mood: { label: "Stable", score: 72, trend: "up" },
  lastActive: "Today at 9:14 AM"
}

function MoodProgressRing({ score }: { score: number }) {
  const radius = 54
  const strokeWidth = 8
  const normalizedRadius = radius - strokeWidth / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="-rotate-90">
        {/* Background circle */}
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-primary transition-all duration-500"
        />
      </svg>
      <span className="absolute text-2xl font-semibold text-card-foreground">
        {score}
      </span>
    </div>
  )
}

function getInsightIcon(insight: string) {
  const lowerInsight = insight.toLowerCase()
  
  if (lowerInsight.includes("fishing")) {
    return <Fish className="size-4 text-accent" />
  }
  if (lowerInsight.includes("anxiety") || lowerInsight.includes("signs")) {
    return <AlertCircle className="size-4 text-destructive" />
  }
  if (lowerInsight.includes("gentle") || lowerInsight.includes("calm")) {
    return <Heart className="size-4 text-primary" />
  }
  return <MessageCircle className="size-4 text-muted-foreground" />
}

export default function CaregiverDashboard() {
  const [isSending, setIsSending] = useState(false)

  const handleSendSummary = () => {
    setIsSending(true)
    
    // Simulate sending
    setTimeout(() => {
      setIsSending(false)
      toast.success("Summary sent!", {
        description: "The weekly summary has been sent to the care team."
      })
    }, 800)
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] md:min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-6 md:py-8">
        {/* Header */}
        <header className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-serif font-bold tracking-tight text-foreground">
            Caregiver Dashboard
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {mockData.patientName}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              Last active: {mockData.lastActive}
            </span>
          </div>
        </header>

        <div className="space-y-4">
          {/* Mood Indicator Card */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Current Mood
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <MoodProgressRing score={mockData.mood.score} />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-semibold text-card-foreground">
                      {mockData.mood.label}
                    </span>
                    {mockData.mood.trend === "up" && (
                      <span className="flex items-center gap-0.5 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        <TrendingUp className="size-3" />
                        Trending up
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Score: {mockData.mood.score} / 100
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Summary Card */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                {"This Week's Insights"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {mockData.weekSummary.map((insight, index) => (
                  <li 
                    key={index} 
                    className="flex items-start gap-3 text-sm text-card-foreground"
                  >
                    <span className="mt-0.5 flex-shrink-0">
                      {getInsightIcon(insight)}
                    </span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Send Summary Button */}
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleSendSummary}
            disabled={isSending}
          >
            <Send className="size-4" />
            {isSending ? "Sending..." : "Send Weekly Summary to Care Team"}
          </Button>
        </div>
      </div>
    </div>
  )
}
