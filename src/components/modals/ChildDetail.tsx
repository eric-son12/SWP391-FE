"use client"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Calendar, Edit, Trash2, User } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import type { Child, User as UserType } from "@/types/user"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "@/utils/axiosConfig"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import { EditInput } from "./EditInput"

interface UserDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  user: Child | null
}

interface UnderlyingDisease {
  id: number,
  conditionName: string,
  note: string
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
  const [loading, setLoading] = useState(true)

  const [guardian, setGuardian] = useState<UserType | null>(null)
  const [history, setHistory] = useState<VaccinationHistory[]>([])
  const [underlyingDisease, setUnderlyingDisease] = useState<UnderlyingDisease[]>([])
  const [editingDiseaseId, setEditingDiseaseId] = useState<number | null>(null)
  const [focusedField, setFocusedField] = useState<"conditionName" | "note" | null>(null)

  const [editedDisease, setEditedDisease] = useState<{
    conditionName: string,
    note: string
  } | null>(null)

  const getUnderlyingDisease = useCallback(async () => {
    if (!user) return;
    const res = await axios.get(`/underlying-conditions/user/${user.childId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params: {
        childId: user.childId,
      },
    })
    const data = res.data.conditions || []
    setUnderlyingDisease(data)
  }, [user, user?.childId])

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

    const data = res.data.result || []
    const newData = standardizeData(data);

    setHistory(newData ? [newData] : [])
  }, [user, user?.childId])

  useEffect(() => {
    if (user) {
      setLoading(true)
      Promise.all([
        getUnderlyingDisease(),
        getParent(),
        getHistory()
      ]).finally(() => setLoading(false))
    }
  }, [getUnderlyingDisease, getParent, getHistory, user])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const startEditDisease = (disease: UnderlyingDisease) => {
    setEditingDiseaseId(disease.id)
    setEditedDisease({
      conditionName: disease.conditionName,
      note: disease.note,
    })
  }

  const cancelEditDisease = () => {
    setEditingDiseaseId(null)
    setEditedDisease(null)
  }

  const handleSaveDisease = async (conditionId: number) => {
    if (!user) return
    try {
      const token = localStorage.getItem("token")
      if (!editedDisease) return
      const body = {
        conditionName: editedDisease.conditionName,
        note: editedDisease.note,
      }
      await axios.put(`/underlying-conditions/user/${user.childId}/${conditionId}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUnderlyingDisease((prev) =>
        prev.map((d) => (d.id === conditionId ? { ...d, ...editedDisease } : d))
      )
      toast.success("Underlying disease updated successfully!")
      cancelEditDisease()
    } catch (error) {
      console.error("Failed to update underlying disease", error)
      toast.error("Failed to update underlying disease")
    }
  }

  const handleDeleteDisease = async (conditionId: number) => {
    if (!user) return
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`/underlying-conditions/user/${user.childId}/${conditionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUnderlyingDisease((prev) => prev.filter((d) => d.id !== conditionId))
      toast.success("Underlying disease deleted successfully!")
      if (editingDiseaseId === conditionId) {
        cancelEditDisease()
      }
    } catch (error) {
      console.error("Failed to delete underlying disease", error)
      toast.error("Failed to delete underlying disease")
    }
  }
  
  const columns: ColumnDef<UnderlyingDisease>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "conditionName",
        header: "Name",
        cell: ({ row }) => {
          const disease = row.original
          if (editingDiseaseId === disease.id) {
            return (
              <EditInput
                value={editedDisease?.conditionName ?? disease.conditionName}
                autoFocus={focusedField === "conditionName"}
                onChange={(e) =>
                  setEditedDisease((prev) =>
                    prev
                      ? { ...prev, conditionName: e.target.value }
                      : { conditionName: e.target.value, note: disease.note }
                  )
                }
                onFocus={() => setFocusedField("conditionName")}
              />
            )
          }
          return disease.conditionName
        },
      },
      {
        accessorKey: "note",
        header: "Note",
        cell: ({ row }) => {
          const disease = row.original
          if (editingDiseaseId === disease.id) {
            return (
              <EditInput
                value={editedDisease?.note ?? disease.note}
                autoFocus={focusedField === "note"}
                onChange={(e) =>
                  setEditedDisease((prev) =>
                    prev
                      ? { ...prev, note: e.target.value }
                      : { conditionName: disease.conditionName, note: e.target.value }
                  )
                }
                onFocus={() => setFocusedField("note")}
              />
            )
          }
          return disease.note || "-"
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const disease = row.original
          if (editingDiseaseId === disease.id) {
            return (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleSaveDisease(disease.id)}>
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={cancelEditDisease}>
                  Cancel
                </Button>
              </div>
            )
          }
          return (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => startEditDisease(disease)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDeleteDisease(disease.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )
        },
      },
    ],
    [
      editingDiseaseId,
      editedDisease,
      focusedField,       // IMPORTANT so it re-checks which column to autoFocus
      startEditDisease,
      cancelEditDisease,
      handleSaveDisease,
      handleDeleteDisease,
    ]
  )

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

          {underlyingDisease.length > 0 && (
            <>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Underlying Disease</h3>
                {loading ? (
                  <div className="flex h-40 items-center justify-center">
                    <p>Loading users...</p>
                  </div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={underlyingDisease}
                  />
                )}
              </div>

              <Separator />
            </>
          )}

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
                {history.length === 0 && <p>No previous vaccination history</p>}
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
