import FeeRecord from '../models/FeeRecord';
import Classroom from '../models/Classroom';
import ChildProfile from '../models/ChildProfile';
import mongoose from 'mongoose';

export class FeeService {
  static async createFee(
    classId: string,
    createdBy: string,
    title: string,
    amount: number,
    dueDate: Date,
    studentId?: string
  ) {
    const classroom = await Classroom.findById(classId).exec();
    if (!classroom) throw new Error('Classroom not found');

    if (studentId) {
      // Single student fee
      const profile = await ChildProfile.findById(studentId).exec();
      if (!profile) throw new Error('Student profile not found');
      
      const newFee = new FeeRecord({
        classId,
        studentId,
        title,
        amount,
        dueDate,
        status: 'UNPAID',
        createdBy
      });
      return await newFee.save();
    } else {
      // Class-wide fee
      if (!classroom.students || classroom.students.length === 0) {
        throw new Error('No students in this classroom to assign fees');
      }

      const records = classroom.students.map(sId => ({
        classId,
        studentId: sId,
        title,
        amount,
        dueDate,
        status: 'UNPAID',
        createdBy
      }));

      return await FeeRecord.insertMany(records);
    }
  }

  static async getClassFees(classId: string) {
    return await FeeRecord.find({ classId })
      .populate({
        path: 'studentId',
        select: 'name loginPin emergencyContact parentId',
        populate: { path: 'parentId', select: 'email role phoneNumber' }
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  static async toggleFeeStatus(feeId: string, teacherId: string, status?: 'PAID' | 'UNPAID') {
    const fee = await FeeRecord.findById(feeId).exec();
    if (!fee) throw new Error('Fee record not found');
    
    if (fee.createdBy.toString() !== teacherId) {
      throw new Error('Unauthorized: You did not create this fee record');
    }

    if (status) {
      fee.status = status;
    } else {
      fee.status = fee.status === 'PAID' ? 'UNPAID' : 'PAID';
    }
    
    return await fee.save();
  }

  static async deleteFee(feeId: string, teacherId: string) {
    const fee = await FeeRecord.findById(feeId).exec();
    if (!fee) throw new Error('Fee record not found');
    if (fee.createdBy.toString() !== teacherId) {
      throw new Error('Unauthorized');
    }
    return await FeeRecord.findByIdAndDelete(feeId).exec();
  }

  static async getChildFees(childId: string, parentId: string) {
    // Security: verify the parent owns the child profile
    const profile = await ChildProfile.findOne({ _id: childId, parentId }).exec();
    if (!profile) throw new Error('Profile not found or unauthorized');

    return await FeeRecord.find({ studentId: childId })
      .sort({ dueDate: 1 })
      .exec();
  }
}
