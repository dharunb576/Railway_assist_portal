import { JSONDatabase } from '../database/db';
import { Booking, Passenger, Payment, Ticket, Cancellation, Notification } from '../domain/types';
import { BookingStatus } from '../config/constants';

export class BookingRepository {
  private db: JSONDatabase;

  constructor() {
    this.db = JSONDatabase.getInstance();
  }

  public findAll(): Booking[] {
    return this.db.getData().bookings;
  }

  public findById(id: string): Booking | undefined {
    return this.db.getData().bookings.find((b) => b.id === id);
  }

  public findByPNR(pnr: string): Booking | undefined {
    return this.db.getData().bookings.find((b) => b.pnr.trim() === pnr.trim());
  }

  public findByUserId(userId: string): Booking[] {
    return this.db.getData().bookings.filter((b) => b.userId === userId);
  }

  public getPassengersForBooking(bookingId: string): Passenger[] {
    return this.db.getData().passengers.filter((p) => p.bookingId === bookingId);
  }

  public getPaymentForBooking(bookingId: string): Payment | undefined {
    return this.db.getData().payments.find((p) => p.bookingId === bookingId);
  }

  public getTicketForBooking(bookingId: string): Ticket | undefined {
    return this.db.getData().tickets.find((t) => t.bookingId === bookingId);
  }

  public createBooking(
    booking: Booking,
    passengers: Passenger[],
    payment: Payment,
    ticket: Ticket
  ): Booking {
    this.db.getData().bookings.push(booking);
    this.db.getData().passengers.push(...passengers);
    this.db.getData().payments.push(payment);
    this.db.getData().tickets.push(ticket);

    // Create Notification
    const notif: Notification = {
      id: `notif_${Date.now()}`,
      userId: booking.userId,
      title: 'Booking Confirmed!',
      message: `Your booking for ${booking.trainId} (PNR: ${booking.pnr}) on ${booking.journeyDate} is confirmed.`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    this.db.getData().notifications.push(notif);

    this.db.save();
    return booking;
  }

  public cancelBooking(bookingId: string, reason: string, cancellationFee: number): Cancellation | undefined {
    const booking = this.findById(bookingId);
    if (!booking) return undefined;

    booking.status = BookingStatus.CANCELLED;

    const refundAmount = Math.max(0, booking.totalFare - cancellationFee);

    const cancellation: Cancellation = {
      id: `cnl_${Date.now()}`,
      bookingId: booking.id,
      pnr: booking.pnr,
      cancelReason: reason,
      refundAmount,
      cancellationFee,
      cancelledAt: new Date().toISOString()
    };

    this.db.getData().cancellations.push(cancellation);

    // Update payment record
    const payment = this.getPaymentForBooking(bookingId);
    if (payment) {
      payment.status = 'REFUNDED';
    }

    // Release seats status
    const passengers = this.getPassengersForBooking(bookingId);
    passengers.forEach((pax) => {
      const seat = this.db.getData().seats.find((s) => s.trainId === booking.trainId && s.seatNumber === pax.seatNumber);
      if (seat) {
        seat.status = 'AVAILABLE' as any;
      }
    });

    this.db.save();
    return cancellation;
  }
}
