import { Category } from "./category";

export interface Vaccine {
  category: Category
  id: number,
  title: string,
  description: string,
  price: number,
  discount: number,
  discountPrice: number,
  quantity: number,
  isActive: true,
  isPriority: true,
  numberOfDoses: number,
  minAgeMonths: number,
  maxAgeMonths: number,
  minDaysBetweenDoses: number,
  manufacturer: string,
  targetGroup: string,
  schedule: string,
  sideEffects: string,
  image: string,
  categoryId: number,
  categoryName: string,
}

export interface VaccineOrder {
  date: string 
  id: number
  name: string
  price: number
  status: "DA_HUY"
}

export enum VaccineStatus {
  DA_HUY = "DA_HUY",
  CHUA_TIEM = "CHUA_TIEM",
  DA_TIEM = "DA_TIEM",
  DA_LEN_LICH = "DA_LEN_LICH",
  QUA_HAN = "QUA_HAN",
}