import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { ProfileController } from '../controllers/ProfileController';
import { ProgressController } from '../controllers/ProgressController';
import { ClassroomController } from '../controllers/ClassroomController';
import { StoryController } from '../controllers/StoryController';
import { BadgeController } from '../controllers/BadgeController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Auth
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/forgot-password', AuthController.forgotPassword);

// Profiles
router.post('/profiles', authMiddleware, ProfileController.create);
router.get('/profiles/parent/:parentId', authMiddleware, ProfileController.findAllByParent);
router.get('/profiles/:id', authMiddleware, ProfileController.findOne);
router.post('/profiles/:id/mood', authMiddleware, ProfileController.logMood);
router.post('/profiles/:id/equip', authMiddleware, ProfileController.equip);
router.post('/profiles/:id/buy', authMiddleware, ProfileController.buy);
router.patch('/profiles/:id/pin', authMiddleware, ProfileController.updatePin);
router.post('/profiles/link-school', authMiddleware, ProfileController.linkSchoolProfile);

// Progress
router.post('/progress/:childId', ProgressController.logProgress);
router.get('/progress/rewards/:childId', ProgressController.getRewards);
router.get('/progress/:childId', ProgressController.getProgress);

// Classrooms
router.post('/classrooms', authMiddleware, ClassroomController.create);
router.get('/classrooms/teacher/:teacherId', authMiddleware, ClassroomController.findAllByTeacher);
router.post('/classrooms/join', authMiddleware, ClassroomController.join);
router.get('/classrooms/:id/analytics', authMiddleware, ClassroomController.getAnalytics);
router.get('/classrooms/code/:code', ClassroomController.findByCode);

// Story
router.post('/story/generate/:childId', authMiddleware, StoryController.generate);

// Badges
router.post('/badges', authMiddleware, BadgeController.create);
router.get('/badges', BadgeController.findAll);
router.delete('/badges/:id', authMiddleware, BadgeController.delete);

export default router;
