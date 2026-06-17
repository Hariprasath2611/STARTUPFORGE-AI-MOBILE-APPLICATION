"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const AuthController_1 = require("../controllers/AuthController");
const StartupController_1 = require("../controllers/StartupController");
const PlanController_1 = require("../controllers/PlanController");
const SimulationController_1 = require("../controllers/SimulationController");
const AdminController_1 = require("../controllers/AdminController");
const router = (0, express_1.Router)();
// Auth & Profile Routes
router.get('/auth/profile', auth_1.authenticateJWT, AuthController_1.getProfile);
router.put('/auth/profile', auth_1.authenticateJWT, AuthController_1.updateProfile);
router.get('/auth/matches', auth_1.authenticateJWT, AuthController_1.getCoFounderMatches);
// Startup Routes
router.post('/startups', auth_1.authenticateJWT, StartupController_1.createStartup);
router.get('/startups', auth_1.authenticateJWT, StartupController_1.getStartups);
router.get('/startups/:id', auth_1.authenticateJWT, StartupController_1.getStartupById);
router.post('/startups/:id/validate', auth_1.authenticateJWT, StartupController_1.runStartupAIValidation);
// Generation & Advisor Routes
router.post('/plans/business-plan', auth_1.authenticateJWT, PlanController_1.generateBusinessPlan);
router.get('/plans/business-plan/:startupId', auth_1.authenticateJWT, PlanController_1.getBusinessPlan);
router.post('/plans/competitors', auth_1.authenticateJWT, PlanController_1.generateCompetitorAnalysis);
router.post('/plans/pitch-deck', auth_1.authenticateJWT, PlanController_1.generatePitchDeck);
router.post('/plans/mvp-planner', auth_1.authenticateJWT, PlanController_1.generateMVPPlanner);
// Simulation Routes
router.post('/simulations', auth_1.authenticateJWT, SimulationController_1.runFinancialSimulation);
router.get('/simulations/startup/:startupId', auth_1.authenticateJWT, SimulationController_1.getSimulations);
router.delete('/simulations/:id', auth_1.authenticateJWT, SimulationController_1.deleteSimulation);
// Admin Routes (Restricted to Admin role)
router.get('/admin/stats', auth_1.authenticateJWT, (0, auth_1.requireRole)(['Admin']), AdminController_1.getSystemStats);
router.post('/admin/verify-investor', auth_1.authenticateJWT, (0, auth_1.requireRole)(['Admin']), AdminController_1.verifyInvestor);
router.get('/admin/audit-logs', auth_1.authenticateJWT, (0, auth_1.requireRole)(['Admin']), AdminController_1.getAuditLogs);
exports.default = router;
