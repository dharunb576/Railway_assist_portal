import { TravelClass, BookingStatus, SeatStatus, BerthType, PaymentMethod, UserRole } from '../config/constants';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phone: string;
  createdAt: string;
}

export interface Station {
  id: string;
  code: string;
  name: string;
  city: string;
  state: string;
}

export interface ScheduleStop {
  id: string;
  trainId: string;
  stationId: string;
  stationCode: string;
  stationName: string;
  stationOrder: number;
  arrivalTime: string;
  departureTime: string;
  dayNumber: number;
  distanceFromSourceKm: number;
}

export interface Train {
  id: string;
  number: string;
  name: string;
  trainType: string; // 'Superfast', 'Express', 'Vande Bharat', 'Rajdhani', 'Shatabdi'
  sourceStationId: string;
  destinationStationId: string;
  sourceCode: string;
  sourceName: string;
  destinationCode: string;
  destinationName: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  distanceKm: number;
  availableClasses: TravelClass[];
  totalCoaches: number;
}

export interface Coach {
  id: string;
  trainId: string;
  coachCode: string; // e.g. 'S1', 'B1', 'A1'
  classType: TravelClass;
  totalSeats: number;
}

export interface Seat {
  id: string;
  coachId: string;
  trainId: string;
  seatNumber: number;
  berthType: BerthType;
  status: SeatStatus;
}

export interface Passenger {
  id: string;
  bookingId: string;
  name: string;
  age: number;
  gender: string;
  berthPreference: string;
  idType: string;
  idNumber: string;
  coachCode: string;
  seatNumber: number;
  fare: number;
}

export interface Booking {
  id: string;
  pnr: string;
  userId: string;
  trainId: string;
  sourceStationId: string;
  destinationStationId: string;
  sourceCode: string;
  sourceName: string;
  destinationCode: string;
  destinationName: string;
  journeyDate: string;
  travelClass: TravelClass;
  totalPassengers: number;
  baseFare: number;
  reservationCharge: number;
  gstAmount: number;
  totalFare: number;
  status: BookingStatus;
  createdAt: string;
  passengers?: Passenger[];
  train?: Train;
}

export interface Payment {
  id: string;
  bookingId: string;
  pnr: string;
  paymentMethod: PaymentMethod;
  transactionId: string;
  amount: number;
  status: 'SUCCESS' | 'FAILED' | 'REFUNDED';
  paidAt: string;
}

export interface Ticket {
  id: string;
  bookingId: string;
  pnr: string;
  issuedAt: string;
  qrData: string;
}

export interface Cancellation {
  id: string;
  bookingId: string;
  pnr: string;
  cancelReason: string;
  refundAmount: number;
  cancellationFee: number;
  cancelledAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
