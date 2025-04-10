"use client"
import { useState } from "react"
import axios from "@/utils/axiosConfig"
import { Mail, Phone, User } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { VaccineStatus } from "@/types/vaccine"
import { NormalizedUser } from "@/types/order"

interface OrderDetailsModalProps {
  vaccination: NormalizedUser
  onClose: () => void
}

export function VaccinationDetailsModal({ vaccination, onClose }: OrderDetailsModalProps) {
  const [orderDetail, setOrderDetail] = useState<NormalizedUser>(vaccination)
  const updateVaccineStatus = async (id: string, newStatus: VaccineStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/order/${id}/status`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          orderDetailId: id,
          status: newStatus,
        },
      });
      toast.success("Status updated successfully");
      setOrderDetail((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          children: Object.values(prev.children).map((child) => ({
            ...child,
            vaccines: child.vaccines.map((v) =>
              v.orderDetailId.toString() === id
                ? { ...v, orderDetailStatus: newStatus }
                : v
            ),
          })),
        };
      });
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Failed to update status");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] min-w-[60svw] overflow-y-auto">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Customer Information</h3>

            <div className="space-y-2 rounded-md border p-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {orderDetail.firstName} {orderDetail.lastName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{orderDetail.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{orderDetail.mobileNo}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Order Items</h3>
            {orderDetail && Object.values(orderDetail.children).map((child) => (
              <Accordion key={child.childId} type="multiple" className="rounded-xl border-2 border-solid mb-2">
                <AccordionItem value={`child-${child.childId}`}>
                  <AccordionTrigger className="ml-4">
                    {child.childName}
                  </AccordionTrigger>
                  <AccordionContent className="pb-0 mx-2 mb-2">
                    {child.vaccines && child.vaccines.length > 0 ? (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow className="flex ">
                              <TableHead className="content-center flex-1">Vaccine</TableHead>
                              <TableHead className="w-[250px] content-center">Doctor</TableHead>
                              <TableHead className="w-[125px] content-center">Status</TableHead>
                            </TableRow>
                          </TableHeader>

                          <TableBody>
                            {child.vaccines.map((vaccine, idx) => (
                              <TableRow key={idx} className="flex justify-between">
                                <TableCell className="font-medium flex-1">{vaccine.productName}</TableCell>
                                <TableCell className="w-[250px] font-medium">{vaccine.staffName || "-"}</TableCell>
                                <TableCell className="w-[125px]">
                                  {["DA_TIEM", "DA_HUY"].includes(vaccine.orderDetailStatus as VaccineStatus) ? (
                                    vaccine.orderDetailStatus === "DA_TIEM" ? (
                                      <Badge className="bg-green-100 text-green-800">
                                        Đã tiêm
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-red-100 text-red-800">
                                        Đã huỷ
                                      </Badge>
                                    )
                                  ) : (
                                    <Select
                                      value={vaccine.orderDetailStatus}
                                      onValueChange={(newStatus: VaccineStatus) =>
                                        updateVaccineStatus(vaccine.orderDetailId.toString(), newStatus)
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Object.entries(VaccineStatus).map(([key, value]) => (
                                          <SelectItem key={key} value={key}>
                                            {value}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  )}
                                </TableCell>

                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="p-4 text-sm text-muted-foreground">No vaccines found for this child.</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}

          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
