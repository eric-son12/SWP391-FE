"use client"
import { useState, useEffect } from "react"
import { Bell, Plus, Search } from "lucide-react"
import { useStore } from "@/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { Notification } from "@/types/notification"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import axios from '@/utils/axiosConfig'
import { ViewPostModal } from "@/components/modals/post/ViewPostModal" // if needed
import { CreateNotificationModal } from "@/components/modals/CreateNotificationModal"
import { useRouter } from "next/navigation"

export default function NotificationsPage() {
  const { toast } = useToast()
  const { user } = useStore.getState().profile
  const router = useRouter()

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const loadNotifications = async () => {
    if (!user) return
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await axios.get("/notification/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      })
      // Assume API returns an array in response.data.result (or directly in response.data)
      const data: Notification[] = response.data.result || response.data || []
      setNotifications(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [user, toast])

  // Mark a single notification as read by calling the PUT endpoint
  const markAsRead = async (id: number) => {
    try {
      const token = localStorage.getItem("token")
      await axios.put(`/notification/notifications/${id}/read`, null, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readStatus: true } : n))
      )
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      })
    }
  }

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread" && n.readStatus) return false
    if (activeTab === "read" && !n.readStatus) return false
    return true
  })

  // Friendly date formatter (e.g. "5 minutes ago")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.round(diffMs / 60000)
    const diffHours = Math.round(diffMs / 3600000)
    const diffDays = Math.round(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`
    return date.toLocaleDateString()
  }

  // Handler to open the create notification modal
  const handleCreateNotification = () => {
    setIsCreateModalOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {user && (user.role === "ROLE_ADMIN" || user.role === "ROLE_ROLE_STAFF") && (
          <Button onClick={handleCreateNotification}>
            <Plus className="mr-2 h-4 w-4" />
            Create Notification
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <p>Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex h-40 items-center justify-center">
              <p className="text-sm text-muted-foreground">No notifications found</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "cursor-pointer p-4 transition-colors hover:bg-gray-50",
                    !notification.readStatus && "bg-blue-50"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>From: {notification.user.fullname}</span>
                    <span>{formatDate(notification.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {isCreateModalOpen && (
        <CreateNotificationModal
          onClose={async () => {
            setIsCreateModalOpen(false)
            await loadNotifications()
          }}
        />
      )}
    </div>
  )
}
