import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { Startup } from '../models/schemas';
import axios from 'axios';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8001';

export const createStartup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const {
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
    } = req.body;

    const startup = new Startup({
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
      const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict/success`, {
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
    } catch (mlErr: any) {
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
  } catch (error) {
    console.error('Error creating startup:', error);
    return res.status(500).json({ error: 'Failed to create startup profile' });
  }
};

export const getStartups = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    let query = {};
    if (req.user.role === 'Founder') {
      query = { ownerId: req.user._id };
    }

    const startups = await Startup.find(query).populate('ownerId', 'name email avatarUrl');
    return res.status(200).json(startups);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch startups list' });
  }
};

export const getStartupById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const startup = await Startup.findById(req.params.id).populate('ownerId', 'name email avatarUrl');
    if (!startup) return res.status(404).json({ error: 'Startup not found' });
    return res.status(200).json(startup);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch startup details' });
  }
};

export const runStartupAIValidation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ error: 'Startup not found' });

    const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    
    // Call AI validator agent
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/ai/validate`, {
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
  } catch (error: any) {
    console.error('AI Validator Agent failed:', error.message);
    return res.status(500).json({ error: 'AI Validation service is temporarily unavailable' });
  }
};
