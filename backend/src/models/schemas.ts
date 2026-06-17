import mongoose, { Schema, Document } from 'mongoose';

// User Schema
export interface IUser extends Document {
  email: string;
  name?: string;
  role: 'Founder' | 'Investor' | 'Mentor' | 'Admin';
  firebaseUid: string;
  avatarUrl?: string;
  bio?: string;
  stripeCustomerId?: string;
  subscriptionPlan: 'Free' | 'Starter' | 'Pro' | 'Enterprise';
  subscriptionStatus: string;
  subscriptionEnd?: Date;
  skills: string[];
  interests: string[];
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
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

export const User = mongoose.model<IUser>('User', UserSchema);

// Startup Schema
export interface IStartup extends Document {
  ownerId: mongoose.Types.ObjectId;
  name: string;
  tagline: string;
  description: string;
  industry: string;
  targetMarket: string;
  fundingStage: 'Idea' | 'Pre-Seed' | 'Seed' | 'SeriesA' | 'Growth';
  businessModel: string;
  revenueProjections: number;
  technologyStack: string[];
  teamComposition: string[];
  logoUrl?: string;
  pitchDeckUrl?: string;
  businessPlanUrl?: string;
  successScore: number;
  riskScore: number;
  investmentReady: boolean;
  growthPotential: string;
  confidenceScore: number;
  createdAt: Date;
}

const StartupSchema = new Schema<IStartup>({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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

export const Startup = mongoose.model<IStartup>('Startup', StartupSchema);

// BusinessPlan Schema
export interface IBusinessPlan extends Document {
  startupId: mongoose.Types.ObjectId;
  content: string;
  pdfUrl?: string;
  createdAt: Date;
}

const BusinessPlanSchema = new Schema<IBusinessPlan>({
  startupId: { type: Schema.Types.ObjectId, ref: 'Startup', required: true },
  content: { type: String, required: true },
  pdfUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const BusinessPlan = mongoose.model<IBusinessPlan>('BusinessPlan', BusinessPlanSchema);

// ChatMessage Schema
export interface IChatMessage extends Document {
  senderId: string; // Firebase UID
  receiverId?: string; // Target user Firebase UID
  channelId?: string; // Channel name for team chat
  content: string;
  type: 'direct' | 'channel';
  createdAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  senderId: { type: String, required: true },
  receiverId: { type: String },
  channelId: { type: String },
  content: { type: String, required: true },
  type: { type: String, enum: ['direct', 'channel'], required: true },
  createdAt: { type: Date, default: Date.now }
});

export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);

// Notification Schema
export interface INotification extends Document {
  userId: string; // Firebase UID
  title: string;
  body: string;
  read: boolean;
  type: 'info' | 'chat' | 'funding' | 'report';
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  read: { type: Boolean, default: false },
  type: { type: String, enum: ['info', 'chat', 'funding', 'report'], default: 'info' },
  createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

// Simulation Schema
export interface ISimulation extends Document {
  startupId: mongoose.Types.ObjectId;
  scenarioName: string;
  burnRate: number;
  runway: number;
  initialCapital: number;
  customerGrowth: number;
  cac: number;
  ltv: number;
  projections: Array<{ month: number; revenue: number; costs: number; cash: number }>;
  createdAt: Date;
}

const SimulationSchema = new Schema<ISimulation>({
  startupId: { type: Schema.Types.ObjectId, ref: 'Startup', required: true },
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

export const Simulation = mongoose.model<ISimulation>('Simulation', SimulationSchema);

// AuditLog Schema
export interface IAuditLog extends Document {
  actorId: string;
  action: string;
  ipAddress?: string;
  details: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  actorId: { type: String, required: true },
  action: { type: String, required: true },
  ipAddress: { type: String },
  details: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
