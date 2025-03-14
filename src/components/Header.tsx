"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react"
import { useStore } from "@/store"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import axios from "@/utils/axiosConfig"

interface Notification {
  id: number;
  user: {
    id: number;
    parentid: any;
    username: string;
    fullname: string;
    email: string;
  };
  message: string;
  createdAt: string;
  readStatus: boolean;
}

export function Header() {
  const router = useRouter()
  const { user } = useStore.getState().profile
  const { logout } = useStore.getState()

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loadingNotifications, setLoadingNotifications] = useState(false)

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoadingNotifications(true)
      const token = localStorage.getItem("token")
      const response = await axios.get("/notification/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      })
      // Assuming the API returns an array in response.data
      setNotifications(response.data || [])
    } catch (error) {
      console.error("Failed to fetch notifications", error)
    } finally {
      setLoadingNotifications(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const markAsRead = async (id: number) => {
    try {
      const token = localStorage.getItem("token")
      await axios.put(`/notification/notifications/${id}/read`, {id}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, readStatus: true } : notif
        )
      )
    } catch (error) {
      console.error("Failed to mark notification as read", error)
    }
  }

  const markAllAsRead = async () => {
    await Promise.all(
      notifications.filter((n) => !n.readStatus).map((n) => markAsRead(n.id))
    )
  }

  const unreadCount = notifications.filter((n) => !n.readStatus).length

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="flex h-16 items-center justify-end border-b bg-white px-6">
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-black" />
              {unreadCount > 0 && (
                <Badge
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 p-0 text-xs text-white"
                  variant="destructive"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between border-b p-3">
              <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
              {/* {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-blue-600"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </Button>
              )} */}
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`flex flex-col cursor-pointer p-3 hover:bg-gray-50 justity-start ${
                      !notification.readStatus ? "bg-blue-50" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-1">
                      <div className="flex items-center justify-between">
                        {!notification.readStatus && (
                          <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                    </div>
                      <span className="w-full text-xs text-gray-500 ml-8">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  {loadingNotifications ? "Loading..." : "No notifications"}
                </div>
              )}
            </div>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-center text-sm text-blue-600"
                onClick={() => router.push("/notifications")}
              >
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/images/placeholder-user.webp" alt="User" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-sm">
                <span className="font-medium">{user?.fullname}</span>
                <span className="text-xs text-gray-500">{user?.email || ""}</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
