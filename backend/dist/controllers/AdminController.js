"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = exports.verifyInvestor = exports.getSystemStats = void 0;
const schemas_1 = require("../models/schemas");
const getSystemStats = async (req, res) => {
    try {
        const totalUsers = await schemas_1.User.countDocuments();
        const foundersCount = await schemas_1.User.countDocuments({ role: 'Founder' });
        const investorsCount = await schemas_1.User.countDocuments({ role: 'Investor' });
        const activeStartups = await schemas_1.Startup.countDocuments();
        // Revenue simulation totals
        const proUsersCount = await schemas_1.User.countDocuments({ subscriptionPlan: { $ne: 'Free' } });
        // Aggregate monthly statistics
        const plansSplit = {
            Free: await schemas_1.User.countDocuments({ subscriptionPlan: 'Free' }),
            Starter: await schemas_1.User.countDocuments({ subscriptionPlan: 'Starter' }),
            Pro: await schemas_1.User.countDocuments({ subscriptionPlan: 'Pro' }),
            Enterprise: await schemas_1.User.countDocuments({ subscriptionPlan: 'Enterprise' }),
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
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve admin system statistics' });
    }
};
exports.getSystemStats = getSystemStats;
const verifyInvestor = async (req, res) => {
    try {
        const { userId, isApproved } = req.body;
        const user = await schemas_1.User.findById(userId);
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        if (isApproved) {
            user.role = 'Investor';
            await user.save();
            await schemas_1.AuditLog.create({
                actorId: req.user?.firebaseUid || 'system',
                action: 'VERIFY_INVESTOR',
                details: `Approved user ${user.email} as an Investor`
            });
        }
        return res.status(200).json({ success: true, user });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to approve investor role' });
    }
};
exports.verifyInvestor = verifyInvestor;
const getAuditLogs = async (req, res) => {
    try {
        const logs = await schemas_1.AuditLog.find().sort({ createdAt: -1 }).limit(100);
        return res.status(200).json(logs);
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to fetch audit log trace' });
    }
};
exports.getAuditLogs = getAuditLogs;
