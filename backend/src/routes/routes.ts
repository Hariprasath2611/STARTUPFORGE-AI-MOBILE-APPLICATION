import { Router } from 'express';
import { authenticateJWT, requireRole } from '../middleware/auth';
import { 
  getProfile, 
  updateProfile, 
  getCoFounderMatches 
} from '../controllers/AuthController';
import { 
  createStartup, 
  getStartups, 
  getStartupById, 
  runStartupAIValidation 
} from '../controllers/StartupController';
import { 
  generateBusinessPlan, 
  getBusinessPlan, 
  generateCompetitorAnalysis, 
  generatePitchDeck, 
  generateMVPPlanner 
} from '../controllers/PlanController';
import { 
  runFinancialSimulation, 
  getSimulations, 
  deleteSimulation 
} from '../controllers/SimulationController';
import { 
  getSystemStats, 
  verifyInvestor, 
  getAuditLogs 
} from '../controllers/AdminController';

const router = Router();

// Auth & Profile Routes
router.get('/auth/profile', authenticateJWT, getProfile);
router.put('/auth/profile', authenticateJWT, updateProfile);
router.get('/auth/matches', authenticateJWT, getCoFounderMatches);

// Startup Routes
router.post('/startups', authenticateJWT, createStartup);
router.get('/startups', authenticateJWT, getStartups);
router.get('/startups/:id', authenticateJWT, getStartupById);
router.post('/startups/:id/validate', authenticateJWT, runStartupAIValidation);

// Generation & Advisor Routes
router.post('/plans/business-plan', authenticateJWT, generateBusinessPlan);
router.get('/plans/business-plan/:startupId', authenticateJWT, getBusinessPlan);
router.post('/plans/competitors', authenticateJWT, generateCompetitorAnalysis);
router.post('/plans/pitch-deck', authenticateJWT, generatePitchDeck);
router.post('/plans/mvp-planner', authenticateJWT, generateMVPPlanner);

// Simulation Routes
router.post('/simulations', authenticateJWT, runFinancialSimulation);
router.get('/simulations/startup/:startupId', authenticateJWT, getSimulations);
router.delete('/simulations/:id', authenticateJWT, deleteSimulation);

// Admin Routes (Restricted to Admin role)
router.get('/admin/stats', authenticateJWT, requireRole(['Admin']), getSystemStats);
router.post('/admin/verify-investor', authenticateJWT, requireRole(['Admin']), verifyInvestor);
router.get('/admin/audit-logs', authenticateJWT, requireRole(['Admin']), getAuditLogs);

export default router;
