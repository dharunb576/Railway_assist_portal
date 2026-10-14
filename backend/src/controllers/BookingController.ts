import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { BookingService } from '../services/BookingService';
import { FareCalculatorService } from '../services/FareCalculatorService';
import { TravelClass } from '../config/constants';

export class BookingController {
  private bookingService: BookingService;
  private fareCalculator: FareCalculatorService;

  constructor() {
    this.bookingService = new BookingService();
    this.fareCalculator = new FareCalculatorService();
  }

  public calculateFare = async (req: AuthRequest, res: Response) => {
    try {
      const { distanceKm, travelClass, passengerCount } = req.body;
      if (!distanceKm || !travelClass) {
        return res.status(400).json({ success: false, message: 'Distance in km and travel class are required' });
      }

      const breakdown = this.fareCalculator.calculateFare(
        Number(distanceKm),
        travelClass as TravelClass,
        Number(passengerCount || 1)
      );

      return res.status(200).json({ success: true, data: breakdown });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  };

  public createBooking = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id || req.body.userId || 'usr_demo';
      const result = await this.bookingService.createBooking({
        ...req.body,
        userId
      });

      return res.status(201).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  };

  public getBookingByPNR = async (req: AuthRequest, res: Response) => {
    try {
      const { pnr } = req.params;
      const details = this.bookingService.getBookingByPNR(pnr);
      if (!details) {
        return res.status(404).json({ success: false, message: 'Booking not found for this PNR' });
      }
      return res.status(200).json({ success: true, data: details });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  public getUserBookings = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id || 'usr_demo';
      const bookings = this.bookingService.getUserBookings(userId);
      return res.status(200).json({ success: true, data: bookings });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  public cancelBooking = async (req: AuthRequest, res: Response) => {
    try {
      const { pnr } = req.params;
      const { reason } = req.body;
      const cancellation = this.bookingService.cancelBooking(pnr, reason || 'User requested cancellation');

      return res.status(200).json({ success: true, data: cancellation, message: 'Ticket cancelled successfully' });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  };
}
