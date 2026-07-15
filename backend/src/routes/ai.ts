import { Router } from 'express';
import { analyzeResume, suggestImprovement, tailorResume } from '../controllers/ai';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/analyze', authenticate, analyzeResume);
router.post('/suggest', authenticate, suggestImprovement);
router.post('/tailor', authenticate, tailorResume);

export default router;
