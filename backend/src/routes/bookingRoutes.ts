import { Router } from 'express';
import { BookingController } from '../controllers/BookingController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();
const bookingController = new BookingController();

router.post('/calculate-fare', bookingController.calculateFare);
router.post('/', authenticateToken, bookingController.createBooking);
router.get('/my-bookings', authenticateToken, bookingController.getUserBookings);
router.get('/pnr/:pnr', bookingController.getBookingByPNR);
router.post('/pnr/:pnr/cancel', authenticateToken, bookingController.cancelBooking);

export default router;
