"use client"
import { useState } from "react"
import { ModalWrapper } from "@/components/ui/modal-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import axios from "@/utils/axiosConfig"
import { PlusCircle, Trash2 } from "lucide-react"
import { Textarea } from "../ui/textarea"

interface ChildCondition {
  conditionName: string
  note: string
}

interface ChildData {
  parentId: number,
  fullname: string
  bod: string
  gender: string
  relationshipType: string
  height: number
  weight: number
  childConditions: ChildCondition[]
}

export function CreateChildModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState<ChildData>({
    parentId: 0,
    fullname: "",
    bod: "",
    gender: "",
    height: 0,
    weight: 0,
    relationshipType: "CHA_ME",
    childConditions: [],
  })

  const [showConditionForm, setShowConditionForm] = useState(false)
  const [newCondition, setNewCondition] = useState<ChildCondition>({
    conditionName: "",
    note: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddCondition = () => {
    if (!newCondition.conditionName) {
      toast.error("Please enter a condition name.")
      return
    }

    setFormData((prev) => ({
      ...prev,
      childConditions: [...prev.childConditions, newCondition],
    }))

    setNewCondition({ conditionName: "", note: "" })
    setShowConditionForm(false)
  }

  const handleRemoveCondition = (index: number) => {
    setFormData((prev) => {
      const updatedConditions = [...prev.childConditions]
      updatedConditions.splice(index, 1)
      return { ...prev, childConditions: updatedConditions }
    })
  }

  const handleConditionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewCondition((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (!formData.parentId) {
        toast.error("Please enter Parent ID")
        return
      }
      const fd = new FormData()
      fd.append("fullname", formData.fullname)
      fd.append("bod", formData.bod)
      fd.append("gender", formData.gender)
      fd.append("height", formData.height.toString())
      fd.append("weight", formData.weight.toString())
      fd.append("relationshipType", formData.relationshipType)
      const response =  await axios.post(`/manage/children/create/${Number(formData.parentId)}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (response.status === 200) {
        formData.childConditions.map((condition) => {
          axios.post(`/underlying-conditions/user/${response.data.result.childId}`, condition, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
          })
        })
      }
      toast.success("Child created successfully")
      onClose()
    } catch (error) {
      console.error("Error creating child:", error)
      const errorMsg = error instanceof Error ? error.message : "Failed to create child"
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ModalWrapper
      title="Create Child"
      description="Fill in the details to create a new child record"
      isOpen={true}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          {/* Parent ID */}
          <div className="flex-1 space-y-2">
            <Label htmlFor="parentId">Parent ID</Label>
            <Input
              id="parentId"
              name="parentId"
              type="number"
              value={formData.parentId}
              onChange={handleChange}
              required
              className="w-full"
            />
          </div>
          {/* Relationship Type */}
          <div className="space-y-2">
            <Label htmlFor="relationshipType">Relationship Type</Label>
            <select
              id="relationshipType"
              name="relationshipType"
              value={formData.relationshipType}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, relationshipType: e.target.value }))
              }
              className="w-full rounded-md border border-gray-300 p-2"
              required
            >
              <option value="CHA_ME">Cha/Mẹ</option>
              <option value="ONG_BA">Ông/Bà</option>
              <option value="ANH_CHI">Anh/Chị</option>
              <option value="CHU_THIEM">Chú/Thím</option>
            </select>
          </div>
        </div>
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullname">Full Name</Label>
          <Input
            id="fullname"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
        </div>
        {/* Date of Birth */}
        <div className="space-y-2">
          <Label htmlFor="bod">Date of Birth</Label>
          <Input
            id="bod"
            name="bod"
            type="date"
            max={new Date().toISOString().split('T')[0]}
            value={formData.bod}
            onChange={handleChange}
            required
          />
        </div>
        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, gender: e.target.value }))
            }
            className="w-full rounded-md border border-gray-300 p-2"
            required
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex gap-2">
          {/* Height */}
          <div className="flex-1 space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              name="height"
              type="number"
              value={formData.height}
              onChange={handleChange}
              required
            />
          </div>
          {/* Weight */}
          <div className="flex-1 space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {formData.childConditions.length > 0 && (
          <div className="mt-3 space-y-2">
            <Label>Current Conditions:</Label>
            {formData.childConditions.map((condition, index) => (
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
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Child"}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  )
}