import { Router } from 'express';
import { TrainController } from '../controllers/TrainController';

const router = Router();
const trainController = new TrainController();

router.get('/', trainController.getAllTrains);
router.get('/search', trainController.searchTrains);
router.get('/:id', trainController.getTrainById);
router.get('/:id/seats', trainController.getSeats);

export default router;
