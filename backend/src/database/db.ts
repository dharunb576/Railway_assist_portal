import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { UserRole, TravelClass, BookingStatus, SeatStatus, BerthType } from '../config/constants';
import { User, Station, Train, ScheduleStop, Coach, Seat, Booking, Passenger, Payment, Ticket, Cancellation, Notification } from '../domain/types';
import { SeatFactory } from '../domain/patterns/SeatFactory';

export interface DatabaseSchema {
  users: User[];
  stations: Station[];
  trains: Train[];
  schedules: ScheduleStop[];
  coaches: Coach[];
  seats: Seat[];
  bookings: Booking[];
  passengers: Passenger[];
  payments: Payment[];
  tickets: Ticket[];
  cancellations: Cancellation[];
  notifications: Notification[];
}

/**
 * Singleton Pattern (GoF - Creational)
 * Manages the JSON file database storage and seed data initialization.
 */
export class JSONDatabase {
  private static instance: JSONDatabase | null = null;
  private dbPath: string;
  private data!: DatabaseSchema;

  private constructor() {
    this.dbPath = path.resolve(__dirname, '../../railway_db.json');
    this.loadOrSeed();
  }

  public static getInstance(): JSONDatabase {
    if (!JSONDatabase.instance) {
      JSONDatabase.instance = new JSONDatabase();
    }
    return JSONDatabase.instance;
  }

  private loadOrSeed(): void {
    if (fs.existsSync(this.dbPath)) {
      try {
        const fileContent = fs.readFileSync(this.dbPath, 'utf-8');
        this.data = JSON.parse(fileContent);
        return;
      } catch (err) {
        console.error('Failed to parse database JSON, re-seeding...', err);
      }
    }
    this.seedDatabase();
  }

