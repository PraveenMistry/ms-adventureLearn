import Assignment, { IAssignment } from '../models/Assignment';

export class AssignmentService {
  static async create(data: Partial<IAssignment>) {
    const assignment = new Assignment(data);
    return assignment.save();
  }

  static async findByClass(classId: string) {
    return Assignment.find({ classId }).sort({ dueDate: 1 }).exec();
  }

  static async delete(assignmentId: string) {
    return Assignment.findByIdAndDelete(assignmentId).exec();
  }

  static async findByStudent(studentId: string) {
    // Finds assignments for a specific class the student is in, 
    // or specific assignments assigned to that student.
    // This is a simplified version.
    return Assignment.find({ 
      $or: [
        { assignedStudents: studentId },
        { assignedStudents: { $size: 0 } } // If empty, it's for the whole class
      ]
    }).exec();
  }
}
