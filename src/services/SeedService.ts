import MembershipPlan from '../models/MembershipPlan';
import WorldFact from '../models/WorldFact';
import Badge from '../models/Badge';
import User from '../models/User';
import bcrypt from 'bcryptjs';

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

  static async seedWorldFacts() {
    try {
      const count = await WorldFact.countDocuments();
      if (count === 0) {
        console.log('Seeding initial world facts...');
        const facts = [
          { question: "WHICH ANIMAL IS THE KING OF THE JUNGLE?", answer: "LION", options: ["LION", "CAT", "BEAR"], emoji: "🦁" },
          { question: "WHICH PLANET DO WE LIVE ON?", answer: "EARTH", options: ["MARS", "EARTH", "SUN"], emoji: "🌍" },
          { question: "WHICH ANIMAL HAS A VERY LONG NECK?", answer: "GIRAFFE", options: ["DOG", "GIRAFFE", "ZEBRA"], emoji: "🦒" },
          { question: "WHAT COLOUR IS THE SKY ON A SUNNY DAY?", answer: "BLUE", options: ["RED", "BLUE", "GREEN"], emoji: "☀️" },
          { question: "WHICH OCEAN IS THE LARGEST ON EARTH?", answer: "PACIFIC", options: ["PACIFIC", "ATLANTIC", "INDIAN"], emoji: "🌊" },
          { question: "WHAT IS THE TALLEST MOUNTAIN ON EARTH?", answer: "MOUNT EVEREST", options: ["MOUNT EVEREST", "KILIMANJARO", "MOUNT FUJI"], emoji: "🏔️" },
          { question: "WHICH IS THE SMALLEST CONTINENT BY LAND AREA?", answer: "AUSTRALIA", options: ["AUSTRALIA", "EUROPE", "ANTARCTICA"], emoji: "🐨" },
          { question: "WHICH INSECT MAKES SWEET HONEY?", answer: "HONEYBEE", options: ["HONEYBEE", "BUTTERFLY", "LADYBUG"], emoji: "🐝" },
          { question: "WHAT IS THE HARDEST NATURAL SUBSTANCE ON EARTH?", answer: "DIAMOND", options: ["DIAMOND", "GOLD", "IRON"], emoji: "💎" },
          { question: "WHICH COUNTRY IS HOME TO THE GIANT PANDA?", answer: "CHINA", options: ["CHINA", "JAPAN", "INDIA"], emoji: "🐼" },
          { question: "WHAT IS THE FASTEST LAND ANIMAL?", answer: "CHEETAH", options: ["CHEETAH", "LION", "HORSE"], emoji: "🐆" },
          { question: "HOW MANY COLOURS ARE THERE IN A RAINBOW?", answer: "SEVEN", options: ["SEVEN", "FIVE", "TEN"], emoji: "🌈" },
          { question: "WHICH CONTINENT IS COVERED ALMOST ENTIRELY BY ICE?", answer: "ANTARCTICA", options: ["ANTARCTICA", "ASIA", "EUROPE"], emoji: "❄️" },
          { question: "WHAT FRUIT IS KNOWN FOR HAVING ITS SEEDS ON THE OUTSIDE?", answer: "STRAWBERRY", options: ["STRAWBERRY", "APPLE", "BANANA"], emoji: "🍓" },
          { question: "WHICH BIRD CANNOT FLY BUT IS AN EXCELLENT SWIMMER?", answer: "PENGUIN", options: ["PENGUIN", "EAGLE", "SPARROW"], emoji: "🐧" },
          { question: "WHAT GAS DO PLANTS ABSORB FROM THE AIR TO MAKE FOOD?", answer: "CARBON DIOXIDE", options: ["CARBON DIOXIDE", "OXYGEN", "NITROGEN"], emoji: "🌱" },
          { question: "WHICH ANIMAL IS KNOWN AS THE SHIP OF THE DESERT?", answer: "CAMEL", options: ["CAMEL", "DONKEY", "ELEPHANT"], emoji: "🐪" },
          { question: "WHAT IS THE LARGEST MAMMAL IN THE WORLD?", answer: "BLUE WHALE", options: ["BLUE WHALE", "ELEPHANT", "SHARK"], emoji: "🐋" },
          { question: "WHICH PLANET IS KNOWN AS THE RED PLANET?", answer: "MARS", options: ["MARS", "VENUS", "JUPITER"], emoji: "🔴" },
          { question: "WHAT IS THE PRIMARY INGREDIENT IN CHOCOLATE?", answer: "COCOA", options: ["COCOA", "MILK", "SUGAR"], emoji: "🍫" }
        ];
        await WorldFact.insertMany(facts);
        console.log('World facts seeded successfully!');
      }
    } catch (error) {
      console.error('Failed to seed world facts:', error);
    }
  }

  static async seedBadges() {
    try {
      const count = await Badge.countDocuments();
      if (count === 0) {
        console.log('Seeding initial badges...');
        
        // Find or create a teacher user to own the badges
        let teacher = await User.findOne({ role: 'TEACHER' });
        if (!teacher) {
          const hashedPassword = await bcrypt.hash('password123', 10);
          teacher = new User({
            name: 'System Teacher',
            email: 'teacher@adventurelearn.com',
            password: hashedPassword,
            role: 'TEACHER',
            isActive: true
          });
          await teacher.save();
        }

        const badges = [
          // LITERACY
          { name: 'ABC Typing', icon: '⌨️', category: 'LITERACY', description: 'Master the falling letters in ABC Typing!', teacherId: teacher._id },
          { name: 'Hindi Typing', icon: '🐘', category: 'LITERACY', description: 'Learn and type Hindi letters in the jungle!', teacherId: teacher._id },
          { name: 'Voice Volcano', icon: '🎤', category: 'LITERACY', description: 'Speak the words correctly to save the bubbles!', teacherId: teacher._id },
          { name: 'Reading Coach', icon: '📖', category: 'LITERACY', description: 'Complete reading questions to become a Reading Star!', teacherId: teacher._id },
          { name: 'Letter Tracing', icon: '✍️', category: 'LITERACY', description: 'Trace all the letters in Letter Tracing!', teacherId: teacher._id },
          { name: 'Karaoke Phonics', icon: '🎵', category: 'LITERACY', description: 'Sing along and master phonics line-by-line!', teacherId: teacher._id },
          { name: 'Rhyme Bug Catch', icon: '🐛', category: 'LITERACY', description: 'Catch only the bugs that rhyme with target words!', teacherId: teacher._id },

          // MATH
          { name: 'Math Mountain', icon: '🏔️', category: 'MATH', description: 'Solve arithmetic questions to climb the peak!', teacherId: teacher._id },
          { name: 'Counting Fish', icon: '🐟', category: 'MATH', description: 'Count the swimming fish correctly in the pond!', teacherId: teacher._id },

          // ADVENTURE
          { name: 'Object Safari', icon: '🔍', category: 'ADVENTURE', description: 'Find the correct animal, bird, or vehicle!', teacherId: teacher._id },
          { name: 'Block Builder', icon: '🧱', category: 'ADVENTURE', description: 'Stack blocks carefully to build a toy castle!', teacherId: teacher._id },
          { name: 'World Facts', icon: '🚀', category: 'ADVENTURE', description: 'Solve trivia facts to master the planet!', teacherId: teacher._id },
          { name: 'Memory Garden', icon: '🌸', category: 'ADVENTURE', description: 'Find matching pairs of garden creatures!', teacherId: teacher._id },
          { name: 'Pattern Pals', icon: '🧩', category: 'ADVENTURE', description: 'Complete shape and color patterns correctly!', teacherId: teacher._id }
        ];

        await Badge.insertMany(badges);
        console.log('Badges seeded successfully!');
      }
    } catch (error) {
      console.error('Failed to seed badges:', error);
    }
  }
}
