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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material"
import { useForm, Controller } from "react-hook-form"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

interface Vaccine {
  id: number
  name: string
  description: string
  price: number
  service: "single" | "combo" | "modify"
}

const initialVaccines: Vaccine[] = [
  { id: 1, name: "Flu Shot", description: "Annual influenza vaccine", price: 25, service: "single" },
  { id: 2, name: "COVID-19 Vaccine", description: "Coronavirus vaccine", price: 0, service: "single" },
  {
    id: 3,
    name: "Travel Vaccine Package",
    description: "Combo of vaccines for international travel",
    price: 150,
    service: "combo",
  },
  {
    id: 4,
    name: "Childhood Vaccine Series",
    description: "Set of essential childhood vaccines",
    price: 200,
    service: "combo",
  },
  { id: 5, name: "Booster Shots", description: "Modify existing vaccination schedule", price: 50, service: "modify" },
]

const VaccineList: React.FC = () => {
  const [vaccines, setVaccines] = useState<Vaccine[]>(initialVaccines)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentVaccine, setCurrentVaccine] = useState<Vaccine | null>(null)
  const [filterService, setFilterService] = useState<"all" | "single" | "combo" | "modify">("all")

  const { control, handleSubmit, reset } = useForm<Vaccine>()

  const handleOpenDialog = (vaccine?: Vaccine) => {
    setCurrentVaccine(vaccine || null)
    reset(vaccine || { id: 0, name: "", description: "", price: 0, service: "single" })
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setCurrentVaccine(null)
  }

  const onSubmit = (data: Vaccine) => {
    if (currentVaccine) {
      setVaccines(vaccines.map((v) => (v.id === currentVaccine.id ? { ...data, id: currentVaccine.id } : v)))
    } else {
      setVaccines([...vaccines, { ...data, id: vaccines.length + 1 }])
    }
    handleCloseDialog()
  }

  const handleDeleteVaccine = (id: number) => {
    setVaccines(vaccines.filter((v) => v.id !== id))
  }

  const filteredVaccines = filterService === "all" ? vaccines : vaccines.filter((v) => v.service === filterService)

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Vaccine List
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Filter Service</InputLabel>
          <Select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value as typeof filterService)}
            label="Filter Service"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="single">Single</MenuItem>
            <MenuItem value="combo">Combo</MenuItem>
            <MenuItem value="modify">Modify</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
          Add Vaccine
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVaccines.map((vaccine) => (
              <TableRow key={vaccine.id}>
                <TableCell>{vaccine.name}</TableCell>
                <TableCell>{vaccine.description}</TableCell>
                <TableCell>${vaccine.price.toFixed(2)}</TableCell>
                <TableCell>{vaccine.service}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenDialog(vaccine)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteVaccine(vaccine.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{currentVaccine ? "Edit Vaccine" : "Add Vaccine"}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: "Name is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Name"
                  fullWidth
                  margin="normal"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              defaultValue=""
              rules={{ required: "Description is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="price"
              control={control}
              defaultValue={0}
              rules={{ required: "Price is required", min: 0 }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Price"
                  fullWidth
                  margin="normal"
                  type="number"
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="service"
              control={control}
              defaultValue="single"
              rules={{ required: "Service is required" }}
              render={({ field }) => (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Service</InputLabel>
                  <Select {...field} label="Service">
                    <MenuItem value="single">Single</MenuItem>
                    <MenuItem value="combo">Combo</MenuItem>
                    <MenuItem value="modify">Modify</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

export default VaccineList

