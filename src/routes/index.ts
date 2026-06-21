import { Router } from 'express';
import { WorldFactController } from '../controllers/WorldFactController';
import { AuthController } from '../controllers/AuthController';
import { ProfileController } from '../controllers/ProfileController';
import { ProgressController } from '../controllers/ProgressController';
import { ClassroomController } from '../controllers/ClassroomController';
import { StoryController } from '../controllers/StoryController';
import { BadgeController } from '../controllers/BadgeController';
import { AssignmentController } from '../controllers/AssignmentController';
import { AssessmentController } from '../controllers/AssessmentController';
import { MessageController } from '../controllers/MessageController';
import { SubscriptionController } from '../controllers/SubscriptionController';
import { AttendanceController } from '../controllers/AttendanceController';
import { FeeController } from '../controllers/FeeController';
import { SchoolController } from '../controllers/SchoolController';
import { SchoolEventController } from '../controllers/SchoolEventController';
import { PortfolioController } from '../controllers/PortfolioController';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/adminAuth';
import { checkSubscription } from '../middleware/subscription';

const router = Router();

// Auth
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/forgot-password', AuthController.forgotPassword);
router.post('/auth/kid-login', AuthController.kidLogin);
router.patch('/auth/user/:userId/phone', authMiddleware, AuthController.updatePhoneNumber);

// Subscriptions
router.get('/subscriptions/plans', SubscriptionController.getPlans);
router.get('/subscriptions/status', authMiddleware, SubscriptionController.getStatus);
router.post('/subscriptions/subscribe', adminMiddleware, SubscriptionController.subscribe);
router.post('/subscriptions/grant', adminMiddleware, SubscriptionController.grantAccess);

// Profiles
router.post('/profiles', authMiddleware, ProfileController.create);
router.get('/profiles/parent', authMiddleware, ProfileController.findAllByParent);
router.get('/profiles/:id', authMiddleware, ProfileController.findOne);
router.patch('/profiles/:id', authMiddleware, ProfileController.update);
router.post('/profiles/:id/mood', authMiddleware, ProfileController.logMood);
router.post('/profiles/:id/equip', authMiddleware, ProfileController.equip);
router.post('/profiles/:id/buy', authMiddleware, ProfileController.buy);
router.patch('/profiles/:id/pin', authMiddleware, ProfileController.updatePin);
router.post('/profiles/link-school', authMiddleware, ProfileController.linkSchoolProfile);

// Progress
router.post('/progress/:childId', authMiddleware, ProgressController.logProgress);
router.get('/progress/rewards/:childId', authMiddleware, ProgressController.getRewards);
router.get('/progress/:childId', authMiddleware, ProgressController.getProgress);

// Classrooms
router.post('/classrooms', authMiddleware, checkSubscription, ClassroomController.create);
router.get('/classrooms/teacher', authMiddleware, ClassroomController.findAllByTeacher);
router.post('/classrooms/join', authMiddleware, ClassroomController.join);
router.post('/classrooms/bulk-onboard', authMiddleware, ClassroomController.bulkOnboard);
router.get('/classrooms/:id/analytics', authMiddleware, ClassroomController.getAnalytics);
router.get('/classrooms/code/:code', ClassroomController.findByCode);
router.delete('/classrooms/:id', authMiddleware, ClassroomController.delete);
router.delete('/classrooms/:id/student/:studentId', authMiddleware, ClassroomController.removeStudent);

// Attendance
router.post('/classrooms/:classId/attendance', authMiddleware, AttendanceController.log);
router.get('/classrooms/:classId/attendance', authMiddleware, AttendanceController.get);

// Assignments
router.post('/assignments', authMiddleware, AssignmentController.create);
router.get('/assignments/class/:classId', authMiddleware, AssignmentController.findByClass);
router.delete('/assignments/:id', authMiddleware, AssignmentController.delete);

// Assessments
router.post('/assessments', authMiddleware, AssessmentController.create);
router.get('/assessments/teacher/:teacherId', authMiddleware, AssessmentController.findByTeacher);
router.get('/assessments/:id', authMiddleware, AssessmentController.findById);
router.delete('/assessments/:id', authMiddleware, AssessmentController.delete);

// Messages
router.post('/messages', authMiddleware, MessageController.send);
router.get('/messages/conversation/:user2', authMiddleware, MessageController.getConversation);
router.get('/messages/parents', authMiddleware, MessageController.getTeacherParents);
router.patch('/messages/:id/read', authMiddleware, MessageController.markRead);

// Story
router.post('/story/generate/teacher-preview', authMiddleware, checkSubscription, StoryController.generateTeacherPreview);
router.post('/story/generate/:childId', authMiddleware, StoryController.generate);

// Badges
router.post('/badges', authMiddleware, BadgeController.create);
router.get('/badges', BadgeController.findAll);
router.delete('/badges/:id', authMiddleware, BadgeController.delete);

// World Facts
router.get('/world-facts', WorldFactController.getAll);
router.post('/world-facts', authMiddleware, WorldFactController.create);
router.delete('/world-facts/:id', authMiddleware, WorldFactController.delete);

// Fees
router.post('/fees', authMiddleware, FeeController.create);
router.get('/classrooms/:classId/fees', authMiddleware, FeeController.findByClass);
router.patch('/fees/:id/status', authMiddleware, FeeController.toggleStatus);
router.delete('/fees/:id', authMiddleware, FeeController.delete);
router.get('/profiles/:childId/fees', authMiddleware, FeeController.findByChild);

// School/Principal
router.post('/school/teachers', authMiddleware, SchoolController.addTeacher);
router.get('/school/teachers', authMiddleware, SchoolController.getTeachers);
router.get('/school/stats', authMiddleware, SchoolController.getStats);

// School Events
router.post('/events', authMiddleware, SchoolEventController.create);
router.get('/classrooms/:classId/events', authMiddleware, SchoolEventController.findByClass);
router.get('/school/:schoolId/events', authMiddleware, SchoolEventController.findBySchool);
router.get('/events/parent', authMiddleware, SchoolEventController.findByParent);
router.post('/events/:eventId/rsvp', authMiddleware, SchoolEventController.submitRsvp);
router.delete('/events/:eventId', authMiddleware, SchoolEventController.delete);

// Portfolio Items
router.post('/portfolio', authMiddleware, PortfolioController.create);
router.get('/portfolio/child/:childId', authMiddleware, PortfolioController.getTimeline);
router.delete('/portfolio/:itemId', authMiddleware, PortfolioController.delete);

export default router;
