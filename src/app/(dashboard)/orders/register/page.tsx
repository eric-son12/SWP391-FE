"use client"
import React, { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { ChevronsUpDown, Trash2, Edit2 } from "lucide-react"
import { toast } from "sonner"
import axios from "@/utils/axiosConfig"
import { useStore } from "@/store"
import { Patient } from "@/models/user"
import { format } from "date-fns"

import { DateTimePicker } from "@/components/DateTimePicker"
import { Vaccine } from "@/types/vaccine"
import { Validate } from "@/utils/validate"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterVaccinationPage() {
  const router = useRouter()

  const { allUsers } = useStore((state) => state.profile)
  const allVaccines = useStore((state) => state.product.vaccines) as Vaccine[]
  const { fetchAllUsers, fetchVaccines } = useStore.getState()

  useEffect(() => {
    fetchAllUsers()
    fetchVaccines()
  }, [fetchAllUsers, fetchVaccines])

  const [selectedParentId, setSelectedParentId] = useState<number | "">("")
  const [selectedParent, setSelectedParent] = useState<Patient | null>(null)
  const [parentPopoverOpen, setParentPopoverOpen] = useState(false)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [mobileNo, setMobileNo] = useState("")

  const [selectedList, setSelectedList] = useState<{
    childId: number
    childName: string
    vaccines: Vaccine[]
  }[]>([])

  const [tempChildId, setTempChildId] = useState<number | "">("")
  const [tempChildName, setTempChildName] = useState("")
  const [tempChildVaccines, setTempChildVaccines] = useState<Vaccine[]>([])
  const [childPopoverOpen, setChildPopoverOpen] = useState(false)
  const [vaccinePopoverOpen, setVaccinePopoverOpen] = useState(false)
  const [suggestedVaccines, setSuggestedVaccines] = useState<Vaccine[]>([])

  const [searchTerm, setSearchTerm] = useState("")
  const [childSearch, setChildSearch] = useState("")
  const [vaccineSearch, setVaccineSearch] = useState("")

  const [vaccinationDate, setVaccinationDate] = useState<Date | undefined>()

  const [showConfirm, setShowConfirm] = useState(false)

  const filteredUsers = useMemo(() => {
    return (
      allUsers?.filter(
        (user) =>
          user.id.toString().includes(searchTerm) ||
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
      ) || []
    )
  }, [allUsers, searchTerm])

  const usedChildIds = selectedList.map((c) => c.childId)
  const childFiltered = useMemo(() => {
    if (!selectedParent) return []
    return (
      selectedParent.children?.filter((child) => {
        if (usedChildIds.includes(child.childId)) return false

        const matchName =
          child.fullname.toLowerCase().includes(childSearch.toLowerCase()) ||
          String(child.childId).includes(childSearch)

        return matchName
      }) || []
    )
  }, [selectedParent, childSearch, usedChildIds])

  const filteredVaccines = useMemo(() => {
    return (
      allVaccines?.filter((v) => {
        if (tempChildVaccines.some((tv) => tv.id === v.id)) return false
        const matchName =
          v.title.toLowerCase().includes(vaccineSearch.toLowerCase()) ||
          String(v.id).includes(vaccineSearch)
        return matchName
      }) || []
    )
  }, [allVaccines, vaccineSearch, tempChildVaccines])

  useEffect(() => {
    if (!selectedParentId) {
      setSelectedParent(null)
      setFirstName("")
      setLastName("")
      setEmail("")
      setMobileNo("")
      setSelectedList([])
      setTempChildId("")
      setTempChildName("")
      setTempChildVaccines([])
      return
    }

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`/user/${selectedParentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const p: Patient = response.data
        setSelectedParent(p)

        const [fname, ...rest] = p.fullname.split(" ")
        setFirstName(fname || "")
        setLastName(rest.join(" ") || "")
        setEmail(p.email || "")
        setMobileNo(p.phone || "")

        setSelectedList([])
        setTempChildId("")
        setTempChildName("")
        setTempChildVaccines([])
      } catch (error) {
        console.error("Error fetching user details", error)
        toast.error("Failed to load user details")
      }
    }

    fetchUser()
  }, [selectedParentId])

  const handleSelectChild = async (childId: number) => {
    if (!childId) return

    try {
      const response = await axios.get(`/order/vaccine/suggestion/staff`, {
        params: { childId: childId },
      })
      setSuggestedVaccines(response.data.result || [])
    } catch (err) {
      console.error("Error getSuccessVaccine:", err)
    }
  }

  const addVaccineToChild = (vaccine: Vaccine) => {
    setVaccinePopoverOpen(false)
    setTempChildVaccines((prev) => {
      if (prev.find((x) => x.id === vaccine.id)) return prev
      return [...prev, vaccine]
    })
  }

  const removeVaccineFromChild = (vaccineId: number) => {
    setTempChildVaccines((prev) => prev.filter((v) => v.id !== vaccineId))
  }

  const handleConfirmChild = () => {
    if (!tempChildId) {
      toast("Select a child", {
        description: "Please pick a child first",
      })
      return
    }
    if (tempChildVaccines.length === 0) {
      toast("No vaccines", {
        description: "Please select at least one vaccine for this child",
      })
      return
    }

    setSelectedList((prev) => {
      const withoutThisChild = prev.filter((c) => c.childId !== tempChildId)
      return [
        ...withoutThisChild,
        {
          childId: Number(tempChildId),
          childName: tempChildName,
          vaccines: [...tempChildVaccines],
        },
      ]
    })

    setTempChildId("")
    setTempChildName("")
    setTempChildVaccines([])
  }

  const handleEditChild = (childId: number) => {
    const found = selectedList.find((c) => c.childId === childId)
    if (!found) return
    setTempChildId(found.childId)
    setTempChildName(found.childName)
    setTempChildVaccines(found.vaccines)
    setSelectedList((prev) => prev.filter((c) => c.childId !== childId))
  }

  const handleRemoveChildSelection = (childId: number) => {
    setSelectedList((prev) => prev.filter((c) => c.childId !== childId))
  }

  const totalPrice = useMemo(() => {
    return selectedList.reduce((acc, child) => {
      const sumVaccines = child.vaccines.reduce((sum, v) => sum + v.price, 0)
      return acc + sumVaccines
    }, 0)
  }, [selectedList])

  const canCreate = selectedParent && vaccinationDate && selectedList.length > 0

  const handleSubmit = async () => {
    if (!canCreate) {
      toast.error("Please fill out all required fields.")
      return
    }

    const childProductMap: { [childId: number]: number[] } = {}
    selectedList.forEach((c) => {
      childProductMap[c.childId] = c.vaccines.map((v) => v.id)
    })

    const vaccinationDateISO = format(vaccinationDate as Date, "yyyy-MM-dd'T'HH:mm:ss")
    const payload = {
      parentId: selectedParent?.id,
      firstName,
      lastName,
      email,
      mobileNo,
      childProductMap,
      vaccinationdate: vaccinationDateISO,
    }

    try {
      const token = localStorage.getItem("token")
      await axios.post("/order/staff/create-by-product", payload, {
        headers: { Authorization: `Bearer ${token}` },
        params: { parentId: selectedParent?.id },
      })

      toast.success("Order created successfully")

      setSelectedParentId("")
      setSelectedParent(null)
      setFirstName("")
      setLastName("")
      setEmail("")
      setMobileNo("")
      setSelectedList([])
      setTempChildId("")
      setTempChildName("")
      setTempChildVaccines([])
      setVaccinationDate(undefined)
      // router.push("/orders")
    } catch (err) {
      console.error(err)
      toast.error("Failed to create order")
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-4 text-2xl font-bold">Register Vaccination</h1>

      <Card>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <div className="mb-6 space-y-2">
                <Label>Select Parent</Label>
                <Popover open={parentPopoverOpen} onOpenChange={setParentPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                      onClick={() => setParentPopoverOpen(true)}
                    >
                      {selectedParentId
                        ? allUsers.find((u) => u.id === selectedParentId)?.fullname
                        : "Select parent..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[768px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search parent..."
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                      />
                      <CommandEmpty>No parent found.</CommandEmpty>
                      <CommandGroup className="max-h-60 overflow-y-auto">
                        {filteredUsers.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={`${user.id} ${user.username} ${user.fullname}`}
                            onSelect={() => {
                              setSelectedParentId(user.id)
                              setParentPopoverOpen(false)
                            }}
                          >
                            {user.fullname} (ID: {user.id})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {selectedParent && (
                <div className="mb-4 rounded-md border p-4 space-y-4">
                  <Label className="mb-2">Guardian Info</Label>
                  <div className="flex gap-4">
                    <div className="w-1/2 space-y-2">
                      <Label>First Name</Label>
                      <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="w-1/2 space-y-2">
                      <Label>Last Name</Label>
                      <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1/2 space-y-2">
                      <Label>Email</Label>
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="w-1/2 space-y-2">
                      <Label>Mobile No</Label>
                      <Input type="tel" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {selectedParent && (
                <>
                  <Label className="mb-2">Pick a Child & Vaccines</Label>
                  <div className="space-y-4 rounded-md border p-4">
                    <div>
                      <Label>Choose Child</Label>
                      <Popover open={childPopoverOpen} onOpenChange={setChildPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="mt-1 w-full justify-between"
                            onClick={() => setChildPopoverOpen(true)}
                          >
                            {tempChildId
                              ? selectedParent.children?.find((c) => c.childId === tempChildId)?.fullname
                              : "Select Child..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[768px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search child..."
                              value={childSearch}
                              onValueChange={setChildSearch}
                            />
                            <CommandEmpty>No child found.</CommandEmpty>
                            <CommandGroup className="max-h-60 overflow-y-auto">
                              {childFiltered.map((child) => (
                                <CommandItem
                                  key={child.childId}
                                  value={child.childId.toString()}
                                  onSelect={() => {
                                    setTempChildId(child.childId)
                                    setTempChildName(child.fullname)
                                    handleSelectChild(child.childId)
                                    setChildPopoverOpen(false)
                                  }}
                                >
                                  {child.fullname}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label>Select Vaccine</Label>
                      <Popover open={vaccinePopoverOpen} onOpenChange={setVaccinePopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="mt-1 w-full justify-between">
                            Add a vaccine...
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent side="top" className="w-[calc(50svw-4rem)] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search vaccine..."
                              value={vaccineSearch}
                              onValueChange={setVaccineSearch}
                            />
                            <CommandEmpty>No vaccine found.</CommandEmpty>
                            <CommandList className="max-h-60 overflow-y-auto">
                              {suggestedVaccines.length > 0 && (
                                <CommandGroup heading="Suggested">
                                  {suggestedVaccines.map((v) => (
                                    <CommandItem
                                      key={v.id}
                                      value={`${v.title} ${v.id}`}
                                      onSelect={() => addVaccineToChild(v)}
                                      className="flex w-full items-center justify-between"
                                    >
                                      <p>{v.title}</p>
                                      <span>{Validate.formatPrice(v.price)}</span>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              )}
                              <CommandGroup heading="All Vaccines">
                                {filteredVaccines.map((v) => (
                                  <CommandItem
                                    key={v.id}
                                    value={`${v.title} ${v.id}`}
                                    onSelect={() => addVaccineToChild(v)}
                                    className="flex w-full items-center justify-between"
                                  >
                                    <p>{v.title}</p>
                                    <span>{Validate.formatPrice(v.price)}</span>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {tempChildVaccines.length > 0 && (
                      <div className="mt-2 space-y-2">
                        <p className="text-sm font-medium">Vaccines Selected:</p>
                        <div className="space-y-2">
                          {tempChildVaccines.map((v) => (
                            <div
                              key={v.id}
                              className="flex items-center justify-between rounded-md border p-2"
                            >
                              <span>
                                {v.title} - {Validate.formatPrice(v.price)}
                              </span>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeVaccineFromChild(v.id)}
                              >
                                <Trash2 className="mr-1 h-4 w-4" />
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button variant="outline" onClick={handleConfirmChild}>
                        Confirm This Child
                      </Button>
                    </div>
                  </div>


                </>
              )}

              <div className="my-4 space-y-2">
                <Label>Vaccination Date</Label>
                <DateTimePicker date={vaccinationDate} setDate={setVaccinationDate} showBtn={false} />
              </div>
            </div>

            <div className="col-span-1 space-y-2">
              <Label className="mb-2">Children to Vaccinate</Label>
              {selectedList.length > 0 && (
                <div>
                  {selectedList.map((entry) => (
                    <div key={entry.childId} className="mb-2 flex flex-col gap-2 rounded-md border p-3">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{entry.childName}</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditChild(entry.childId)}>
                            <Edit2 className="mr-1 h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleRemoveChildSelection(entry.childId)}>
                            <Trash2 className="mr-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <ul className="list-disc pl-4">
                        {entry.vaccines.map((v) => (
                          <li key={v.id} className="flex justify-between">
                            <p>{v.title}</p>
                            <p>{Validate.formatPrice(v.price)}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <Button className="flex-1" onClick={handleSubmit} disabled={!canCreate}>
                  Create Order
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
