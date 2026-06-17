import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { Startup, BusinessPlan } from '../models/schemas';
import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export const generateBusinessPlan = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { startupId } = req.body;
    const startup = await Startup.findById(startupId);
    if (!startup) return res.status(404).json({ error: 'Startup not found' });

    // Call Python FastAPI AI Service
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/ai/business-plan`, {
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
    const businessPlan = await BusinessPlan.create({
      startupId: startup._id,
      content: markdownPlan
    });

    startup.businessPlanUrl = `/plans/${businessPlan._id}`;
    await startup.save();

    return res.status(200).json(businessPlan);
  } catch (error: any) {
    console.error('Business plan generation error:', error.message);
    return res.status(500).json({ error: 'Failed to generate business plan through LangChain Agents' });
  }
};

export const getBusinessPlan = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const plan = await BusinessPlan.findOne({ startupId: req.params.startupId });
    if (!plan) return res.status(404).json({ error: 'Business plan not found' });
    return res.status(200).json(plan);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch business plan' });
  }
};

export const generateCompetitorAnalysis = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { startupId } = req.body;
    const startup = await Startup.findById(startupId);
    if (!startup) return res.status(404).json({ error: 'Startup not found' });

    const aiResponse = await axios.post(`${AI_SERVICE_URL}/ai/competitors`, {
      name: startup.name,
      description: startup.description,
      industry: startup.industry
    });

    return res.status(200).json(aiResponse.data);
  } catch (error: any) {
    console.error('Competitor intelligence search error:', error.message);
    return res.status(500).json({ error: 'Failed to generate competitor intelligence reports' });
  }
};

export const generatePitchDeck = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { startupId } = req.body;
    const startup = await Startup.findById(startupId);
    if (!startup) return res.status(404).json({ error: 'Startup not found' });

    const aiResponse = await axios.post(`${AI_SERVICE_URL}/ai/pitch-deck`, {
      name: startup.name,
      tagline: startup.tagline,
      description: startup.description,
      industry: startup.industry,
      fundingStage: startup.fundingStage
    });

    return res.status(200).json(aiResponse.data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create investor pitch deck slide content' });
  }
};

export const generateMVPPlanner = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { startupId } = req.body;
    const startup = await Startup.findById(startupId);
    if (!startup) return res.status(404).json({ error: 'Startup not found' });

    const aiResponse = await axios.post(`${AI_SERVICE_URL}/ai/mvp-planner`, {
      name: startup.name,
      description: startup.description,
      industry: startup.industry,
      technologyStack: startup.technologyStack
    });

    return res.status(200).json(aiResponse.data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to compile technical MVP product roadmap' });
  }
};
