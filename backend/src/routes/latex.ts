import { Router } from 'express';
import { compileLatex } from '../controllers/latex';
import { authenticate } from '../middleware/auth';

const router = Router();

// We might want to authenticate this later, but for testing it's easier to leave it open
router.post('/compile', compileLatex);

export default router;
