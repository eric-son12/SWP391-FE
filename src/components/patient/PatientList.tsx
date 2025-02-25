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
  TextField,
  InputAdornment,
  IconButton,
  Pagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Tab,
  Tabs,
} from "@mui/material"
import { useForm, Controller } from "react-hook-form"
import SearchIcon from "@mui/icons-material/Search"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

interface Patient {
  id: number
  username: string
  fullName: string
  dateOfBirth: string
  phone: string
  role: "customer" | "child"
  avatar: string
  vaccineStatus: string
  parent?: Patient
  children?: Patient[]
}

interface VaccinationHistory {
  id: number
  patientId: number
  vaccineName: string
  date: string
}

interface Feedback {
  id: number
  patientId: number
  date: string
  comment: string
  rating: number
}

const initialPatients: Patient[] = [
  {
    id: 1,
    username: "johndoe",
    fullName: "John Doe",
    dateOfBirth: "1980-05-15",
    phone: "123-456-7890",
    role: "customer",
    avatar: "/placeholder.svg",
    vaccineStatus: "Fully Vaccinated",
    children: [
      {
        id: 6,
        username: "tommydoe",
        fullName: "Tommy Doe",
        dateOfBirth: "2015-03-10",
        phone: "",
        role: "child",
        avatar: "/placeholder.svg",
        vaccineStatus: "Partially Vaccinated",
      },
    ],
  },
  {
    id: 2,
    username: "janesmith",
    fullName: "Jane Smith",
    dateOfBirth: "1992-08-22",
    phone: "987-654-3210",
    role: "customer",
    avatar: "/placeholder.svg",
    vaccineStatus: "Partially Vaccinated",
  },
  {
    id: 3,
    username: "alicejohnson",
    fullName: "Alice Johnson",
    dateOfBirth: "1975-11-30",
    phone: "456-789-0123",
    role: "customer",
    avatar: "/placeholder.svg",
    vaccineStatus: "Not Vaccinated",
  },
  {
    id: 4,
    username: "bobwilliams",
    fullName: "Bob Williams",
    dateOfBirth: "1988-02-14",
    phone: "789-012-3456",
    role: "customer",
    avatar: "/placeholder.svg",
    vaccineStatus: "Fully Vaccinated",
  },
  {
    id: 5,
    username: "emmabrown",
    fullName: "Emma Brown",
    dateOfBirth: "1995-07-07",
    phone: "321-654-9870",
    role: "customer",
    avatar: "/placeholder.svg",
    vaccineStatus: "Partially Vaccinated",
  },
]

const initialVaccinationHistory: VaccinationHistory[] = [
  { id: 1, patientId: 1, vaccineName: "Flu Shot", date: "2023-01-15" },
  { id: 2, patientId: 1, vaccineName: "COVID-19", date: "2023-02-20" },
  { id: 3, patientId: 2, vaccineName: "Tetanus", date: "2023-03-10" },
]

const initialFeedback: Feedback[] = [
  { id: 1, patientId: 1, date: "2023-04-01", comment: "Great service!", rating: 5 },
  { id: 2, patientId: 2, date: "2023-04-15", comment: "Quick and efficient.", rating: 4 },
]

