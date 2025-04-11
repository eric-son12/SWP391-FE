"use client"
import { useState, useEffect, useCallback } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Eye, UserPlus } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
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
import { CreatePatientModal } from "@/components/modals/CreatePatientModal"
import { useStore } from "@/store"

export default function UsersManagementPage() {
  
  const fetchAllUser = useStore(state => state.fetchAllUsers)

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<number | null>(null)

  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false)

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true)
      const resp = await fetchAllUser()
      setUsers(resp as unknown as User[])
    } catch (error) {
      console.error('Error:', error)
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }, [fetchAllUser])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleViewUserDetails = (id: number) => {
    const user = users.find((u) => u.id === id)
    if (user) {
      setSelectedUser(user)
      setIsDetailsModalOpen(true)
    }
  }

  const handleDelete = async () => {
    if (!userToDelete) return
    try {
      setUsers((prev) => prev.filter((user) => user.id !== userToDelete))
      toast.success("User deleted successfully")
    } catch (error) {
      console.error('Error:', error)
      toast("Failed to delete user")
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
      cell: ({row}) => {
        return <span className="capitalize">{row.getValue("gender") || "-"}</span>
      }
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
            {/* Uncomment these if you add edit/delete logic:
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
            </Button> */}
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button onClick={() => setIsPatientModalOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
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
            <DataTable
              columns={columns}
              data={users}
              searchColumn="email"
              searchPlaceholder="Search by email..."
            />
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        user={selectedUser}
      />

      {isPatientModalOpen && (
        <CreatePatientModal onClose={() => setIsPatientModalOpen(false)} />
      )}

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
