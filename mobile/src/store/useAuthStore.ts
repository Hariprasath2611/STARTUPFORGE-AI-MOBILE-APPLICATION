import { create } from 'zustand';

export interface UserProfile {
  _id: string;
  email: string;
  name: string;
  role: 'Founder' | 'Investor' | 'Mentor' | 'Admin';
  firebaseUid: string;
  avatarUrl?: string;
  bio?: string;
  subscriptionPlan: 'Free' | 'Starter' | 'Pro' | 'Enterprise';
  subscriptionStatus: string;
  skills: string[];
  interests: string[];
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UserProfile, token: string) => void;
  clearAuth: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
  clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
  updateProfile: (updated) => set((state) => ({
    user: state.user ? { ...state.user, ...updated } : null
  }))
}));
