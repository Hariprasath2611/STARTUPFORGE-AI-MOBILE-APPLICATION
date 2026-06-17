import { create } from 'zustand';

export interface Startup {
  _id: string;
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
  successScore: number;
  riskScore: number;
  investmentReady: boolean;
  growthPotential: string;
}

export interface Simulation {
  _id: string;
  scenarioName: string;
  burnRate: number;
  runway: number;
  initialCapital: number;
  projections: Array<{ month: number; revenue: number; costs: number; cash: number }>;
}

export interface ChatMessage {
  _id: string;
  senderId: string;
  receiverId?: string;
  channelId?: string;
  content: string;
  type: 'direct' | 'channel';
  createdAt: Date;
}

interface StartupState {
  startups: Startup[];
  activeStartup: Startup | null;
  simulations: Simulation[];
  chatMessages: ChatMessage[];
  setStartups: (startups: Startup[]) => void;
  setActiveStartup: (startup: Startup | null) => void;
  setSimulations: (simulations: Simulation[]) => void;
  addSimulation: (simulation: Simulation) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
  addChatMessage: (message: ChatMessage) => void;
}

export const useStartupStore = create<StartupState>((set) => ({
  startups: [],
  activeStartup: null,
  simulations: [],
  chatMessages: [],
  setStartups: (startups) => set({ startups }),
  setActiveStartup: (startup) => set({ activeStartup: startup }),
  setSimulations: (simulations) => set({ simulations }),
  addSimulation: (sim) => set((state) => ({ simulations: [sim, ...state.simulations] })),
  setChatMessages: (chatMessages) => set({ chatMessages }),
  addChatMessage: (msg) => set((state) => ({ chatMessages: [...state.chatMessages, msg] }))
}));
