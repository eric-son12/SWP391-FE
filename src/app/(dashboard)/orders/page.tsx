"use client"
import { useState, useEffect, useCallback } from "react"
import axios from "@/utils/axiosConfig"
import type { ColumnDef } from "@tanstack/react-table"
import { Eye, ShoppingCart, CreditCard, Calendar, Plus, Ban, Syringe } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrderDetailsModal } from "@/components/modals/OrderDetail"
import { RegisterVaccinationModal } from "@/components/modals/RegisterVaccinationModal"
import { CancelOrderModal } from "@/components/modals/CancelOrderModal"
import { VaccinationDetailsModal } from "@/components/modals/VaccinationsDetail"
import { toast } from "sonner";
import { Validate } from "@/utils/validate"
import type { NormalizedSchedule, NormalizedUser, Order, OrderDetail } from "@/types/order"
import { format } from "date-fns"
import { VaccineStatus } from "@/types/vaccine"

const normalizeSchedule = (scheduleData: OrderDetail[]): NormalizedSchedule => {
  let index = 1;

  const normalized = scheduleData.reduce((acc, item) => {
    const email = item.email;

    if (!acc[email]) {
      acc[email] = {
        id: index++,
        email,
        firstName: item.firstName,
        lastName: item.lastName,
        mobileNo: item.mobileNo,
        children: {},
      };
    }

    const childId = item.childId;
    if (!acc[email].children[childId]) {
      acc[email].children[childId] = {
        childId,
        childName: item.childName,
        vaccines: [],
      };
    }

    acc[email].children[childId].vaccines.push({
      orderDetailId: item.orderdetialid,
      productName: item.productName,
      orderDetailStatus: item.orderDetailStatus,
      vaccinationDate: item.vaccinationDate,
      price: item.price,
      quantity: item.quantity,
      orderId: item.orderId,
      staffId: item.staffId,
      staffName: item.staffName,
    });

    return acc;
  }, {} as NormalizedSchedule);

  return normalized;
}

