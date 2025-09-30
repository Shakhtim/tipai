import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';

const router = Router();
const aiController = new AIController();

router.post('/query', (req, res) => aiController.query(req, res));
router.get('/providers', (req, res) => aiController.getProviders(req, res));
router.get('/health', (req, res) => aiController.healthCheck(req, res));

export default router;