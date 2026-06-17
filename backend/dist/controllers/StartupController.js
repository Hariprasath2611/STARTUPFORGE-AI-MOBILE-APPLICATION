"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runStartupAIValidation = exports.getStartupById = exports.getStartups = exports.createStartup = void 0;
const schemas_1 = require("../models/schemas");
const axios_1 = __importDefault(require("axios"));
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8001';
const createStartup = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: 'Unauthorized' });
        const { name, tagline, description, industry, targetMarket, fundingStage, businessModel, revenueProjections, technologyStack, teamComposition } = req.body;
        const startup = new schemas_1.Startup({
            ownerId: req.user._id,
            name,
            tagline,
            description,
            industry,
            targetMarket,
            fundingStage,
            businessModel,
            revenueProjections,
            technologyStack,
            teamComposition
        });
        // Invoke ML Predictor to initialize success scoring
        try {
            const mlResponse = await axios_1.default.post(`${ML_SERVICE_URL}/predict/success`, {
                industry,
                market_size: 10000000, // standard default market size
                competition: 'medium',
                funding_stage: fundingStage,
                business_model: businessModel,
                revenue_projections: revenueProjections || 0,
                team_composition: teamComposition || [],
                technology_stack: technologyStack || []
            });
            if (mlResponse.data) {
                startup.successScore = Math.round(mlResponse.data.success_probability * 100);
                startup.riskScore = Math.round(mlResponse.data.risk_score * 100);
                startup.investmentReady = mlResponse.data.investment_readiness >= 0.7;
                startup.growthPotential = mlResponse.data.growth_potential;
                startup.confidenceScore = Math.round(mlResponse.data.confidence_score * 100);
            }
        }
        catch (mlErr) {
            console.warn('⚠️ ML Success Predictor offline or failed. Falling back to default calculations.', mlErr.message);
            // fallback math
            startup.successScore = 65;
            startup.riskScore = 40;
            startup.investmentReady = false;
            startup.growthPotential = 'Medium';
            startup.confidenceScore = 75;
        }
        await startup.save();
        return res.status(201).json(startup);
    }
    catch (error) {
        console.error('Error creating startup:', error);
        return res.status(500).json({ error: 'Failed to create startup profile' });
    }
};
exports.createStartup = createStartup;
const getStartups = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: 'Unauthorized' });
        let query = {};
        if (req.user.role === 'Founder') {
            query = { ownerId: req.user._id };
        }
        const startups = await schemas_1.Startup.find(query).populate('ownerId', 'name email avatarUrl');
        return res.status(200).json(startups);
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to fetch startups list' });
    }
};
exports.getStartups = getStartups;
const getStartupById = async (req, res) => {
    try {
        const startup = await schemas_1.Startup.findById(req.params.id).populate('ownerId', 'name email avatarUrl');
        if (!startup)
            return res.status(404).json({ error: 'Startup not found' });
        return res.status(200).json(startup);
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to fetch startup details' });
    }
};
exports.getStartupById = getStartupById;
const runStartupAIValidation = async (req, res) => {
    try {
        const startup = await schemas_1.Startup.findById(req.params.id);
        if (!startup)
            return res.status(404).json({ error: 'Startup not found' });
        const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
        // Call AI validator agent
        const aiResponse = await axios_1.default.post(`${AI_SERVICE_URL}/ai/validate`, {
            name: startup.name,
            description: startup.description,
            industry: startup.industry,
            funding_stage: startup.fundingStage,
            business_model: startup.businessModel
        });
        // Update scores based on AI feedback
        if (aiResponse.data) {
            startup.successScore = aiResponse.data.validation_score || startup.successScore;
            startup.riskScore = aiResponse.data.risk_score || startup.riskScore;
            startup.investmentReady = startup.successScore > 75;
            await startup.save();
        }
        return res.status(200).json({
            startup,
            aiValidationDetails: aiResponse.data
        });
    }
    catch (error) {
        console.error('AI Validator Agent failed:', error.message);
        return res.status(500).json({ error: 'AI Validation service is temporarily unavailable' });
    }
};
exports.runStartupAIValidation = runStartupAIValidation;
