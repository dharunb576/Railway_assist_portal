import { BookingRepository } from '../repositories/BookingRepository';
import { TrainRepository } from '../repositories/TrainRepository';
import { UserRepository } from '../repositories/UserRepository';
import { FareCalculatorService } from './FareCalculatorService';
import { TicketFactory } from '../domain/patterns/TicketFactory';
import { PaymentStrategyFactory } from '../domain/strategies/PaymentStrategy';
import { TravelClass, BookingStatus, PaymentMethod } from '../config/constants';
import { Booking, Passenger, Payment, Ticket, Cancellation } from '../domain/types';

export interface CreateBookingDTO {
  userId: string;
  trainId: string;
  sourceStationId: string;
  destinationStationId: string;
  journeyDate: string;
  travelClass: TravelClass;
  passengers: Array<{
    name: string;
    age: number;
    gender: string;
    berthPreference: string;
    idType: string;
    idNumber: string;
    seatNumber?: number;
  }>;
  paymentMethod: PaymentMethod;
  paymentDetails: Record<string, any>;
}

/**
 * Controller & Service Layer (GRASP Principle - High Cohesion, Controller)
 * Orchestrates train booking creation, fare verification, payment processing, ticket generation, and cancellation.
 */
export class BookingService {
  private bookingRepo: BookingRepository;
  private trainRepo: TrainRepository;
  private userRepo: UserRepository;
  private fareCalculator: FareCalculatorService;

  constructor() {
    this.bookingRepo = new BookingRepository();
    this.trainRepo = new TrainRepository();
    this.userRepo = new UserRepository();
    this.fareCalculator = new FareCalculatorService();
  }

  public async createBooking(dto: CreateBookingDTO): Promise<{ booking: Booking; ticket: Ticket; payment: Payment }> {
    const train = this.trainRepo.findById(dto.trainId);
    if (!train) throw new Error('Train not found');

    if (dto.passengers.length === 0) {
      throw new Error('At least one passenger details required');
    }

    // Calculate fare
    const fareBreakdown = this.fareCalculator.calculateFare(
      train.distanceKm,
      dto.travelClass,
      dto.passengers.length
    );

    // Process payment using Strategy Pattern
    const paymentStrategy = PaymentStrategyFactory.getStrategy(dto.paymentMethod);
    const paymentResult = await paymentStrategy.processPayment(fareBreakdown.grandTotal, dto.paymentDetails);

    if (!paymentResult.success) {
      throw new Error(`Payment processing failed: ${paymentResult.message}`);
    }

    // Generate PNR using TicketFactory
    const pnr = TicketFactory.generatePNR();
    const bookingId = `bk_${Date.now()}`;

    // Get coach code
    const coaches = this.trainRepo.getCoachesForTrain(train.id);
    const targetCoach = coaches.find((c) => c.classType === dto.travelClass);
    const coachCode = targetCoach ? targetCoach.coachCode : 'S1';

    // Map Passengers
    const passengerEntities: Passenger[] = dto.passengers.map((pax, idx) => ({
      id: `pax_${bookingId}_${idx + 1}`,
      bookingId,
      name: pax.name,
      age: Number(pax.age),
      gender: pax.gender,
      berthPreference: pax.berthPreference,
      idType: pax.idType || 'Aadhaar',
      idNumber: pax.idNumber || 'XXXX-XXXX-XXXX',
      coachCode,
      seatNumber: pax.seatNumber || (idx + 10),
      fare: fareBreakdown.farePerPassenger
    }));

    // Create Booking domain model
    const booking: Booking = {
      id: bookingId,
      pnr,
      userId: dto.userId,
      trainId: train.id,
      sourceStationId: dto.sourceStationId || train.sourceStationId,
      destinationStationId: dto.destinationStationId || train.destinationStationId,
      sourceCode: train.sourceCode,
      sourceName: train.sourceName,
      destinationCode: train.destinationCode,
      destinationName: train.destinationName,
      journeyDate: dto.journeyDate,
      travelClass: dto.travelClass,
      totalPassengers: dto.passengers.length,
      baseFare: fareBreakdown.totalBaseFare,
      reservationCharge: fareBreakdown.totalReservationCharge,
      gstAmount: fareBreakdown.totalGst,
      totalFare: fareBreakdown.grandTotal,
      status: BookingStatus.CONFIRMED,
      createdAt: new Date().toISOString(),
      passengers: passengerEntities,
      train
    };

    const payment: Payment = {
      id: `pay_${bookingId}`,
      bookingId,
      pnr,
      paymentMethod: dto.paymentMethod,
      transactionId: paymentResult.transactionId,
      amount: fareBreakdown.grandTotal,
      status: 'SUCCESS',
      paidAt: new Date().toISOString()
    };

    // Create Ticket using TicketFactory
    const ticket = TicketFactory.createTicket(booking);

    // Save transactionally in Repository
    this.bookingRepo.createBooking(booking, passengerEntities, payment, ticket);

    return { booking, ticket, payment };
  }

  public getBookingByPNR(pnr: string): { booking: Booking; passengers: Passenger[]; payment?: Payment; ticket?: Ticket } | null {
    const booking = this.bookingRepo.findByPNR(pnr);
    if (!booking) return null;

    const passengers = this.bookingRepo.getPassengersForBooking(booking.id);
    const payment = this.bookingRepo.getPaymentForBooking(booking.id);
    const ticket = this.bookingRepo.getTicketForBooking(booking.id);

    return { booking, passengers, payment, ticket };
  }

  public getUserBookings(userId: string) {
    const bookings = this.bookingRepo.findByUserId(userId);
    return bookings.map((b) => {
      const passengers = this.bookingRepo.getPassengersForBooking(b.id);
      const ticket = this.bookingRepo.getTicketForBooking(b.id);
      return { ...b, passengers, ticket };
    });
  }

  public cancelBooking(pnr: string, reason: string): Cancellation {
    const booking = this.bookingRepo.findByPNR(pnr);
    if (!booking) throw new Error('PNR not found');
    if (booking.status === BookingStatus.CANCELLED) throw new Error('Ticket is already cancelled');

    // Calculate cancellation fee based on timing (standard Indian Railway rule: ₹120 for SL, ₹240 for AC)
    const cancellationFee = booking.travelClass.includes('A') ? 240 * booking.totalPassengers : 120 * booking.totalPassengers;
    const cancellation = this.bookingRepo.cancelBooking(booking.id, reason, cancellationFee);

    if (!cancellation) throw new Error('Failed to process cancellation');
    return cancellation;
  }
}
