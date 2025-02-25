"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import SearchIcon from "@mui/icons-material/Search"

interface User {
  id: number
  username: string
  fullName: string
  email: string
  role: string
}

const initialUsers: User[] = [
  { id: 1, username: "john_doe", fullName: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, username: "jane_smith", fullName: "Jane Smith", email: "jane@example.com", role: "User" },
  { id: 3, username: "bob_johnson", fullName: "Bob Johnson", email: "bob@example.com", role: "User" },
]

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
  const [searchTerm, setSearchTerm] = useState("")

  const handleOpenDialog = (mode: "add" | "edit", user?: User) => {
    setDialogMode(mode)
    setCurrentUser(user || { id: 0, username: "", fullName: "", email: "", role: "" })
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setCurrentUser(null)
  }

  const handleSaveUser = () => {
    if (currentUser) {
      if (dialogMode === "add") {
        setUsers([...users, { ...currentUser, id: users.length + 1 }])
      } else {
        setUsers(users.map((u) => (u.id === currentUser.id ? currentUser : u)))
      }
    }
    handleCloseDialog()
  }

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((u) => u.id !== id))
  }

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        User Management
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, gap: 4 }}>
        <TextField
          variant="outlined"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }
          }}
          sx={{ flex: 1 }}
        />
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenDialog("add")}>
          Add User
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenDialog("edit", user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteUser(user.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{dialogMode === "add" ? "Add User" : "Edit User"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            value={currentUser?.username || ""}
            onChange={(e) => setCurrentUser({ ...currentUser!, username: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={currentUser?.email || ""}
            onChange={(e) => setCurrentUser({ ...currentUser!, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Role"
            type="text"
            fullWidth
            value={currentUser?.role || ""}
            onChange={(e) => setCurrentUser({ ...currentUser!, role: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveUser} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default UserManagement

