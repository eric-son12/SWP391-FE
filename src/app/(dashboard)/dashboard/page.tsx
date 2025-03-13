"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, Syringe, DollarSign, Calendar } from "lucide-react"

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      icon: Users,
      change: "+12%",
      color: "text-blue-600",
    },
    {
      title: "Vaccinations Today",
      value: "42",
      icon: Syringe,
      change: "+5%",
      color: "text-green-600",
    },
    {
      title: "Revenue This Month",
      value: "$12,345",
      icon: DollarSign,
      change: "+8%",
      color: "text-purple-600",
    },
    {
      title: "Upcoming Appointments",
      value: "28",
      icon: Calendar,
      change: "+3%",
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard
        </h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={`${stat.color}`}>{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 rounded-lg border p-3">
                  <Activity className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium">
                      {i % 2 === 0 ? "New vaccination appointment scheduled" : "User profile updated"}
                    </p>
                    <p className="text-sm text-gray-500">{new Date(Date.now() - i * 3600000).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Vaccines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Influenza", "COVID-19", "Hepatitis B", "Tetanus", "HPV"].map((vaccine, i) => (
                <div key={vaccine} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700`}>
                      {i + 1}
                    </div>
                    <span>{vaccine}</span>
                  </div>
                  <span className="font-medium">{Math.floor(Math.random() * 100) + 50} doses</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

