"use client"
import { useCallback, useEffect, useState } from "react"
import { Calendar, User } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import type { Child, User as UserType } from "@/types/user"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "@/utils/axiosConfig"

interface UserDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  user: Child | null
}

interface VaccinationHistory {
  orderDetailId: number;
  vaccinationDate: string;
  vaccines: {
    vaccineName: string;
  }[];
}

const standardizeData = (data: any[]) => {
  if (data.length === 0) {
    return null;
  }

  const standardized = {
    orderDetailId: data[0].orderDetailId,
    vaccinationDate: data[0].vaccinationDate,
    vaccines: data.map(item => ({
      vaccineName: item.vaccineName.trim()
    }))
  };

  return standardized;
}

export function ChildDetailsModal({ isOpen, onClose, user }: UserDetailsModalProps) {
  const [guardian, setGuardian] = useState<UserType | null>(null)
  const [history, setHistory] = useState<VaccinationHistory[]>([])

  const getParent = useCallback(async () => {
    if (!user) return;
    const res = await axios.get(`/manage/${user.childId}/parent`, {
      params: {
        childId: user.childId,
      },
    })

    const data = res.data || null
    setGuardian(data)
  }, [user, user?.childId])

  const getHistory = useCallback(async () => {
    if (!user) return;
    const res = await axios.get(`/user/history`, {
      params: {
        childId: user.childId,
      },
    })

    console.log("res: ", res)

    const data = res.data.result || []
    const newData = standardizeData(data);

    setHistory(newData ? [newData] : [])
  }, [user, user?.childId])

  useEffect(() => {
    if (user) { 
      Promise.all([getParent(), getHistory()])
    }
  }, [getParent, getHistory, user]) 

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[75svw]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Profile Header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.avatarUrl || ""} alt={user?.fullname} />
              <AvatarFallback>
                {user?.fullname
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{user?.fullname}</h2>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Date of Birth</span>
              </div>
              <p className="font-medium">{user?.birthDate ? formatDate(user?.birthDate) : "-"}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="h-4 w-4" />
                  <span>Gender</span>
                </div>
                <p className="font-medium">{user?.gender}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="h-4 w-4" />
                  <span>Height</span>
                </div>
                <p className="font-medium">{user?.height} cm</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="h-4 w-4" />
                  <span>Weight</span>
                </div>
                <p className="font-medium">{user?.weight} kg</p>
              </div>
            </div>
          </div>

          <Separator />

          <Tabs>
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value={"Relatice"}>Personal Information</TabsTrigger>
              <TabsTrigger value={"Vaccinations"}>History</TabsTrigger>
            </TabsList>

            <TabsContent value={"Relatice"}>
              <div className="grid grid-cols-2 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="h-4 w-4" />
                    <span>Guardian</span>
                  </div>
                  <p className="font-medium">{guardian?.fullname || "-"}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="h-4 w-4" />
                    <span>Relative</span>
                  </div>
                  <p className="font-medium">{guardian?.relativeType || "-"}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="h-4 w-4" />
                    <span>Phone</span>
                  </div>
                  <p className="font-medium">{guardian?.phone || "-"}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="h-4 w-4" />
                    <span>Email</span>
                  </div>
                  <p className="font-medium">{guardian?.email || "-"}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value={"Vaccinations"}>
              <div className="space-y-4">
                {history.map(h => (
                  <div>
                    <strong>{formatDate(h.vaccinationDate)}</strong>
                    <ul key={h.orderDetailId} className="list-disc">
                        {h.vaccines.map(v => (
                          <li 
                            key={v.vaccineName}
                            className="ml-6"  
                          >{v.vaccineName}</li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
