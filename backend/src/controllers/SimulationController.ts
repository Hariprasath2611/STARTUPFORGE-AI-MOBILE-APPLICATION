import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { Simulation, Startup } from '../models/schemas';
import axios from 'axios';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8001';

export const runFinancialSimulation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { startupId, scenarioName, initialCapital, burnRate, customerGrowth, cac, ltv } = req.body;
    const startup = await Startup.findById(startupId);
    if (!startup) return res.status(404).json({ error: 'Startup not found' });

    let projections = [];
    let runway = 12;

    try {
      const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict/forecast`, {
        initial_capital: initialCapital,
        burn_rate: burnRate,
        customer_growth: customerGrowth || 5,
        cac: cac || 50,
        ltv: ltv || 250
      });

      if (mlResponse.data) {
        projections = mlResponse.data.projections;
        runway = mlResponse.data.runway;
      }
    } catch (mlErr) {
      console.warn('⚠️ ML Forecasting Service offline. Executing baseline local extrapolation.');
      
      // Local fallback calculation logic
      let currentCash = initialCapital;
      let monthlyRevenue = 0;
      let customers = 50;

      for (let month = 1; month <= 36; month++) {
        customers = Math.round(customers * (1 + (customerGrowth || 5) / 100));
        monthlyRevenue = customers * (ltv / 12); // monthly ARPU approximation
        const monthlyCosts = burnRate + (customers * cac / 12); // costs include burning and growth cac
        currentCash = currentCash + monthlyRevenue - monthlyCosts;

        projections.push({
          month,
          revenue: Math.round(monthlyRevenue),
          costs: Math.round(monthlyCosts),
          cash: Math.round(Math.max(currentCash, 0))
        });
      }

      runway = Math.round(initialCapital / Math.max(burnRate, 1));
    }

    const simulation = await Simulation.create({
      startupId,
      scenarioName,
      burnRate,
      runway,
      initialCapital,
      customerGrowth,
      cac,
      ltv,
      projections
    });

    return res.status(201).json(simulation);
  } catch (error) {
    console.error('Financial simulation error:', error);
    return res.status(500).json({ error: 'Failed to run scenario financial projections' });
  }
};

export const getSimulations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const simulations = await Simulation.find({ startupId: req.params.startupId }).sort({ createdAt: -1 });
    return res.status(200).json(simulations);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch simulations list' });
  }
};

export const deleteSimulation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    await Simulation.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Scenario projection deleted' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete simulation' });
  }
};
