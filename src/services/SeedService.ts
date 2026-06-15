import MembershipPlan from '../models/MembershipPlan';

export class SeedService {
  static async seedMembershipPlans() {
    try {
      const count = await MembershipPlan.countDocuments();
      if (count === 0) {
        console.log('Seeding membership plans...');
        const plans = [
          {
            name: 'Monthly Hero',
            durationMonths: 1,
            price: 9.99,
            features: ['Unlimited AI Story Generation', 'Manage up to 5 Classrooms', 'Advanced Analytics'],
            isActive: true
          },
          {
            name: 'Quarterly Quest',
            durationMonths: 3,
            price: 24.99,
            features: ['Everything in Monthly', 'Early access to new games', 'Priority teacher support'],
            isActive: true
          },
          {
            name: 'Annual Legend',
            durationMonths: 12,
            price: 79.99,
            features: ['Everything in Quarterly', 'Manage Unlimited Classrooms', '2 months FREE', 'Legendary Teacher Badge'],
            isActive: true
          }
        ];
        await MembershipPlan.insertMany(plans);
        console.log('Membership plans seeded successfully!');
      }
    } catch (error) {
      console.error('Failed to seed membership plans:', error);
    }
  }
}
