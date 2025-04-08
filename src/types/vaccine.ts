export interface Vaccine {
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
  date: string | number[] 
  id: number
  name: string
  price: number
  status: string
}

export enum VaccineStatus {
  DA_LEN_LICH = "Đã lên lịch",
  DA_TIEM = "Đã tiêm",
  CHUA_TIEM = "Chưa tiêm",
  QUA_HAN = "Quá hạn",
  DA_HUY = "Đã huỷ",
}

export enum TargetGroup {
  AGE_0_3 = "0-3 tháng",
  AGE_4_6 = "4-6 tháng",
  AGE_7_12 = "7-12 tháng",
  AGE_13_24 = "13-24 tháng",
  AGE_25_PLUS = "Trên 25 tháng"
}