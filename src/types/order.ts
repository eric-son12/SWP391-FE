import { VaccineOrder } from "./vaccine"

export interface OrderDetail {
  staffName: string | null
  staffId: number | null
  childId: number
  childName: string
  vaccines: VaccineOrder[]
  orderdetialid: number
  productName: string
  quantity: number
  orderId: string
  vaccinationDate: string
  price: number
  firstName: string
  lastName: string
  email: string
  mobileNo: string
  orderDetailStatus: string
}

export interface Order {
  email: string
  firstName: string
  lastName: string
  mobileNo: string
  orderDate: string
  orderId: string
  paymentType: string
  status: string
  totalPrice: number
  orderDetails: OrderDetail[]
}

export interface OrdersResponse {
  code: number
  message: string
  result: Order[]
}

export interface NormalizedSchedule {
  [email: string]: NormalizedUser;
}

export interface NormalizedUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  children: {
    [childId: number]: NormalizedChild;
  };
}

export interface NormalizedChild {
  childId: number;
  childName: string;
  vaccines: NormalizedVaccine[];
}

export interface NormalizedVaccine {
  orderDetailId: number;
  productName: string;
  orderDetailStatus: string;
  vaccinationDate: string;
  price: number;
  quantity: number;
  orderId: string;
  staffId: number | null;
  staffName: string | null;
}
