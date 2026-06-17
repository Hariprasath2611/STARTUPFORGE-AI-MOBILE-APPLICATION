"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMVPPlanner = exports.generatePitchDeck = exports.generateCompetitorAnalysis = exports.getBusinessPlan = exports.generateBusinessPlan = void 0;
const schemas_1 = require("../models/schemas");
const axios_1 = __importDefault(require("axios"));
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const generateBusinessPlan = async (req, res) => {
    try {
        const { startupId } = req.body;
        const startup = await schemas_1.Startup.findById(startupId);
        if (!startup)
            return res.status(404).json({ error: 'Startup not found' });
        // Call Python FastAPI AI Service
        const aiResponse = await axios_1.default.post(`${AI_SERVICE_URL}/ai/business-plan`, {
            name: startup.name,
            tagline: startup.tagline,
            description: startup.description,
            industry: startup.industry,
            targetMarket: startup.targetMarket,
            businessModel: startup.businessModel,
            fundingStage: startup.fundingStage
        });
        const markdownPlan = aiResponse.data.business_plan;
        // Save to Database
        const businessPlan = await schemas_1.BusinessPlan.create({
            startupId: startup._id,
            content: markdownPlan
        });
        startup.businessPlanUrl = `/plans/${businessPlan._id}`;
        await startup.save();
        return res.status(200).json(businessPlan);
    }
    catch (error) {
        console.error('Business plan generation error:', error.message);
        return res.status(500).json({ error: 'Failed to generate business plan through LangChain Agents' });
    }
};
exports.generateBusinessPlan = generateBusinessPlan;
const getBusinessPlan = async (req, res) => {
    try {
        const plan = await schemas_1.BusinessPlan.findOne({ startupId: req.params.startupId });
        if (!plan)
            return res.status(404).json({ error: 'Business plan not found' });
        return res.status(200).json(plan);
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to fetch business plan' });
    }
};
exports.getBusinessPlan = getBusinessPlan;
const generateCompetitorAnalysis = async (req, res) => {
    try {
        const { startupId } = req.body;
        const startup = await schemas_1.Startup.findById(startupId);
        if (!startup)
            return res.status(404).json({ error: 'Startup not found' });
        const aiResponse = await axios_1.default.post(`${AI_SERVICE_URL}/ai/competitors`, {
            name: startup.name,
            description: startup.description,
            industry: startup.industry
        });
        return res.status(200).json(aiResponse.data);
    }
    catch (error) {
        console.error('Competitor intelligence search error:', error.message);
        return res.status(500).json({ error: 'Failed to generate competitor intelligence reports' });
    }
};
exports.generateCompetitorAnalysis = generateCompetitorAnalysis;
const generatePitchDeck = async (req, res) => {
    try {
        const { startupId } = req.body;
        const startup = await schemas_1.Startup.findById(startupId);
        if (!startup)
            return res.status(404).json({ error: 'Startup not found' });
        const aiResponse = await axios_1.default.post(`${AI_SERVICE_URL}/ai/pitch-deck`, {
            name: startup.name,
            tagline: startup.tagline,
            description: startup.description,
            industry: startup.industry,
            fundingStage: startup.fundingStage
        });
        return res.status(200).json(aiResponse.data);
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to create investor pitch deck slide content' });
    }
};
exports.generatePitchDeck = generatePitchDeck;
const generateMVPPlanner = async (req, res) => {
    try {
        const { startupId } = req.body;
        const startup = await schemas_1.Startup.findById(startupId);
        if (!startup)
            return res.status(404).json({ error: 'Startup not found' });
        const aiResponse = await axios_1.default.post(`${AI_SERVICE_URL}/ai/mvp-planner`, {
            name: startup.name,
            description: startup.description,
            industry: startup.industry,
            technologyStack: startup.technologyStack
        });
        return res.status(200).json(aiResponse.data);
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to compile technical MVP product roadmap' });
    }
};
exports.generateMVPPlanner = generateMVPPlanner;
