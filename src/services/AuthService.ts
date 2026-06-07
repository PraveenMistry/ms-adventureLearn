import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'SUPER_SECRET_KEY_123';

export class AuthService {
  static async register(email: string, password: string, role: 'PARENT' | 'TEACHER', phoneNumber?: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('Email already exists');

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ email, passwordHash, role, phoneNumber });
    await newUser.save();

    return this.login(newUser);
  }

  static async login(user: any) {
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      access_token: token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
      },
    };
  }

  static async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');
    
    if (user.phoneNumber) {
      return { 
        message: 'Reset link sent to ' + email,
        telegram_message: 'Magic reset link sent to your Telegram (' + user.phoneNumber + ')! 🛰️'
      };
    }
    
    return { message: 'Reset link sent to ' + email };
  }

  static async validateUser(email: string, pass: string) {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      return user;
    }
    return null;
  }
}
