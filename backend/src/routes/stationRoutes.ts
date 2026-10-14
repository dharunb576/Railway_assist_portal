import { Router } from 'express';
import { StationController } from '../controllers/StationController';

const router = Router();
const stationController = new StationController();

router.get('/', stationController.getAllStations);

export default router;
