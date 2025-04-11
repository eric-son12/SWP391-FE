"use client"
import { useCallback, useEffect, useState } from "react"
import { AlertCircle, Edit, Package, SquarePen, Trash2, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PreviewCard } from "@/components/ui/preview-card"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Vaccine, VaccineBatch } from "@/types/vaccine"
import { Validate } from "@/utils/validate"
import axios from "@/utils/axiosConfig"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { EditInput } from "./EditInput"

function ImageCarousel({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0)

  if (!images || images.length === 0) return null

  const prevImage = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const nextImage = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative w-full h-64 border rounded-md overflow-hidden">
      <img
        src={images[current]}
        alt={`Image ${current + 1}`}
        className="object-contain w-full h-full"
      />
      {
        images.length > 1 && <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-200 p-1 rounded"
          >
            ‹
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 p-1 rounded"
          >
            ›
          </button>
        </>
      }
    </div>
  )
}

interface VaccinePreviewProps {
  vaccine: Vaccine
  onClose: () => void
}

export function VaccinePreview({ vaccine, onClose }: VaccinePreviewProps) {
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showFullSideEffects, setShowFullSideEffects] = useState(false)
  const [showFullSchedule, setShowFullSchedule] = useState(false)
  const [batchList, setBatchList] = useState<VaccineBatch[]>([])
  const [editingBatchId, setEditingBatchId] = useState<number | null>(null)
  const [focusedField, setFocusedField] = useState<"batchNumber" | "expirationDate" | "quantity" | null>(null)

  const [editedBatch, setEditedBatch] = useState<{
    batchNumber: string
    expirationDate: string
    quantity: number
  } | null>(null)

  const [condition, setCondition] = useState<string | null>(null)
  const [editingCondition, setEditingCondition] = useState(false);
  const [editedCondition, setEditedCondition] = useState<string>("");

  const vaccineId = vaccine.id
  const categoryName = vaccine.categoryName || "No Category"
  const minAge = vaccine.minAgeMonths ?? 0
  const maxAge = vaccine.maxAgeMonths ?? 0
  const betweenDoses = vaccine.minDaysBetweenDoses ?? 0

  const fetchBatches = useCallback(async () => {
    const res = await axios.get(`/product/getProductDetails/${vaccine.id}`, {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
      params: { productId: vaccine.id }
    })
    const data = await res.data.result || null
    setBatchList(data)
  }, [vaccine.id])

  const getVaccineCondition = useCallback(async () => {
    const res = await axios.get(`/underlying-conditions/product/${vaccine.id}`, {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
      params: { vaccineId: vaccine.id }
    })
    const dataRaw = await res.data
    const data = dataRaw.map((item: { condition: any }) => item.condition).join(', ');

    setCondition(data)
  }, [vaccine.id])

  useEffect(() => {
    Promise.all([
      fetchBatches(),
      getVaccineCondition()
    ])
  }, [vaccine.id, fetchBatches, getVaccineCondition])

  useEffect(() => {
    if (condition !== null) {
      setEditedCondition(condition);
    }
  }, [condition]);

  const handleSaveCondition = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/underlying-conditions/product/${vaccine.id}`, { condition: editedCondition }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCondition(editedCondition);
      toast.success("Underlying disease updated successfully!");
      setEditingCondition(false);
    } catch (error) {
      console.error("Failed to update underlying disease", error);
      toast.error("Failed to update underlying disease");
    }
  };

  const startEdit = (batch: VaccineBatch) => {
    setEditingBatchId(batch.id)
    setEditedBatch({
      batchNumber: batch.batchNumber,
      expirationDate: batch.expirationDate,
      quantity: batch.quantity
    })
  }

  const cancelEdit = () => {
    setEditingBatchId(null)
    setEditedBatch(null)
  }

  const handleSaveBatch = async (id: number) => {
    try {
      const token = localStorage.getItem("token")
      if (!editedBatch) return

      const body = {
        batchNumber: editedBatch.batchNumber,
        expirationDate: editedBatch.expirationDate,
        quantity: editedBatch.quantity
      }
      await axios.patch(`/product/updateProductDetails/${id}`, body, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBatchList((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...editedBatch } : b))
      )
      toast.success("Batch updated successfully!")
      cancelEdit()
    } catch (error) {
      console.error("Failed to update batch", error)
      toast.error("Failed to update batch")
    }
  }

  const handleDeleteBatch = async (id: number) => {
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`/product/deleteProductDetails/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBatchList((prev) => prev.filter((b) => b.id !== id))
      toast.success("Batch deleted successfully!")
      if (editingBatchId === id) {
        cancelEdit()
      }
    } catch (error) {
      console.error("Failed to delete batch", error)
      toast.error("Failed to delete batch")
    }
  }

  const columns: ColumnDef<VaccineBatch>[] = [
    {
      accessorKey: "id",
      header: "ID"
    },
    {
      accessorKey: "batchNumber",
      header: "Batch Number",
      cell: ({ row }) => {
        if (editingBatchId === row.original.id) {
          return (
            <EditInput
              type="text"
              value={editedBatch?.batchNumber ?? row.original.batchNumber}
              onChange={(e) =>
                setEditedBatch((prev) =>
                  prev
                    ? { ...prev, batchNumber: e.target.value }
                    : {
                      batchNumber: e.target.value,
                      expirationDate: row.original.expirationDate,
                      quantity: row.original.quantity
                    }
                )
              }
              autoFocus={focusedField === "batchNumber"}
              onFocus={() => setFocusedField("batchNumber")}
            />
          )
        }
        return row.original.batchNumber
      }
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => {
        if (editingBatchId === row.original.id) {
          return (
            <EditInput
              type="number"
              value={String(editedBatch?.quantity ?? row.original.quantity)}
              onChange={(e) =>
                setEditedBatch((prev) =>
                  prev
                    ? { ...prev, quantity: parseInt(e.target.value, 10) }
                    : {
                      batchNumber: row.original.batchNumber,
                      expirationDate: row.original.expirationDate,
                      quantity: parseInt(e.target.value, 10)
                    }
                )
              }
              autoFocus={focusedField === "quantity"}
              onFocus={() => setFocusedField("quantity")}
            />
          )
        }
        return row.original.quantity
      }
    },
    {
      accessorKey: "expirationDate",
      header: "Expiration Date",
      cell: ({ row }) => {
        if (editingBatchId === row.original.id) {
          return (
            <EditInput
              type="date"
              value={editedBatch?.expirationDate ?? row.original.expirationDate}
              onChange={(e) =>
                setEditedBatch((prev) =>
                  prev
                    ? { ...prev, expirationDate: e.target.value }
                    : {
                      batchNumber: row.original.batchNumber,
                      expirationDate: e.target.value,
                      quantity: row.original.quantity
                    }
                )
              }
              autoFocus={focusedField === "expirationDate"}
              onFocus={() => setFocusedField("expirationDate")}
            />
          )
        }
        return row.original.expirationDate
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        if (editingBatchId === row.original.id) {
          return (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSaveBatch(row.original.id)}
              >
                Save
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => cancelEdit()}
              >
                Cancel
              </Button>
            </div>
          )
        }
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => startEdit(row.original)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500"
              onClick={() => handleDeleteBatch(row.original.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      }
    }
  ]

  return (
    <PreviewCard
      className="h-[85svh] min-w-[80svw] overflow-auto"
      title={vaccine.title}
      onClose={onClose}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="outline" className="px-3 py-1">
              ID: {vaccineId}
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              SKU: {batchList[0]?.sku}
            </Badge>
          </div>
          <div className="flex gap-2">
            {/* Discount logic */}
            {vaccine.discount && vaccine.discount > 0 ? (
              <>
                <Badge variant="outline" className="line-through text-gray-500">
                  {Validate.formatPrice(vaccine.price)}
                </Badge>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  {Validate.formatPrice(
                    vaccine.discountPrice ||
                    vaccine.price - (vaccine.price * vaccine.discount) / 100
                  )}
                </Badge>
              </>
            ) : (
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                {Validate.formatPrice(vaccine.price)}
              </Badge>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-500">Category</h3>
          <p className="text-sm">{categoryName}</p>
        </div>

        {/* Description */}
        {vaccine.description && (
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="text-sm">
              {showFullDescription || vaccine.description.length <= 150
                ? vaccine.description
                : `${vaccine.description.substring(0, 150)}...`}
              {vaccine.description.length > 150 && (
                <Button
                  variant="link"
                  className="h-auto p-0 text-blue-600"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? "Show less" : "Show more"}
                </Button>
              )}
            </p>
          </div>
        )}

        <div className={`space-y-1`}>
          <h3 className="flex items-center gap-1 text-sm font-medium text-gray-500">
            Underlying Disease
            {!editingCondition && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditingCondition(true);
                  setEditedCondition(condition || "");
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </h3>
          {editingCondition ? (
            <div className="flex gap-2 items-center">
              {/* Use your preferred Input component; here I'm using a simple input */}
              <Input
                value={editedCondition}
                onChange={(e) => setEditedCondition(e.target.value)}
                className="border p-1"
              />
              <Button variant="outline" size="sm" onClick={handleSaveCondition}>
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={() => setEditingCondition(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <p className="text-sm">{condition || "-"}</p>
          )}
        </div>

        <Separator />

        {Array.isArray(vaccine.imageList) && vaccine.imageList.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Images</h3>
            <ImageCarousel images={vaccine.imageList || []} />
          </div>
        )}

        <Separator />
        {/* Batch List */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">Batch List</h3>
          <DataTable
            columns={columns}
            data={batchList}
          />
        </div>

        <Separator />

        <div className="grid grid-cols-4 gap-4">

          {vaccine.manufacturer && (
            <div className="col-span-2 space-y-1">
              <h3 className="flex items-center gap-1 text-sm font-medium text-gray-500">
                <Package className="h-4 w-4" /> Manufacturer
              </h3>
              <p className="text-sm">{vaccine.manufacturer}</p>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500">Quantity</h3>
            <p className="text-sm">{vaccine.quantity}</p>
          </div>

          {/* Target Groups (mảng) */}
          {Array.isArray(vaccine.targetGroup) && vaccine.targetGroup.length > 0 && (
            <div className="space-y-1">
              <h3 className="flex items-center gap-1 text-sm font-medium text-gray-500">
                <Users className="h-4 w-4" /> Target Group
              </h3>
              <ul className="list-disc">
                {vaccine.targetGroup.map((group, index) => (
                  <li key={index} className="ml-4">
                    {group}
                  </li>
                ))}
              </ul>
            </div>
          )}


          {/* Min/Max Age, Min Days Between Doses */}
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500">Min Age (months)</h3>
            <p className="text-sm">{minAge}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500">Max Age (months)</h3>
            <p className="text-sm">{maxAge}</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500">Min Days Between Doses</h3>
            <p className="text-sm">{betweenDoses}</p>
          </div>

          {/* Number of Doses */}
          {vaccine.numberOfDoses && (
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">Number of Doses</h3>
              <p className="text-sm">{vaccine.numberOfDoses}</p>
            </div>
          )}

          {/* Schedule */}
          {vaccine.schedule && (
            <div className="col-span-4 space-y-1">
              <h3 className="text-sm font-medium text-gray-500">Schedule</h3>
              <p className="text-sm">
                {showFullSchedule || vaccine.schedule.length <= 100
                  ? vaccine.schedule
                  : `${vaccine.schedule.substring(0, 100)}...`}
                {vaccine.schedule.length > 100 && (
                  <Button
                    variant="link"
                    className="h-auto p-0 text-blue-600"
                    onClick={() => setShowFullSchedule(!showFullSchedule)}
                  >
                    {showFullSchedule ? "Show less" : "Show more"}
                  </Button>
                )}
              </p>
            </div>
          )}

          {/* Side Effects */}
          {vaccine.sideEffects && (
            <div className="col-span-2 space-y-1">
              <h3 className="flex items-center gap-1 text-sm font-medium text-gray-500">
                <AlertCircle className="h-4 w-4" /> Side Effects
              </h3>
              <p className="text-sm">
                {showFullSideEffects || vaccine.sideEffects.length <= 100
                  ? vaccine.sideEffects
                  : `${vaccine.sideEffects.substring(0, 100)}...`}
                {vaccine.sideEffects.length > 100 && (
                  <Button
                    variant="link"
                    className="h-auto p-0 text-blue-600"
                    onClick={() => setShowFullSideEffects(!showFullSideEffects)}
                  >
                    {showFullSideEffects ? "Show less" : "Show more"}
                  </Button>
                )}
              </p>
            </div>
          )}

          {/* Priority / Active */}
          <div className="flex gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">Active</h3>
              <p className="text-sm">{vaccine.isActive ? "Yes" : "No"}</p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500">Priority</h3>
              <p className="text-sm">{vaccine.isPriority ? "Yes" : "No"}</p>
            </div>
          </div>

        </div>
      </div>
    </PreviewCard>
  )
}
