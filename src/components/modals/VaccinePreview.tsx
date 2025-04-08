"use client"
import { useCallback, useEffect, useState } from "react"
import { AlertCircle, Package, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PreviewCard } from "@/components/ui/preview-card"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Vaccine, VaccineBatch } from "@/types/vaccine"
import { Validate } from "@/utils/validate"
import axios from "@/utils/axiosConfig"

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
    const data = await res.data.result
    setBatchList(data)
  }, [vaccine.id])

  useEffect(() => {
    fetchBatches()
  }, [fetchBatches])

  const columns: ColumnDef<VaccineBatch>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "batchNumber",
      header: "Batch Number",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "expirationDate",
      header: "Expiration Date",
    },
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
            <div className="col-span-3 space-y-1">
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