export default function OrdersPage() {
  const [token, setToken] = useState<string | null>(null)
  const [activePeriod, setActivePeriod] = useState<"All" | "Today">("Today");

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null)

  const [vaccinationSchedules, setVaccinationSchedules] = useState<NormalizedUser[]>([]);
  const [selectedVaccination, setSelectedVaccination] = useState<NormalizedUser | null>(null)

  const loadOrders = useCallback(async () => {
    try {
      const response = await axios.get("/order/all-orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data: Order[] = response.data.result || []
      setOrders(data)
    } catch (error) {
      console.error('Error:', error)
      toast.error("Failed to load orders")
    } finally {
      setLoading(false)
    }
  }, [])

  const scheduleByDate = useCallback(async () => {
    const today = format(new Date(), "yyyy-MM-dd")

    try {
      const response = await axios.get(`/order/staff/schedule/by-date`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { date: today }
      })
      const data: OrderDetail[] = response.data.result || []

      const obj: NormalizedSchedule = normalizeSchedule(data);
      const arrayOfUsers = Object.values(obj);
      setVaccinationSchedules(arrayOfUsers);
    } catch (error) {
      console.error('Error:', error)
      toast.error("Failed to load orders")
    }
  }, [])


  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    setToken(storedToken)
  }, [])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      loadOrders(),
      scheduleByDate(),
    ])
    setLoading(false)
  }, [loadOrders])

  const handleVaccineStatusChange = (
    orderId: string,
    orderDetailId: string,
    newStatus: VaccineStatus
  ) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) => {
        if (o.orderId !== orderId) return o
  
        const updatedOrderDetails = o.orderDetails.map((child) => ({
          ...child,
          vaccines: child.vaccines.map((v) =>
            v.id.toString() === orderDetailId
              ? { ...v, status: newStatus }
              : v
          ),
        }))
  
        const allVaccines = updatedOrderDetails.flatMap((child) => child.vaccines)
        const totalVaccines = allVaccines.length
        const countHuy = allVaccines.filter((v) => v.status === "DA_HUY").length
  
        let newOrderStatus = o.status
        if (countHuy === totalVaccines && totalVaccines > 0) {
          newOrderStatus = "CANCELED"
        } else if (countHuy > 0) {
          newOrderStatus = "CANCELED_PARTIAL"
        }
  
        return {
          ...o,
          orderDetails: updatedOrderDetails,
          status: newOrderStatus,
        }
      })
    )
  }
  

  const handleViewOrder = (orderId: string) => {
    const order = orders.find((o) => o.orderId === orderId)
    if (order) {
      setSelectedOrder(order)
    }
  }

  const handleViewOrderVaccination = (id: number) => {
    const vaccinationId = vaccinationSchedules.find((v) => v.id === id)
    if (vaccinationId) {
      setSelectedVaccination(vaccinationId)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "canceled_partial":
        return <Badge className="bg-amber-100 text-amber-500">Canceled Partial</Badge>
      case "cancel":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "orderId",
      header: "Order ID",
    },
    {
      accessorKey: "paymentType",
      header: "Payment Method",
    },
    {
      accessorKey: "totalPrice",
      header: "Total",
      cell: ({ row }) => {
        const price = row.getValue("totalPrice") as number
        return new Intl.NumberFormat("vn-VN", {
          style: "currency",
          currency: "vnd",
        }).format(price)
      },
    },
    {
      accessorKey: "orderDate",
      header: "Order Date",
      cell: ({ row }) => {
        const date = row.getValue("orderDate") as string
        return new Date(date).toLocaleDateString()
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return <span className="capitalize">{getStatusBadge(status)}</span>
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const orderId = row.getValue("orderId") as string
        const status = (row.getValue("status") as string).toLowerCase() 

        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="hover:cursor-pointer" onClick={() => handleViewOrder(orderId)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>

            {["success", "paid", "canceled_partial", "cancel", "cancelled"].includes(status) ?
              null :
              < Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 hover:cursor-pointer" onClick={() => setOrderToCancel(orderId)}>
                <Ban className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            }
          </div >
        )
      },
    },
  ]

  const columnsToday: ColumnDef<NormalizedUser>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "lastName",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "mobileNo",
      header: "Phone",
    },
    {
      accessorKey: "children",
      header: "Children",
      cell: ({ row }) => {
        const children = row.getValue("children")

        return <ul className="list-disc">
          {Object.values(children as Record<number, { childId: number; childName: string }>).map((child) => (
            <li key={child.childId}>
              {child.childName}
            </li>
          ))}
        </ul>
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.getValue("id") as number

        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="hover:cursor-pointer" onClick={() => handleViewOrderVaccination(id)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
          </div>
        )
      },
    },
  ]

  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)
  const pendingOrders = orders.filter((order) => order.status.toLowerCase() === "pending").length
  const vaccinationSchedulesToday = vaccinationSchedules.length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders Management</h1>
        <Button onClick={() => window.open("/orders/register", "_blank")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5 text-blue-600" />
              <div className="text-2xl font-bold">{totalOrders}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-green-600" />
              <p className="text-2xl font-bold">
                {Validate.formatPrice(totalRevenue)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-yellow-600" />
              <div className="text-2xl font-bold">{pendingOrders}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Vaccinations Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Syringe className="mr-2 h-5 w-5 text-red-500" />
              <div className="text-2xl font-bold">{vaccinationSchedulesToday}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <Tabs
          defaultValue="Today"
          value={activePeriod}
          onValueChange={(v) => setActivePeriod(v as "All" | "Today")}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Orders</CardTitle>

              <TabsList>
                <TabsTrigger className="w-16" value="All">All</TabsTrigger>
                <TabsTrigger className="w-16" value="Today">Today</TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          <CardContent>
            {/* Tab Content All */}
            <TabsContent value="All">
              {loading ? (
                <div className="flex h-40 items-center justify-center">
                  <p>Loading orders...</p>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={orders}
                  searchColumn="orderId"
                  searchPlaceholder="Search by order ID..."
                />
              )}
            </TabsContent>

            {/* Tab Content Today */}
            <TabsContent value="Today">
              {loading ? (
                <div className="flex h-40 items-center justify-center">
                  <p>Loading orders...</p>
                </div>
              ) : (
                <DataTable
                  columns={columnsToday}
                  data={vaccinationSchedules}
                  searchColumn="email"
                  searchPlaceholder="Search by email..."
                />
              )}
            </TabsContent>
          </CardContent>
        </Tabs>

      </Card>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onVaccineStatusChange={(orderDetailId, newStatus) =>
            handleVaccineStatusChange(selectedOrder.orderId, orderDetailId, newStatus)
          }
        />
      )}

      {selectedVaccination && (
        <VaccinationDetailsModal
          vaccination={selectedVaccination}
          onClose={() => setSelectedVaccination(null)}
        />
      )}

      {/* {showCreateOrderModal && (
        <RegisterVaccinationModal
          open={showCreateOrderModal}
          onClose={() => setShowCreateOrderModal(false)}
        />
      )} */}

      {orderToCancel && (
        <CancelOrderModal
          orderId={orderToCancel}
          onClose={() => {
            setOrderToCancel(null)
            loadOrders()
          }}
        />
      )}
    </div>
  )
}


