"use client"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import axios from "@/utils/axiosConfig"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Accordion, AccordionItem, AccordionContent } from "@/components/ui/accordion"
import { ChildOrderDetail } from "@/types/user"
import { Validate } from "@/utils/validate"

interface OrderDetailType {
  firstName: string
  lastName: string
  orderDetails: ChildOrderDetail[]
}
interface ReactionDialogProps {
  open: boolean
  onClose: () => void
  orderDetailId: number | null
}

export function ReactionDialog({ open, onClose, orderDetailId }: ReactionDialogProps) {
  const [loading, setLoading] = useState(false)
  const [orderDetail, setOrderDetail] = useState<OrderDetailType | null>(null)
  const [handlingNote, setHandlingNote] = useState("")

  useEffect(() => {
    if (!orderDetailId || !open) {
      setOrderDetail(null)
      setHandlingNote("")
      return
    }
    setLoading(true)
    fetchOrderDetail(orderDetailId)
      .then((data) => {
        setOrderDetail(data.data.result)
        setHandlingNote(data.data.result.orderDetails[0].vaccines[0].reactions[0].handlingNote)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => setLoading(false))
  }, [orderDetailId, open])

  const fetchOrderDetail = async (orderDetailId: number) => {
    const data = await axios.get(`/order/order-detail/${orderDetailId}`)
    if (!data) {
      throw new Error("Failed to fetch order detail")
    }
    return data
  }

  const handleSubmitNote = async () => {
    if (!orderDetailId || !orderDetail) return
  
    const reactionId =
      orderDetail.orderDetails[0]?.vaccines[0]?.reactions[0]?.id
  
    if (!reactionId) {
      console.error("No reaction ID found")
      return
    }
  
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      await axios.put(`/reaction/handle/${reactionId}`, {
        handlingNote,
      }, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        params: {
          orderDetailId,
        },
      })
      onClose()
    } catch (error) {
      console.error("Error submitting handling note", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reaction Feedback</DialogTitle>
        </DialogHeader>

        {loading && <p className="text-sm">Loading...</p>}

                {!loading && orderDetail && (
          <div className="space-y-3">
            <p><strong>Name:</strong> {orderDetail.firstName} {orderDetail.lastName}</p>

            <div >
              {orderDetail && orderDetail.orderDetails.map((child: ChildOrderDetail) => (
                <Accordion type='multiple' defaultValue={[`child-${child.childId}`]} key={child.childId} className="mb-2">
                  <AccordionItem value={`child-${child.childId}`}>
                    <AccordionContent>
                      {child.vaccines && child.vaccines.length > 0 ? (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Vaccine</TableHead>
                                <TableHead>Price</TableHead>
                              </TableRow>
                            </TableHeader>

                            <TableBody>
                              {child.vaccines.map((vaccine, idx) => {
                                return (<TableRow key={idx}>
                                  <TableCell className="font-medium">{vaccine.name}</TableCell>
                                  <TableCell>{Validate.formatPrice(vaccine.price)}</TableCell>
                                </TableRow>
                                )
                              }
                              )}
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

            <Label htmlFor="reaction">Reaction</Label>
            <Textarea
              readOnly
              id="reaction"
              value={orderDetail.orderDetails[0].vaccines[0].reactions[0].symptoms}
              onChange={(e) => setHandlingNote(e.target.value)}
            />

            <Label htmlFor="handlingNote">Handling Note</Label>
            <Textarea
              id="handlingNote"
              placeholder="Enter handling note for the child's reaction..."
              value={handlingNote}
              readOnly
              onChange={(e) => setHandlingNote(e.target.value)}
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmitNote} disabled={loading}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
