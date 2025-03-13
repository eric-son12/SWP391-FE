"use client"

import { useState, useEffect } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Edit, Trash2, Eye, UserPlus } from "lucide-react"
import { useStore } from "@/store"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/types/user"
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
import { UserDetailsModal } from "@/components/modals/UserDetail"

const fetchAllUsers = async (): Promise<User[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  return [
    {
      id: 1,
      parentid: 0,
      username: "johndoe",
      fullname: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      bod: "1990-05-15T00:00:00.000Z",
      gender: "Male",
      avatarUrl: "/placeholder-user.jpg",
    },
    {
      id: 2,
      parentid: 0,
      username: "janedoe",
      fullname: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+1987654321",
      bod: "1992-08-20T00:00:00.000Z",
      gender: "Female",
      avatarUrl: "/placeholder-user.jpg",
    },
    {
      id: 3,
      parentid: 1,
      username: "mikejones",
      fullname: "Mike Jones",
      email: "mike.jones@example.com",
      phone: "+1122334455",
      bod: "1985-12-10T00:00:00.000Z",
      gender: "Male",
      avatarUrl: "/placeholder-user.jpg",
    },
    {
      id: 4,
      parentid: 0,
      username: "sarahsmith",
      fullname: "Sarah Smith",
      email: "sarah.smith@example.com",
      phone: "+1567890123",
      bod: "1995-03-25T00:00:00.000Z",
      gender: "Female",
      avatarUrl: "/placeholder-user.jpg",
    },
    {
      id: 5,
      parentid: 2,
      username: "robertbrown",
      fullname: "Robert Brown",
      email: "robert.brown@example.com",
      phone: "+1654321987",
      bod: "1988-07-30T00:00:00.000Z",
      gender: "Male",
      avatarUrl: "/placeholder-user.jpg",
    },
  ]
}

export default function UsersManagementPage() {
  const { toast } = useToast()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<number | null>(null)

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

  const handleViewUserDetails = (id: number) => {
    const user = users.find((u) => u.id === id)
    if (user) {
      setSelectedUser(user)
      setIsDetailsModalOpen(true)
    }
  }

  const handleEditUser = (id: number) => {
    const user = users.find((u) => u.id === id)
    if (user) {
    }
  }

  const confirmDelete = (id: number) => {
    setUserToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!userToDelete) return

    try {
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

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "fullname",
      header: "Name",
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "gender",
      header: "Gender",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.getValue("id") as number

        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleViewUserDetails(id)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleEditUser(id)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => confirmDelete(id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button onClick={() => {}}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Parent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.parentid === 0).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Child Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.parentid !== 0).length}</div>
          </CardContent>
        </Card>
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

      {/* User Details Modal */}
      <UserDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} user={selectedUser} />

      {/* Delete Confirmation Dialog */}
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

