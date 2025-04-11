"use client"
import { useState } from "react"
import { ModalWrapper } from "@/components/ui/modal-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import axios from "@/utils/axiosConfig"
import { Trash2, PlusCircle } from "lucide-react"

interface ChildCondition {
  conditionName: string
  note: string
}

interface ChildData {
  childName: string
  childBod: string
  childGender: string
  relationshipType: string
  childHeight: number
  childWeight: number
  childConditions: ChildCondition[]
}

interface FormData {
  username: string
  fullname: string
  email: string
  phone: string
  bod: string
  gender: string
  children: ChildData[]
}

interface CreatePatientModalProps {
  onClose: () => void
}

export function CreatePatientModal({ onClose }: CreatePatientModalProps) {
  const [step, setStep] = useState<number>(1)

  const [formData, setFormData] = useState<FormData>({
    username: "",
    fullname: "",
    email: "",
    phone: "",
    bod: "",
    gender: "",
    children: [],
  })

  const [childData, setChildData] = useState<ChildData>({
    childName: "",
    childBod: "",
    childGender: "",
    relationshipType: "",
    childHeight: 0,
    childWeight: 0,
    childConditions: [],
  })

  const [showConditionForm, setShowConditionForm] = useState(false)
  const [newCondition, setNewCondition] = useState<ChildCondition>({
    conditionName: "",
    note: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleParentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleChildChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setChildData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handlePreviousStep = () => {
    setStep(1)
  }

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault()

    if (!childData.childName) {
      toast.error("Please fill in the child's name.")
      return
    }

    setFormData((prev) => ({
      ...prev,
      children: [...prev.children, childData],
    }))

    setChildData({
      childName: "",
      childBod: "",
      childGender: "",
      relationshipType: "",
      childHeight: 0,
      childWeight: 0,
      childConditions: [],
    })

    setShowConditionForm(false)
    setNewCondition({ conditionName: "", note: "" })

    toast.success("Child added successfully.")
  }

  const handleRemoveChild = (index: number) => {
    setFormData((prev) => {
      const updatedChildren = [...prev.children]
      updatedChildren.splice(index, 1)
      return { ...prev, children: updatedChildren }
    })
  }

  const handleAddCondition = () => {
    if (!newCondition.conditionName) {
      toast.error("Please enter a condition name.")
      return
    }

    setChildData((prev) => ({
      ...prev,
      childConditions: [...prev.childConditions, newCondition],
    }))

    setNewCondition({ conditionName: "", note: "" })
    setShowConditionForm(false)
  }

  const handleRemoveCondition = (index: number) => {
    setChildData((prev) => {
      const updatedConditions = [...prev.childConditions]
      updatedConditions.splice(index, 1)
      return { ...prev, childConditions: updatedConditions }
    })
  }

  const handleConditionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewCondition((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitAll = async () => {
    setIsSubmitting(true)
    try {
      await axios.post("/manage/create-customer", formData, {
        headers: { "Content-Type": "application/json" },
      })
      toast.success("Patient created successfully")
      onClose()
    } catch (error) {
      console.error("Error creating patient:", error)
      const errorMsg = error instanceof Error ? error.message : "Failed to create patient"
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ModalWrapper
      title="Create Patient"
      description="Fill in the details to create a new patient (customer)"
      isOpen={true}
      onClose={onClose}
    >
      {step === 1 && (
        <form onSubmit={handleNextStep} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleParentChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullname">Full Name</Label>
            <Input
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleParentChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleParentChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleParentChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bod">Date of Birth</Label>
            <Input
              id="bod"
              name="bod"
              type="date"
              value={formData.bod}
              onChange={handleParentChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleParentChange}
              className="w-full rounded-md border border-gray-300 p-2"
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Next (Children Info)</Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <form onSubmit={handleAddChild} className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="childName">Child Name</Label>
              <Input
                id="childName"
                name="childName"
                value={childData.childName}
                onChange={handleChildChange}
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="w-1/2 space-y-1">
                <Label htmlFor="childBod">Date of Birth</Label>
                <Input
                  id="childBod"
                  name="childBod"
                  type="date"
                  value={childData.childBod}
                  onChange={handleChildChange}
                  required
                />
              </div>

              <div className="flex-1 space-y-1">
                <Label htmlFor="childGender">Gender</Label>
                <select
                  id="childGender"
                  name="childGender"
                  value={childData.childGender}
                  onChange={handleChildChange}
                  className="w-full rounded-md border border-gray-300 p-2"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex-1 space-y-1">
                <Label htmlFor="relationshipType">Relationship Type</Label>
                <select
                  id="relationshipType"
                  name="relationshipType"
                  value={childData.relationshipType}
                  onChange={handleChildChange}
                  className="w-full rounded-md border border-gray-300 p-2"
                  required
                >
                  <option value="">Select relationship</option>
                  <option value="Cha/Mẹ">Cha/Mẹ</option>
                  <option value="Ông/Bà">Ông/Bà</option>
                  <option value="Anh/Chị">Anh/Chị</option>
                  <option value="Chú/Thím">Chú/Thím</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 space-y-1">
                <Label htmlFor="childHeight">Height</Label>
                <Input
                  id="childHeight"
                  name="childHeight"
                  type="number"
                  value={childData.childHeight}
                  onChange={handleChildChange}
                />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="childWeight">Weight</Label>
                <Input
                  id="childWeight"
                  name="childWeight"
                  type="number"
                  value={childData.childWeight}
                  onChange={handleChildChange}
                />
              </div>
            </div>

            {childData.childConditions.length > 0 && (
              <div className="mt-3 space-y-2">
                <Label>Current Conditions:</Label>
                {childData.childConditions.map((condition, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border p-2 rounded-md"
                  >
                    <div>
                      <p className="font-medium">{condition.conditionName}</p>
                      {condition.note && (
                        <p className="text-sm text-muted-foreground">
                          {condition.note}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCondition(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {!showConditionForm ? (
              <Button
                variant="outline"
                className="mt-2 flex items-center"
                onClick={() => setShowConditionForm(true)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Condition
              </Button>
            ) : (
              <div className="border p-3 rounded-md mt-2 space-y-4">
                <h4 className="font-medium">Add a Condition</h4>
                <div className="space-y-2">
                  <Label htmlFor="conditionName">Condition Name</Label>
                  <Input
                    id="conditionName"
                    name="conditionName"
                    value={newCondition.conditionName}
                    onChange={handleConditionChange}
                    placeholder="e.g., Hen suyễn"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Note</Label>
                  <Textarea
                    id="note"
                    name="note"
                    value={newCondition.note}
                    onChange={handleConditionChange}
                    placeholder="e.g., Được chẩn đoán từ nhỏ"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="button" onClick={handleAddCondition} size="sm">
                    Add
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowConditionForm(false)
                      setNewCondition({ conditionName: "", note: "" })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" type="submit">
                Add Child
              </Button>
            </div>
          </form>

          {formData.children.length > 0 && (
            <div>
              <p className="font-semibold mt-4">Current Children:</p>
              {formData.children.map((child, index) => (
                <Card key={index} className="p-4 mt-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{child.childName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {child.childGender}, {child.childBod},{" "}
                        {child.relationshipType}
                      </p>
                      {(child.childHeight || child.childWeight) && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Height: {child.childHeight}, Weight:{" "}
                          {child.childWeight}
                        </p>
                      )}
                      {child.childConditions.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Conditions:</p>
                          <ul className="text-sm list-disc pl-5">
                            {child.childConditions.map((condition, condIndex) => (
                              <li key={condIndex}>
                                {condition.conditionName}
                                {condition.note && (
                                  <span className="text-muted-foreground">
                                    {" "}
                                    - {condition.note}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveChild(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handlePreviousStep}>
              Previous
            </Button>
            <Button
              type="button"
              onClick={handleSubmitAll}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit All"}
            </Button>
          </div>
        </div>
      )}
    </ModalWrapper>
  )
}
