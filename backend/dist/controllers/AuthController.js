"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoFounderMatches = exports.updateProfile = exports.getProfile = void 0;
const schemas_1 = require("../models/schemas");
const getProfile = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: 'User context not found' });
        return res.status(200).json(req.user);
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve profile data' });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: 'User context not found' });
        const { name, bio, avatarUrl, skills, interests, role } = req.body;
        const updatedUser = await schemas_1.User.findOneAndUpdate({ firebaseUid: req.user.firebaseUid }, {
            $set: {
                name,
                bio,
                avatarUrl,
                skills: skills || [],
                interests: interests || [],
                role
            }
        }, { new: true });
        return res.status(200).json(updatedUser);
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to update user profile' });
    }
};
exports.updateProfile = updateProfile;
const getCoFounderMatches = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: 'Unauthorized' });
        // In a real setup, calls the Python ML service to score similarity.
        // Fetch users with different roles for matching
        const matchingRole = req.user.role === 'Founder' ? ['Founder', 'Mentor'] : ['Founder'];
        const candidates = await schemas_1.User.find({
            firebaseUid: { $ne: req.user.firebaseUid },
            role: { $in: matchingRole }
        }).limit(15);
        // Call ML service or use a quick local formula to calculate similarity score
        const matches = candidates.map(c => {
            // Common interests calculator
            const commonInterests = c.interests.filter(i => req.user?.interests.includes(i)).length;
            const compatibilityScore = Math.min(60 + (commonInterests * 10) + Math.floor(Math.random() * 20), 98);
            return {
                user: c,
                compatibilityScore,
                suggestedRoles: c.skills.includes('React Native') || c.skills.includes('Node.js')
                    ? ['CTO', 'Lead Engineer']
                    : c.skills.includes('Figma')
                        ? ['CPO', 'UI/UX Lead']
                        : ['CMO', 'Operations Lead']
            };
        });
        // Sort by compatibility score
        matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
        return res.status(200).json(matches);
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to get co-founder compatibility list' });
    }
};
exports.getCoFounderMatches = getCoFounderMatches;
