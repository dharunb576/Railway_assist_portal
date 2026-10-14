import { Request, Response } from 'express';
import { TrainService } from '../services/TrainService';
import { SeatAllocationService } from '../services/SeatAllocationService';
import { TravelClass } from '../config/constants';

export class TrainController {
  private trainService: TrainService;
  private seatService: SeatAllocationService;

  constructor() {
    this.trainService = new TrainService();
    this.seatService = new SeatAllocationService();
  }

  public getAllTrains = async (req: Request, res: Response) => {
    try {
      const trains = this.trainService.getAllTrains();
      return res.status(200).json({ success: true, data: trains });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  public searchTrains = async (req: Request, res: Response) => {
    try {
      const { from, to, class: travelClass } = req.query;
      if (!from || !to) {
        return res.status(400).json({ success: false, message: 'Source (from) and Destination (to) are required' });
      }

      const trains = this.trainService.searchTrains(
        String(from),
        String(to),
        travelClass ? (travelClass as TravelClass) : undefined
      );

      return res.status(200).json({ success: true, data: trains });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  public getTrainById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const details = this.trainService.getTrainDetailsWithSchedule(id);
      if (!details) {
        return res.status(404).json({ success: false, message: 'Train not found' });
      }
      return res.status(200).json({ success: true, data: details });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  public getSeats = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { class: travelClass } = req.query;

      if (!travelClass) {
        return res.status(400).json({ success: false, message: 'Travel class is required (e.g. ?class=SL)' });
      }

      const coachSeats = this.seatService.getCoachSeats(id, travelClass as TravelClass);
      if (!coachSeats) {
        return res.status(404).json({ success: false, message: 'No coach found for requested class' });
      }

      return res.status(200).json({ success: true, data: coachSeats });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };
}
