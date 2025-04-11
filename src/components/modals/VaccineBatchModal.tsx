"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "@/utils/axiosConfig"
import { useStore } from "@/store"
import { toast } from "sonner"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import {
  Command,
  CommandList,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"

interface VaccineBatchModalProps {
  onClose: () => void
}

export function VaccineBatchModal({ onClose }: VaccineBatchModalProps) {
  const vaccines = useStore(state => state.product.vaccines)
  const { fetchVaccines } = useStore.getState()

  const [productId, setProductId] = useState<number | null>(null)
  const [selectedVaccineName, setSelectedVaccineName] = useState<string>("")
  const [batchNumber, setBatchNumber] = useState("")
  const [expirationDate, setExpirationDate] = useState("")
  const [quantity, setQuantity] = useState<number>(0)

  const [open, setOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!productId) {
      toast.error("Please select a vaccine!")
      return
    }
    if (!batchNumber) {
      toast.error("Please enter batch number!")
      return
    }
    if (!expirationDate) {
      toast.error("Please enter expiration date!")
      return
    }

    try {
      const token = localStorage.getItem("token") || ""

      await axios.post(
        `/product/addProductDetails/${productId}`,
        {
          batchNumber,
          expirationDate,
          quantity,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      await fetchVaccines()
      toast.success("New vaccine batch added successfully!")
      onClose()
    } catch (error) {
      console.error("Error creating vaccine batch:", error)
      toast.error("Failed to create vaccine batch.")
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter New Vaccine Batch</DialogTitle>
          <DialogDescription>
            Provide the batch information below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Select Vaccine</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedVaccineName
                    ? selectedVaccineName
                    : "Search Vaccine..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[300px]">
                <Command>
                  <CommandInput placeholder="Type vaccine name..." />
                  <CommandList>
                    <CommandEmpty>No vaccine found.</CommandEmpty>
                    <CommandGroup heading="Vaccines">
                      {vaccines.map((v) => (
                        <CommandItem
                          key={v.id}
                          onSelect={() => {
                            setProductId(v.id)
                            setSelectedVaccineName(v.title)
                            setOpen(false)
                          }}
                        >
                          {v.title}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Batch Number */}
          <div className="space-y-2">
            <Label htmlFor="batchNumber">Batch Number</Label>
            <Input
              id="batchNumber"
              name="batchNumber"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              required
            />
          </div>

          {/* Expiration Date */}
          <div className="space-y-2">
            <Label htmlFor="expirationDate">Expiration Date</Label>
            <Input
              id="expirationDate"
              name="expirationDate"
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              required
            />
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </div>

          <DialogFooter className="space-x-2 pt-4 flex justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
