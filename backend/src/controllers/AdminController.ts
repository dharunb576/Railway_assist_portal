import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { AnalyticsService } from '../services/AnalyticsService';
import { TrainService } from '../services/TrainService';
import { StationService } from '../services/StationService';
import { BookingRepository } from '../repositories/BookingRepository';
import { JSONDatabase } from '../database/db';

export class AdminController {
  private analyticsService: AnalyticsService;
  private trainService: TrainService;
  private stationService: StationService;
  private bookingRepo: BookingRepository;
  private db: JSONDatabase;

  constructor() {
    this.analyticsService = new AnalyticsService();
    this.trainService = new TrainService();
    this.stationService = new StationService();
    this.bookingRepo = new BookingRepository();
    this.db = JSONDatabase.getInstance();
  }

  public getDashboard = async (req: AuthRequest, res: Response) => {
    try {
      const metrics = this.analyticsService.getDashboardMetrics();
      return res.status(200).json({ success: true, data: metrics });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  public getBookings = async (req: AuthRequest, res: Response) => {
    try {
      const bookings = this.bookingRepo.findAll().map((b) => {
        const passengers = this.bookingRepo.getPassengersForBooking(b.id);
        const payment = this.bookingRepo.getPaymentForBooking(b.id);
        return { ...b, passengers, payment };
      });
      return res.status(200).json({ success: true, data: bookings });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  public createTrain = async (req: AuthRequest, res: Response) => {
    try {
      const train = this.trainService.createTrain(req.body);
      return res.status(201).json({ success: true, data: train });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  };

  public updateTrain = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const updated = this.trainService.updateTrain(id, req.body);
      if (!updated) return res.status(404).json({ success: false, message: 'Train not found' });
      return res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  };

  public deleteTrain = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const success = this.trainService.deleteTrain(id);
      if (!success) return res.status(404).json({ success: false, message: 'Train not found' });
      return res.status(200).json({ success: true, message: 'Train removed successfully' });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  };

  public createStation = async (req: AuthRequest, res: Response) => {
    try {
      const station = this.stationService.createStation(req.body);
      return res.status(201).json({ success: true, data: station });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  };

  public getUsers = async (req: AuthRequest, res: Response) => {
    try {
      const users = this.db.getData().users.map(({ passwordHash, ...u }) => u);
      return res.status(200).json({ success: true, data: users });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };
}
