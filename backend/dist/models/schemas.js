"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = exports.Simulation = exports.Notification = exports.ChatMessage = exports.BusinessPlan = exports.Startup = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String },
    role: { type: String, enum: ['Founder', 'Investor', 'Mentor', 'Admin'], default: 'Founder' },
    firebaseUid: { type: String, required: true, unique: true },
    avatarUrl: { type: String },
    bio: { type: String },
    stripeCustomerId: { type: String },
    subscriptionPlan: { type: String, enum: ['Free', 'Starter', 'Pro', 'Enterprise'], default: 'Free' },
    subscriptionStatus: { type: String, default: 'active' },
    subscriptionEnd: { type: Date },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now }
});
exports.User = mongoose_1.default.model('User', UserSchema);
const StartupSchema = new mongoose_1.Schema({
    ownerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    tagline: { type: String },
    description: { type: String, required: true },
    industry: { type: String, required: true },
    targetMarket: { type: String },
    fundingStage: { type: String, enum: ['Idea', 'Pre-Seed', 'Seed', 'SeriesA', 'Growth'], default: 'Idea' },
    businessModel: { type: String },
    revenueProjections: { type: Number, default: 0 },
    technologyStack: { type: [String], default: [] },
    teamComposition: { type: [String], default: [] },
    logoUrl: { type: String },
    pitchDeckUrl: { type: String },
    businessPlanUrl: { type: String },
    successScore: { type: Number, default: 50 },
    riskScore: { type: Number, default: 50 },
    investmentReady: { type: Boolean, default: false },
    growthPotential: { type: String, default: 'Medium' },
    confidenceScore: { type: Number, default: 70 },
    createdAt: { type: Date, default: Date.now }
});
exports.Startup = mongoose_1.default.model('Startup', StartupSchema);
const BusinessPlanSchema = new mongoose_1.Schema({
    startupId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Startup', required: true },
    content: { type: String, required: true },
    pdfUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});
exports.BusinessPlan = mongoose_1.default.model('BusinessPlan', BusinessPlanSchema);
const ChatMessageSchema = new mongoose_1.Schema({
    senderId: { type: String, required: true },
    receiverId: { type: String },
    channelId: { type: String },
    content: { type: String, required: true },
    type: { type: String, enum: ['direct', 'channel'], required: true },
    createdAt: { type: Date, default: Date.now }
});
exports.ChatMessage = mongoose_1.default.model('ChatMessage', ChatMessageSchema);
const NotificationSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    read: { type: Boolean, default: false },
    type: { type: String, enum: ['info', 'chat', 'funding', 'report'], default: 'info' },
    createdAt: { type: Date, default: Date.now }
});
exports.Notification = mongoose_1.default.model('Notification', NotificationSchema);
const SimulationSchema = new mongoose_1.Schema({
    startupId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Startup', required: true },
    scenarioName: { type: String, required: true },
    burnRate: { type: Number, required: true },
    runway: { type: Number, required: true },
    initialCapital: { type: Number, required: true },
    customerGrowth: { type: Number, default: 0 },
    cac: { type: Number, default: 0 },
    ltv: { type: Number, default: 0 },
    projections: [{
            month: { type: Number },
            revenue: { type: Number },
            costs: { type: Number },
            cash: { type: Number }
        }],
    createdAt: { type: Date, default: Date.now }
});
exports.Simulation = mongoose_1.default.model('Simulation', SimulationSchema);
const AuditLogSchema = new mongoose_1.Schema({
    actorId: { type: String, required: true },
    action: { type: String, required: true },
    ipAddress: { type: String },
    details: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
exports.AuditLog = mongoose_1.default.model('AuditLog', AuditLogSchema);
