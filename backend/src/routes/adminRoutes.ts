import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';

const router = Router();
const adminController = new AdminController();

// Admin routes (requires authentication & admin role)
router.get('/dashboard', authenticateToken, requireAdmin, adminController.getDashboard);
router.get('/bookings', authenticateToken, requireAdmin, adminController.getBookings);
router.get('/users', authenticateToken, requireAdmin, adminController.getUsers);

router.post('/trains', authenticateToken, requireAdmin, adminController.createTrain);
router.put('/trains/:id', authenticateToken, requireAdmin, adminController.updateTrain);
router.delete('/trains/:id', authenticateToken, requireAdmin, adminController.deleteTrain);

router.post('/stations', authenticateToken, requireAdmin, adminController.createStation);

export default router;
