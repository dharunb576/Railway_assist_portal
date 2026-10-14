import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public register = async (req: Request, res: Response) => {
    try {
      const { name, email, password, phone, role } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
      }

      const result = this.authService.register(name, email, password, phone, role);
      return res.status(201).json({ success: true, ...result });
    } catch (err: any) {
      return res.status(400).json({ success: false, message: err.message });
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
      }

      const result = this.authService.login(email, password);
      return res.status(200).json({ success: true, ...result });
    } catch (err: any) {
      return res.status(401).json({ success: false, message: err.message });
    }
  };
}
