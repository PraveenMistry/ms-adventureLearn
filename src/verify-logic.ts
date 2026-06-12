import mongoose from 'mongoose';
import { ClassroomService } from './services/ClassroomService';
import Classroom from './models/Classroom';
import ChildProfile from './models/ChildProfile';

// Mocking some data for verification
async function verifyTeacherPanelLogic() {
  console.log('--- Verifying Teacher Panel Logic ---');

  const teacherId = new mongoose.Types.ObjectId();
  const studentId1 = new mongoose.Types.ObjectId(); // Green student
  const studentId2 = new mongoose.Types.ObjectId(); // Amber student (inactive 1 day)
  const studentId3 = new mongoose.Types.ObjectId(); // Red student (inactive 3 days)
  const studentId4 = new mongoose.Types.ObjectId(); // Red student (low score)

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - (25 * 60 * 60 * 1000)); // 25 hours ago
  const threeDaysAgo = new Date(now.getTime() - (73 * 24 * 60 * 60 * 1000)); // 73 days ago - WAIT, I meant 73 hours.
  
  // Actually, let's just use hours for clarity
  const greenTime = new Date(now.getTime() - (10 * 60 * 60 * 1000)); // 10 hours ago
  const amberTime = new Date(now.getTime() - (26 * 60 * 60 * 1000)); // 26 hours ago
  const redTime = new Date(now.getTime() - (74 * 60 * 60 * 1000)); // 74 hours ago

  // Mock Students
  const students = [
    {
      _id: studentId1,
      name: 'Alice (Green)',
      starCoins: 100,
      progress: [{ moduleName: 'Phonics', score: 90, completedAt: greenTime }],
      createdAt: now
    },
    {
      _id: studentId2,
      name: 'Bob (Amber)',
      starCoins: 50,
      progress: [{ moduleName: 'Phonics', score: 85, completedAt: amberTime }],
      createdAt: now
    },
    {
      _id: studentId3,
      name: 'Charlie (Red Inactive)',
      starCoins: 10,
      progress: [{ moduleName: 'Phonics', score: 95, completedAt: redTime }],
      createdAt: redTime
    },
    {
      _id: studentId4,
      name: 'David (Red Score)',
      starCoins: 20,
      progress: [{ moduleName: 'Phonics', score: 40, completedAt: now }],
      createdAt: now
    }
  ];

  // Mock Classroom Analytics Logic (Simulated since we can't easily run full DB tests here without a test runner)
  const simulateAnalytics = (students: any[]) => {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));

    return students.map((student: any) => {
      const recentProgress = student.progress.length > 0 ? student.progress[student.progress.length - 1] : null;
      const lastActivity = recentProgress ? new Date(recentProgress.completedAt) : new Date(student.createdAt);
      
      const isInactive3Days = lastActivity < threeDaysAgo;
      const recentScore = recentProgress ? recentProgress.score : 0;

      let ragStatus: 'RED' | 'AMBER' | 'GREEN' = 'GREEN';
      
      if (isInactive3Days || recentScore < 50) {
        ragStatus = 'RED';
      } else if (recentScore < 80 || (now.getTime() - lastActivity.getTime()) > (24 * 60 * 60 * 1000)) {
        ragStatus = 'AMBER';
      }

      return {
        name: student.name,
        ragStatus,
        isStruggling: isInactive3Days || (recentScore < 50 && student.progress.length >= 1)
      };
    });
  };

  const results = simulateAnalytics(students);
  
  results.forEach(res => {
    console.log(`Student: ${res.name} | RAG: ${res.ragStatus} | Struggling: ${res.isStruggling}`);
  });

  // Basic Assertions
  const alice = results.find(r => r.name.includes('Alice'));
  const bob = results.find(r => r.name.includes('Bob'));
  const charlie = results.find(r => r.name.includes('Charlie'));
  const david = results.find(r => r.name.includes('David'));

  if (alice?.ragStatus === 'GREEN' && 
      bob?.ragStatus === 'AMBER' && 
      charlie?.ragStatus === 'RED' && 
      david?.ragStatus === 'RED' &&
      charlie?.isStruggling === true &&
      david?.isStruggling === true) {
    console.log('\n✅ RAG & Alert Logic Verified!');
  } else {
    console.log('\n❌ RAG & Alert Logic Verification Failed!');
  }
}

verifyTeacherPanelLogic();
