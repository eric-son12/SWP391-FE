"use client"

import { useState, useEffect } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Consult, ConsultStatus } from "@/types/consult"
import axios from "@/utils/axiosConfig"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ConsultsPage() {
  const [consults, setConsults] = useState<Consult[]>([])
  const [loading, setLoading] = useState(true)

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

  const handleStatusChange = async (id: number, status: ConsultStatus) => {
    if (!["NEW", "DONE", "CANCELLED"].includes(status)) {
      console.error("Invalid status value provided");
      return;
    }
    try {
      await axios.put(`/consult/${id}`, null, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
        params: {
          id: id,
          status: status,
        }
      });
      setConsults((prevConsults) =>
        prevConsults.map((consult) =>
          consult.id === id ? { ...consult, status } : consult
        )
      );
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Failed to update consult status", error);
      toast.error("Failed to update status");
    }
  };

  const StatusSelect = ({
    consultId,
    currentStatus,
  }: {
    consultId: number;
    currentStatus: ConsultStatus;
  }) => {
    const [value, setValue] = useState<ConsultStatus>(currentStatus);

    const disabled = currentStatus === "DONE" || currentStatus === "CANCELLED";

    const statusColors: Record<ConsultStatus, string> = {
      NEW: "bg-blue-500",
      DONE: "bg-green-500",
      CANCELLED: "bg-red-500",
    };

    const onValueChange = async (newStatus: ConsultStatus) => {
      setValue(newStatus);
      await handleStatusChange(consultId, newStatus);
    };

    return (
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          className={`${statusColors[value]} ${disabled ? "cursor-not-allowed" : ""
            } text-white`}
        >
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="NEW">New</SelectItem>
          <SelectItem value="DONE">Completed</SelectItem>
          <SelectItem value="CANCELLED">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    );
  };

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
      accessorKey: "note",
      header: "Note",
      cell: ({ row }) => (
        <div className="flex-1 whitespace-normal break-words">
          {row.original.note}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusSelect
          consultId={row.original.id}
          currentStatus={row.original.status}
        />
      ),

    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Consultation Requests</h1>
      </div>

      <Card>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  )
}

