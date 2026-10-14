export const JWT_SECRET = process.env.JWT_SECRET || 'rail_express_super_secret_key_2026';
export const PORT = process.env.PORT || 5000;

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export enum TravelClass {
  FIRST_AC = '1A',
  SECOND_AC = '2A',
  THIRD_AC = '3A',
  SLEEPER = 'SL',
  CHAIR_CAR = 'CC',
  SECOND_SEATING = '2S'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  LADIES = 'LADIES',
  DISABLED = 'DISABLED'
}

export enum BerthType {
  LOWER = 'LOWER',
  MIDDLE = 'MIDDLE',
  UPPER = 'UPPER',
  SIDE_LOWER = 'SIDE_LOWER',
  SIDE_UPPER = 'SIDE_UPPER',
  WINDOW = 'WINDOW',
  AISLE = 'AISLE'
}

export enum PaymentMethod {
  UPI = 'UPI',
  CARD = 'CARD',
  NET_BANKING = 'NET_BANKING'
}
