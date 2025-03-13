"use client"

import { useState, useEffect } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash2, Eye, UserPlus } from "lucide-react"
import { RoleUser } from "@/types/enums"
import { useStore } from "@/store"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PreviewPopup } from "@/components/ui/preview-popup"
import { UserPreview } from "@/components/modals/UserPreview"
import { Patient, User } from "@/models/user"


export default function UsersPage() {
  const { user } = useStore.getState().profile
  const { fetchAllUsers, deleteUser } = useStore.getState()
  const { toast } = useToast()

  const [users, setUsers] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<number | null>(null)
  const [selectedUser, setSelectedUser] = useState<Patient | null>(null)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchAllUsers() 
        setUsers(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [toast])

  const handlePreview = (userId: number) => {
    const user = users.find((u) => u.id === userId)
    if (user) {
      setSelectedUser(user)
    }
  }

  const handleEdit = (userId: number) => {
    const user = users.find((u) => u.id === userId)
    if (user) {
    }
  }

  const handleDelete = async () => {
    if (!userToDelete) return

    try {
      await deleteUser(userToDelete)
      setUsers(users.filter((user) => user.id !== userToDelete))
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    } finally {
      setUserToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const confirmDelete = (userId: number) => {
    setUserToDelete(userId)
    setDeleteDialogOpen(true)
  }

  const getRoleBadgeVariant = (role: RoleUser) => {
    switch (role) {
      case RoleUser.ADMIN:
        return "destructive"
      case RoleUser.STAFF:
        return "default"
      case RoleUser.CUSTOMER:
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      default:
        return null
    }
  }

  const columns: ColumnDef<Patient>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "fullname",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as RoleUser
        return <Badge variant={getRoleBadgeVariant(role)}>{role.replace("ROLE_", "")}</Badge>
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        const date = row.getValue("created_at") as string
        return new Date(date).toLocaleDateString()
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const userId = row.getValue("user_id") as number
        const userRole = row.getValue("role") as RoleUser

        const canEdit =
          user?.role === RoleUser.ADMIN || (user?.role === RoleUser.STAFF && userRole === RoleUser.CUSTOMER)

        const canDelete = user?.role === RoleUser.ADMIN && userRole !== RoleUser.ADMIN

        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handlePreview(userId)}>
              <Eye className="h-4 w-4" />
            </Button>

            {canEdit && (
              <Button variant="outline" size="sm" onClick={() => handleEdit(userId)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}

            {canDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => confirmDelete(userId)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        {(user?.role === RoleUser.ADMIN || user?.role === RoleUser.STAFF) && (
          <Button onClick={() => {}}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <p>Loading users...</p>
            </div>
          ) : (
            <DataTable columns={columns} data={users} searchColumn="fullname" searchPlaceholder="Search by name..." />
          )}
        </CardContent>
      </Card>

      {/* Preview Popup */}
      <PreviewPopup isOpen={!!selectedUser} onClose={() => setSelectedUser(null)}>
        {selectedUser && <UserPreview user={selectedUser} onClose={() => setSelectedUser(null)} />}
      </PreviewPopup>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user and remove their data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

