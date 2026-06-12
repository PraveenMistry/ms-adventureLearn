import Assessment, { IAssessment } from '../models/Assessment';

export class AssessmentService {
  static async create(data: Partial<IAssessment>) {
    const assessment = new Assessment(data);
    return assessment.save();
  }

  static async findByTeacher(teacherId: string) {
    return Assessment.find({ teacherId }).exec();
  }

  static async findById(assessmentId: string) {
    return Assessment.findById(assessmentId).exec();
  }

  static async delete(assessmentId: string) {
    return Assessment.findByIdAndDelete(assessmentId).exec();
  }
}
