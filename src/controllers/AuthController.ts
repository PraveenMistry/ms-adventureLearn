import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, role, phoneNumber } = req.body;
      const result = await AuthService.register(email, password, role, phoneNumber);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await AuthService.validateUser(email, password);
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });
      
      const result = await AuthService.login(user);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const result = await AuthService.forgotPassword(email);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
