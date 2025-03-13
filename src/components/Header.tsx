"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react'
import { useStore } from "@/store"
import { cn } from "@/lib/utils"
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

export function Header() {
  const router = useRouter()

  const { user } = useStore.getState().profile
  const {logout} = useStore.getState()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // const unreadCount = notificationItems.filter((item) => !item.read).length

  // const markAllAsRead = () => {
  //   setNotificationItems(notificationItems.map((item) => ({ ...item, read: true })))
  //   setNotifications(0)
  // }

  // const markAsRead = (id: number) => {
  //   setNotificationItems(notificationItems.map((item) => (item.id === id ? { ...item, read: true } : item)))
  //   setNotifications(Math.max(0, unreadCount - 1))
  // }

  // const viewAllNotifications = () => {
  //   router.push('/dashboard/notifications')
  // }

  return (
    <header className="flex h-16 items-center justify-end border-b bg-white px-6">
      <div className="flex items-center gap-4">
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5! w-5! text-black" />
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
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-blue-600" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
              )}
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notificationItems.length > 0 ? (
                notificationItems.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex cursor-pointer flex-col gap-1 border-b p-3 hover:bg-gray-50",
                      !notification.read && "bg-blue-50",
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{notification.title}</h4>
                      {!notification.read && <div className="h-2 w-2 rounded-full bg-blue-600"></div>}
                    </div>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">No notifications</div>
              )}
            </div>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-center text-sm text-blue-600"
                onClick={viewAllNotifications}
              >
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu> */}

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
