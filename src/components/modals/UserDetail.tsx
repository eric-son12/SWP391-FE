"use client"
import { useCallback, useEffect, useState } from "react"
import { Mail, Phone, Calendar, User, Eye } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"
import type { Child, User as UserType } from "@/types/user"
import axios from "@/utils/axiosConfig"
import { RelationshipType } from "@/types/enums"
import { Button } from "@/components/ui/button"
import { ChildDetailsModal } from "./ChildDetail"

interface UserDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserType | null
}

export function UserDetailsModal({ isOpen, onClose, user }: UserDetailsModalProps) {

  const [loading, setLoading] = useState(true)
  const [UserDetail, setUserDetail] = useState<UserType | null>(null)

  const [children, setChildren] = useState<Child | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const handleViewUserDetails = (id: number) => {
    const user = UserDetail?.children.find((user) => user.childId === id)
    if (!user) return
    setChildren(user)
    setIsDetailsModalOpen(true)
  }

  const fetchUserDetail = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const response = await axios.get(`/user/user-info/${user.id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          params: { userId: user.id },
        }
      )

      setUserDetail(response.data)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchUserDetail()
  }, [fetchUserDetail])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const columns: ColumnDef<Child>[] = [
    {
      accessorKey: "childId",
      header: "ID",
    },
    {
      accessorKey: "fullname",
      header: "Name",
    },
    {
      accessorKey: "birthDate",
      header: "Birth of date",
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => {
        return <span className="capitalize">{row.getValue("gender") || "-"}</span>
      }
    },
    {
      accessorKey: "relatives",
      header: "Relatives",
      cell: ({ row }) => {
        const relatives = row.getValue("relatives") as Array<{
          relationshipType: string;
          fullname: string;
        }>;

        const relationshipMap: Record<string, string> = {
          [RelationshipType.BROTHER_SISTER]: "Brother/Sister",
          [RelationshipType.UNCLE_AUNT]: "Uncle/Aunt",
          [RelationshipType.PARENTS]: "Parent",
          [RelationshipType.GRANDMASTERS]: "Grandparent"
        };

        if (!relatives || relatives.length === 0) return <span>-</span>;

        return (
          <div className="space-y-1">
            {relatives.map((relative, index) => {
              const relationship = relative.relationshipType
                ? relationshipMap[relative.relationshipType] || relative.relationshipType
                : "-";

              return (
                <div key={index} className="capitalize">
                  {relationship}
                </div>
              )
            })}
          </div>
        )
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.getValue("childId") as number

        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleViewUserDetails(id)}>
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  if (!UserDetail) return null

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="min-w-[60svw]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* User Profile Header */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={UserDetail?.avatarUrl || ""} alt={UserDetail?.fullname} />
                <AvatarFallback>
                  {UserDetail?.fullname
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{UserDetail?.fullname}</h2>
                <p className="text-sm text-gray-500">@{UserDetail?.username}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </div>
                <p className="font-medium">{UserDetail?.email}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Phone className="h-4 w-4" />
                  <span>Phone</span>
                </div>
                <p className="font-medium">{UserDetail?.phone}</p>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Date of Birth</span>
                  </div>
                  <p className="font-medium">{UserDetail?.bod ? formatDate(UserDetail.bod) : ''}</p>
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="h-4 w-4" />
                    <span>Gender</span>
                  </div>
                  <p className="font-medium">{UserDetail?.gender}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              {loading ? (
                <div className="flex h-40 items-center justify-center">
                  <p>Loading users...</p>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={UserDetail.children}
                  searchColumn="fullname"
                  searchPlaceholder="Search by name..."
                />
              )}
            </div>

          </div>
        </DialogContent>
      </Dialog>

      <ChildDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        user={children}
      />
    </>
  )
}