const PatientList = () => {
  const [patients, setPatients] = useState<Patient[]>(initialPatients)
  const [vaccinationHistory, setVaccinationHistory] = useState<VaccinationHistory[]>(initialVaccinationHistory)
  const [feedback, setFeedback] = useState<Feedback[]>(initialFeedback)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null)
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | "delete">("add")
  const [dialogTab, setDialogTab] = useState(0)

  const { control, handleSubmit, reset } = useForm<Patient>()

  const patientsPerPage = 5

  const filteredPatients = patients.filter(
    (patient) =>
      (patient.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)),
  )

  const paginatedPatients = filteredPatients.slice((page - 1) * patientsPerPage, page * patientsPerPage)

  const handleOpenDialog = (mode: "add" | "edit" | "delete", patient?: Patient) => {
    setDialogMode(mode)
    setCurrentPatient(patient || null)
    reset(
      patient || {
        id: 0,
        username: "",
        fullName: "",
        dateOfBirth: "",
        phone: "",
        role: "customer",
        avatar: "/placeholder.svg",
        vaccineStatus: "Not Vaccinated",
      },
    )
    setDialogOpen(true)
    setDialogTab(0)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setCurrentPatient(null)
  }

  const onSubmit = (data: Patient) => {
    if (dialogMode === "add") {
      setPatients([...patients, { ...data, id: patients.length + 1 }])
    } else if (dialogMode === "edit") {
      setPatients(patients.map((p) => (p.id === currentPatient?.id ? { ...data, id: p.id } : p)))
    }
    handleCloseDialog()
  }

  const handleDeletePatient = () => {
    if (currentPatient) {
      setPatients(patients.filter((p) => p.id !== currentPatient.id))
    }
    handleCloseDialog()
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Patient List
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <TextField
          variant="outlined"
          placeholder="Search patients..."
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
          sx={{ width: "70%" }}
        />
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenDialog("add")}>
          Add Patient
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Vaccine Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>
                  <Avatar src={patient.avatar} alt={patient.fullName} />
                </TableCell>
                <TableCell>{patient.username}</TableCell>
                <TableCell>{patient.fullName}</TableCell>
                <TableCell>{patient.dateOfBirth}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{patient.vaccineStatus}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenDialog("edit", patient)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleOpenDialog("delete", patient)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={Math.ceil(filteredPatients.length / patientsPerPage)}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </Box>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === "add" ? "Add Patient" : dialogMode === "edit" ? "Edit Patient" : "Delete Patient"}
        </DialogTitle>
        <DialogContent>
          {dialogMode === "delete" ? (
            <Typography>Are you sure you want to delete this patient?</Typography>
          ) : (
            <>
              <Tabs value={dialogTab} onChange={(e, newValue) => setDialogTab(newValue)}>
                <Tab label="Patient Info" />
                <Tab label="Vaccination History" />
                <Tab label="Feedback" />
                {currentPatient?.role === "customer" && <Tab label="Children" />}
                {currentPatient?.role === "child" && <Tab label="Parent" />}
              </Tabs>
              {dialogTab === 0 && (
                <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                  <Controller
                    name="username"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Username is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField {...field} label="Username" error={!!error} helperText={error?.message} />
                    )}
                  />
                  <Controller
                    name="fullName"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Full Name is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField {...field} label="Full Name" error={!!error} helperText={error?.message} />
                    )}
                  />
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Date of Birth is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label="Date of Birth"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                  <Controller
                    name="phone"
                    control={control}
                    defaultValue=""
                    render={({ field }) => <TextField {...field} label="Phone" />}
                  />
                  <Controller
                    name="role"
                    control={control}
                    defaultValue="customer"
                    render={({ field }) => (
                      <FormControl>
                        <InputLabel>Role</InputLabel>
                        <Select {...field}>
                          <MenuItem value="customer">Customer</MenuItem>
                          <MenuItem value="child">Child</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                  <Controller
                    name="vaccineStatus"
                    control={control}
                    defaultValue="Not Vaccinated"
                    render={({ field }) => (
                      <FormControl>
                        <InputLabel>Vaccine Status</InputLabel>
                        <Select {...field}>
                          <MenuItem value="Not Vaccinated">Not Vaccinated</MenuItem>
                          <MenuItem value="Partially Vaccinated">Partially Vaccinated</MenuItem>
                          <MenuItem value="Fully Vaccinated">Fully Vaccinated</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Box>
              )}
              {dialogTab === 1 && (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Vaccine Name</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {vaccinationHistory
                        .filter((vh) => vh.patientId === currentPatient?.id)
                        .map((vh) => (
                          <TableRow key={vh.id}>
                            <TableCell>{vh.vaccineName}</TableCell>
                            <TableCell>{vh.date}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              {dialogTab === 2 && (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Comment</TableCell>
                        <TableCell>Rating</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {feedback
                        .filter((f) => f.patientId === currentPatient?.id)
                        .map((f) => (
                          <TableRow key={f.id}>
                            <TableCell>{f.date}</TableCell>
                            <TableCell>{f.comment}</TableCell>
                            <TableCell>{f.rating}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              {dialogTab === 3 && currentPatient?.role === "customer" && (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Full Name</TableCell>
                        <TableCell>Date of Birth</TableCell>
                        <TableCell>Vaccine Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentPatient.children?.map((child) => (
                        <TableRow key={child.id}>
                          <TableCell>{child.fullName}</TableCell>
                          <TableCell>{child.dateOfBirth}</TableCell>
                          <TableCell>{child.vaccineStatus}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              {dialogTab === 3 && currentPatient?.role === "child" && currentPatient.parent && (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Full Name</TableCell>
                        <TableCell>Date of Birth</TableCell>
                        <TableCell>Phone</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{currentPatient.parent.fullName}</TableCell>
                        <TableCell>{currentPatient.parent.dateOfBirth}</TableCell>
                        <TableCell>{currentPatient.parent.phone}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {dialogMode === "delete" ? (
            <Button onClick={handleDeletePatient} color="error">
              Delete
            </Button>
          ) : (
            <Button onClick={handleSubmit(onSubmit)} color="primary">
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default PatientList

