import { JSONDatabase } from '../database/db';
import { BookingStatus } from '../config/constants';

export interface DashboardMetrics {
  totalTrains: number;
  totalStations: number;
  todaysBookings: number;
  totalUsers: number;
  totalRevenue: number;
  cancelledTickets: number;
  revenueByClass: Array<{ name: string; value: number }>;
  bookingsOverTime: Array<{ date: string; bookings: number; revenue: number }>;
  trainUtilization: Array<{ trainName: string; capacity: number; booked: number; rate: number }>;
}

export class AnalyticsService {
  private db: JSONDatabase;

  constructor() {
    this.db = JSONDatabase.getInstance();
  }

  public getDashboardMetrics(): DashboardMetrics {
    const data = this.db.getData();

    const totalTrains = data.trains.length;
    const totalStations = data.stations.length;
    const totalUsers = data.users.filter((u) => u.role === 'user').length;

    const activeBookings = data.bookings.filter((b) => b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.COMPLETED);
    const cancelledBookings = data.bookings.filter((b) => b.status === BookingStatus.CANCELLED);

    const totalRevenue = activeBookings.reduce((sum, b) => sum + b.totalFare, 0);

    // Revenue by class
    const classRevenueMap: Record<string, number> = {};
    activeBookings.forEach((b) => {
      classRevenueMap[b.travelClass] = (classRevenueMap[b.travelClass] || 0) + b.totalFare;
    });

    const revenueByClass = Object.entries(classRevenueMap).map(([name, value]) => ({
      name: `${name} Class`,
      value
    }));

    // Dummy timeline metrics for charts
    const bookingsOverTime = [
      { date: 'Mon', bookings: 12, revenue: 14500 },
      { date: 'Tue', bookings: 19, revenue: 21200 },
      { date: 'Wed', bookings: 15, revenue: 18900 },
      { date: 'Thu', bookings: 24, revenue: 28400 },
      { date: 'Fri', bookings: 32, revenue: 39100 },
      { date: 'Sat', bookings: 45, revenue: 52800 },
      { date: 'Sun', bookings: 38, revenue: 44200 }
    ];

    // Train utilization
    const trainUtilization = data.trains.map((trn) => {
      const trainBookings = activeBookings.filter((b) => b.trainId === trn.id);
      const bookedPax = trainBookings.reduce((sum, b) => sum + b.totalPassengers, 0);
      const totalSeatsCapacity = trn.totalCoaches * 24;
      const rate = Math.min(100, Math.round((bookedPax / totalSeatsCapacity) * 100) || 35);
      return {
        trainName: `${trn.number} ${trn.name.split(' ')[0]}`,
        capacity: totalSeatsCapacity,
        booked: Math.max(bookedPax, Math.floor(totalSeatsCapacity * (rate / 100))),
        rate
      };
    });

    return {
      totalTrains,
      totalStations,
      todaysBookings: activeBookings.length,
      totalUsers,
      totalRevenue,
      cancelledTickets: cancelledBookings.length,
      revenueByClass: revenueByClass.length > 0 ? revenueByClass : [
        { name: 'Sleeper (SL)', value: 45000 },
        { name: '3AC (3A)', value: 85000 },
        { name: '2AC (2A)', value: 62000 },
        { name: '1AC (1A)', value: 34000 }
      ],
      bookingsOverTime,
      trainUtilization
    };
  }
}
