import { Request, Response } from 'express';
import { StationService } from '../services/StationService';

export class StationController {
  private stationService: StationService;

  constructor() {
    this.stationService = new StationService();
  }

  public getAllStations = async (req: Request, res: Response) => {
    try {
      const { query } = req.query;
      const stations = query
        ? this.stationService.searchStations(String(query))
        : this.stationService.getAllStations();
      return res.status(200).json({ success: true, data: stations });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };
}
