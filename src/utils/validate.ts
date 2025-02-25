export class Validate {
  static email(mail: string) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
  }

  static formatPrice(price: number): string {
    return new Intl.NumberFormat("vi-VN").format(price);
  }
}