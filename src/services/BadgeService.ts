import Badge from '../models/Badge';

export class BadgeService {
  static async create(teacherId: string, data: any) {
    const newBadge = new Badge({ ...data, teacherId });
    return newBadge.save();
  }

  static async findAll() {
    return Badge.find().exec();
  }

  static async delete(id: string) {
    return Badge.findByIdAndDelete(id).exec();
  }
}
