"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Consult, ConsultStatus } from "@/types/consult"
import axios from "@/utils/axiosConfig"

export default function ConsultsPage() {
  const [consults, setConsults] = useState<Consult[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedConsult, setSelectedConsult] = useState<Consult | null>(null)

  useEffect(() => {
    const loadConsults = async () => {
      try {
        const response = await axios.get("/consult")
        const data = response.data as Consult[] | []
        setConsults(data)
      } catch (error) {
        console.error("Failed to fetch consults:", error)
      } finally {
        setLoading(false)
      }
    }

    loadConsults()
  }, [])

  const handleStatusChange = (id: number, status: ConsultStatus) => {
    setConsults(consults.map((consult) => (consult.id === id ? { ...consult, status } : consult)))
  }


  const getStatusBadge = (status: ConsultStatus) => {
    switch (status) {
      case "NEW":
        return <Badge className="bg-blue-500">New</Badge>
      case "DONE":
        return <Badge className="bg-green-500">Completed</Badge>
      case "CANCELLED":
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const columns: ColumnDef<Consult>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "parentName",
      header: "Parent Name",
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
  ]

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Consultation Requests</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading consults...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={consults}
          searchColumn="parentName"
          searchPlaceholder="Search by parent name..."
        />
      )}
    </div>
  )
}

