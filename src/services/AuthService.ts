import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Classroom from '../models/Classroom';
import ChildProfile from '../models/ChildProfile';
import School from '../models/School';
import { ProfileService } from './ProfileService';

const JWT_SECRET = process.env.JWT_SECRET || 'SUPER_SECRET_KEY_123';

export class AuthService {
  static async register(email: string, password: string, role: 'PARENT' | 'TEACHER' | 'PRINCIPAL', phoneNumber?: string, schoolName?: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('Email already exists');

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ email, passwordHash, role, phoneNumber });
    await newUser.save();

    if (role === 'PRINCIPAL' && schoolName) {
      const newSchool = new School({ name: schoolName, principalId: newUser._id });
      await newSchool.save();
      newUser.schoolId = newSchool._id as any;
      await newUser.save();
    }

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

  static async kidLogin(classCode: string, studentId: string, loginPin: string) {
    const classroom = await Classroom.findOne({ classCode: classCode.toUpperCase() }).exec();
    if (!classroom) throw new Error('Classroom not found');

    if (!classroom.students.includes(studentId as any)) {
      throw new Error('Student not found in classroom');
    }

    const profile = await ChildProfile.findById(studentId).exec();
    if (!profile) throw new Error('Student profile not found');
    if (profile.loginPin !== loginPin) {
      throw new Error('Invalid Secret PIN');
    }

    const token = jwt.sign(
      { id: profile.parentId, role: 'KID', childId: profile._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const profileWithStatus = ProfileService.attachUnlockStatus(profile);

    return {
      access_token: token,
      profile: profileWithStatus
    };
  }

  static async updatePhoneNumber(userId: string, phoneNumber: string) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    user.phoneNumber = phoneNumber;
    await user.save();
    return user;
  }
}
