import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { User, Startup, AuditLog, Simulation } from '../models/schemas';

export const getSystemStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const foundersCount = await User.countDocuments({ role: 'Founder' });
    const investorsCount = await User.countDocuments({ role: 'Investor' });
    const activeStartups = await Startup.countDocuments();
    
    // Revenue simulation totals
    const proUsersCount = await User.countDocuments({ subscriptionPlan: { $ne: 'Free' } });

    // Aggregate monthly statistics
    const plansSplit = {
      Free: await User.countDocuments({ subscriptionPlan: 'Free' }),
      Starter: await User.countDocuments({ subscriptionPlan: 'Starter' }),
      Pro: await User.countDocuments({ subscriptionPlan: 'Pro' }),
      Enterprise: await User.countDocuments({ subscriptionPlan: 'Enterprise' }),
    };

    return res.status(200).json({
      totalUsers,
      foundersCount,
      investorsCount,
      activeStartups,
      proUsersCount,
      plansSplit,
      systemStatus: 'Healthy',
      memoryUsage: process.memoryUsage().heapUsed,
      uptime: process.uptime()
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve admin system statistics' });
  }
};

export const verifyInvestor = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, isApproved } = req.body;
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    if (isApproved) {
      user.role = 'Investor';
      await user.save();
      
      await AuditLog.create({
        actorId: req.user?.firebaseUid || 'system',
        action: 'VERIFY_INVESTOR',
        details: `Approved user ${user.email} as an Investor`
      });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to approve investor role' });
  }
};

export const getAuditLogs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    return res.status(200).json(logs);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch audit log trace' });
  }
};