  public save(): void {
    fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  public seedDatabase(): void {
    console.log('Seeding Railway System Database with Indian Railways data...');
    const hashedPassword = bcrypt.hashSync('Password@123', 10);

    // 1. Users & Admin
    const users: User[] = [
      {
        id: 'usr_admin',
        name: 'System Admin',
        email: 'admin@railexpress.com',
        passwordHash: hashedPassword,
        role: UserRole.ADMIN,
        phone: '9876543210',
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr_demo',
        name: 'Vignesh Dharun',
        email: 'user@railexpress.com',
        passwordHash: hashedPassword,
        role: UserRole.USER,
        phone: '9123456789',
        createdAt: new Date().toISOString()
      }
    ];

    // 2. Stations
    const stations: Station[] = [
      { id: 'stn_1', code: 'MAS', name: 'Chennai Central', city: 'Chennai', state: 'Tamil Nadu' },
      { id: 'stn_2', code: 'SBC', name: 'KSR Bengaluru', city: 'Bengaluru', state: 'Karnataka' },
      { id: 'stn_3', code: 'CBE', name: 'Coimbatore Junction', city: 'Coimbatore', state: 'Tamil Nadu' },
      { id: 'stn_4', code: 'MDU', name: 'Madurai Junction', city: 'Madurai', state: 'Tamil Nadu' },
      { id: 'stn_5', code: 'TPJ', name: 'Tiruchirappalli Junction', city: 'Trichy', state: 'Tamil Nadu' },
      { id: 'stn_6', code: 'SA', name: 'Salem Junction', city: 'Salem', state: 'Tamil Nadu' },
      { id: 'stn_7', code: 'ED', name: 'Erode Junction', city: 'Erode', state: 'Tamil Nadu' },
      { id: 'stn_8', code: 'KPD', name: 'Katpadi Junction', city: 'Vellore', state: 'Tamil Nadu' },
      { id: 'stn_9', code: 'HYB', name: 'Hyderabad Deccan', city: 'Hyderabad', state: 'Telangana' },
      { id: 'stn_10', code: 'NDLS', name: 'New Delhi Railway Station', city: 'New Delhi', state: 'Delhi' }
    ];

    // 3. Trains
    const trains: Train[] = [
      {
        id: 'trn_12627',
        number: '12627',
        name: 'Karnataka Superfast Express',
        trainType: 'Superfast',
        sourceStationId: 'stn_1',
        destinationStationId: 'stn_2',
        sourceCode: 'MAS',
        sourceName: 'Chennai Central',
        destinationCode: 'SBC',
        destinationName: 'KSR Bengaluru',
        departureTime: '06:15 AM',
        arrivalTime: '01:30 PM',
        durationMinutes: 435,
        distanceKm: 362,
        availableClasses: [TravelClass.FIRST_AC, TravelClass.SECOND_AC, TravelClass.THIRD_AC, TravelClass.SLEEPER, TravelClass.SECOND_SEATING],
        totalCoaches: 5
      },
      {
        id: 'trn_20607',
        number: '20607',
        name: 'Vande Bharat Express',
        trainType: 'Vande Bharat',
        sourceStationId: 'stn_1',
        destinationStationId: 'stn_2',
        sourceCode: 'MAS',
        sourceName: 'Chennai Central',
        destinationCode: 'SBC',
        destinationName: 'KSR Bengaluru',
        departureTime: '05:50 AM',
        arrivalTime: '10:15 AM',
        durationMinutes: 265,
        distanceKm: 362,
        availableClasses: [TravelClass.FIRST_AC, TravelClass.CHAIR_CAR],
        totalCoaches: 4
      },
      {
        id: 'trn_12675',
        number: '12675',
        name: 'Kovai Superfast Express',
        trainType: 'Superfast',
        sourceStationId: 'stn_1',
        destinationStationId: 'stn_3',
        sourceCode: 'MAS',
        sourceName: 'Chennai Central',
        destinationCode: 'CBE',
        destinationName: 'Coimbatore Junction',
        departureTime: '06:10 AM',
        arrivalTime: '02:05 PM',
        durationMinutes: 475,
        distanceKm: 496,
        availableClasses: [TravelClass.FIRST_AC, TravelClass.SECOND_AC, TravelClass.THIRD_AC, TravelClass.SLEEPER, TravelClass.CHAIR_CAR],
        totalCoaches: 5
      },
      {
        id: 'trn_12637',
        number: '12637',
        name: 'Pandian Superfast Express',
        trainType: 'Superfast',
        sourceStationId: 'stn_1',
        destinationStationId: 'stn_4',
        sourceCode: 'MAS',
        sourceName: 'Chennai Central',
        destinationCode: 'MDU',
        destinationName: 'Madurai Junction',
        departureTime: '09:40 PM',
        arrivalTime: '05:35 AM',
        durationMinutes: 475,
        distanceKm: 493,
        availableClasses: [TravelClass.FIRST_AC, TravelClass.SECOND_AC, TravelClass.THIRD_AC, TravelClass.SLEEPER],
        totalCoaches: 4
      },
      {
        id: 'trn_12621',
        number: '12621',
        name: 'Tamil Nadu Superfast Express',
        trainType: 'Superfast Express',
        sourceStationId: 'stn_1',
        destinationStationId: 'stn_10',
        sourceCode: 'MAS',
        sourceName: 'Chennai Central',
        destinationCode: 'NDLS',
        destinationName: 'New Delhi Railway Station',
        departureTime: '10:00 PM',
        arrivalTime: '06:30 AM',
        durationMinutes: 1950,
        distanceKm: 2182,
        availableClasses: [TravelClass.FIRST_AC, TravelClass.SECOND_AC, TravelClass.THIRD_AC, TravelClass.SLEEPER],
        totalCoaches: 5
      }
    ];

    // 4. Schedules
    const schedules: ScheduleStop[] = [
      // Train 12627 stops
      { id: 'sch_1', trainId: 'trn_12627', stationId: 'stn_1', stationCode: 'MAS', stationName: 'Chennai Central', stationOrder: 1, arrivalTime: '06:15 AM', departureTime: '06:15 AM', dayNumber: 1, distanceFromSourceKm: 0 },
      { id: 'sch_2', trainId: 'trn_12627', stationId: 'stn_8', stationCode: 'KPD', stationName: 'Katpadi Junction', stationOrder: 2, arrivalTime: '08:00 AM', departureTime: '08:05 AM', dayNumber: 1, distanceFromSourceKm: 130 },
      { id: 'sch_3', trainId: 'trn_12627', stationId: 'stn_2', stationCode: 'SBC', stationName: 'KSR Bengaluru', stationOrder: 3, arrivalTime: '01:30 PM', departureTime: '01:30 PM', dayNumber: 1, distanceFromSourceKm: 362 },

      // Train 12675 stops
      { id: 'sch_4', trainId: 'trn_12675', stationId: 'stn_1', stationCode: 'MAS', stationName: 'Chennai Central', stationOrder: 1, arrivalTime: '06:10 AM', departureTime: '06:10 AM', dayNumber: 1, distanceFromSourceKm: 0 },
      { id: 'sch_5', trainId: 'trn_12675', stationId: 'stn_8', stationCode: 'KPD', stationName: 'Katpadi Junction', stationOrder: 2, arrivalTime: '07:53 AM', departureTime: '07:55 AM', dayNumber: 1, distanceFromSourceKm: 130 },
      { id: 'sch_6', trainId: 'trn_12675', stationId: 'stn_6', stationCode: 'SA', stationName: 'Salem Junction', stationOrder: 3, arrivalTime: '10:52 AM', departureTime: '10:55 AM', dayNumber: 1, distanceFromSourceKm: 334 },
      { id: 'sch_7', trainId: 'trn_12675', stationId: 'stn_7', stationCode: 'ED', stationName: 'Erode Junction', stationOrder: 4, arrivalTime: '11:50 AM', departureTime: '11:55 AM', dayNumber: 1, distanceFromSourceKm: 394 },
      { id: 'sch_8', trainId: 'trn_12675', stationId: 'stn_3', stationCode: 'CBE', stationName: 'Coimbatore Junction', stationOrder: 5, arrivalTime: '02:05 PM', departureTime: '02:05 PM', dayNumber: 1, distanceFromSourceKm: 496 }
    ];

    // 5. Coaches & Seats
    const coaches: Coach[] = [];
    const seats: Seat[] = [];

    trains.forEach((trn) => {
      trn.availableClasses.forEach((cls, idx) => {
        let coachCode = '';
        if (cls === TravelClass.FIRST_AC) coachCode = `H1`;
        else if (cls === TravelClass.SECOND_AC) coachCode = `A1`;
        else if (cls === TravelClass.THIRD_AC) coachCode = `B1`;
        else if (cls === TravelClass.SLEEPER) coachCode = `S1`;
        else if (cls === TravelClass.CHAIR_CAR) coachCode = `C1`;
        else if (cls === TravelClass.SECOND_SEATING) coachCode = `D1`;

        const coachId = `coach_${trn.number}_${coachCode}`;
        coaches.push({
          id: coachId,
          trainId: trn.id,
          coachCode,
          classType: cls,
          totalSeats: 24
        });

        // Use SeatFactory (Factory Pattern)
        const generatedSeats = SeatFactory.createSeatsForCoach(coachId, trn.id, cls, 24);
        seats.push(...generatedSeats);
      });
    });

    // 6. Sample Initial Booking & Ticket
    const sampleBooking: Booking = {
      id: 'bk_1001',
      pnr: '4218941029',
      userId: 'usr_demo',
      trainId: 'trn_12627',
      sourceStationId: 'stn_1',
      destinationStationId: 'stn_2',
      sourceCode: 'MAS',
      sourceName: 'Chennai Central',
      destinationCode: 'SBC',
      destinationName: 'KSR Bengaluru',
      journeyDate: '2026-10-15',
      travelClass: TravelClass.SLEEPER,
      totalPassengers: 2,
      baseFare: 615,
      reservationCharge: 40,
      gstAmount: 0,
      totalFare: 655,
      status: BookingStatus.CONFIRMED,
      createdAt: new Date().toISOString()
    };

    const passengers: Passenger[] = [
      {
        id: 'pax_1',
        bookingId: 'bk_1001',
        name: 'Vignesh Dharun',
        age: 23,
        gender: 'Male',
        berthPreference: 'LOWER',
        idType: 'Aadhaar Card',
        idNumber: '9988-7766-5544',
        coachCode: 'S1',
        seatNumber: 4,
        fare: 327.5
      },
      {
        id: 'pax_2',
        bookingId: 'bk_1001',
        name: 'Ananya Sharma',
        age: 22,
        gender: 'Female',
        berthPreference: 'MIDDLE',
        idType: 'PAN Card',
        idNumber: 'ABCDE1234F',
        coachCode: 'S1',
        seatNumber: 5,
        fare: 327.5
      }
    ];

    const payment: Payment = {
      id: 'pay_1001',
      bookingId: 'bk_1001',
      pnr: '4218941029',
      paymentMethod: PaymentMethod.UPI,
      transactionId: 'UPI98274102941',
      amount: 655,
      status: 'SUCCESS',
      paidAt: new Date().toISOString()
    };

    const ticket: Ticket = {
      id: 'ticket_bk_1001',
      bookingId: 'bk_1001',
      pnr: '4218941029',
      issuedAt: new Date().toISOString(),
      qrData: 'PNR:4218941029|TRAIN:12627|DATE:2026-10-15|PAX:2|FARE:655'
    };

    const notifications: Notification[] = [
      {
        id: 'notif_1',
        userId: 'usr_demo',
        title: 'Booking Confirmed!',
        message: 'Your ticket for Karnataka Express (PNR: 4218941029) has been confirmed.',
        isRead: false,
        createdAt: new Date().toISOString()
      }
    ];

    this.data = {
      users,
      stations,
      trains,
      schedules,
      coaches,
      seats,
      bookings: [sampleBooking],
      passengers,
      payments: [payment],
      tickets: [ticket],
      cancellations: [],
      notifications
    };

    this.save();
    console.log('Database initialized successfully with seeded data!');
  }
}
