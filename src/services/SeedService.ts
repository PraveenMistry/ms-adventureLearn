import MembershipPlan from '../models/MembershipPlan';
import WorldFact from '../models/WorldFact';

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
}
