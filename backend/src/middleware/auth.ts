import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import { User, IUser } from '../models/schemas';

// Initialize firebase admin conditionally
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin SDK initialized.');
  } else if (process.env.FIREBASE_PROJECT_ID) {
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID
    });
    console.log('✅ Firebase Admin SDK initialized with Project ID.');
  }
} catch (error) {
  console.warn('⚠️ Firebase Admin SDK initialization failed. Operating in mock auth mode.', error);
}

export interface AuthenticatedRequest extends Request {
  user?: IUser;
  firebaseUid?: string;
}

export const authenticateJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or invalid format' });
  }

  const token = authHeader.split(' ')[1];

  // For testing and local mock development, allow "mock-token-<uid>" format
  if (token.startsWith('mock-token-') || process.env.NODE_ENV === 'test' || !process.env.FIREBASE_PROJECT_ID) {
    const mockUid = token.replace('mock-token-', '') || 'test-user-uid';
    try {
      let user = await User.findOne({ firebaseUid: mockUid });
      if (!user) {
        // Auto-create user for testing ease
        user = await User.create({
          email: `${mockUid}@startupforge.ai`,
          firebaseUid: mockUid,
          name: mockUid.charAt(0).toUpperCase() + mockUid.slice(1) + ' Founder',
          role: mockUid.includes('admin') ? 'Admin' : mockUid.includes('investor') ? 'Investor' : 'Founder',
          subscriptionPlan: 'Pro',
          subscriptionStatus: 'active'
        });
      }
      req.user = user;
      req.firebaseUid = mockUid;
      return next();
    } catch (err) {
      return res.status(500).json({ error: 'Mock authentication handler failed' });
    }
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.firebaseUid = decodedToken.uid;
    
    let user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
      // Create user if they exist in Firebase but not in our DB
      user = await User.create({
        email: decodedToken.email || '',
        name: decodedToken.name || '',
        firebaseUid: decodedToken.uid,
        role: 'Founder',
        subscriptionPlan: 'Free',
        subscriptionStatus: 'active'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Authentication failed:', error);
    return res.status(403).json({ error: 'Unauthorized credentials' });
  }
};

export const requireRole = (allowedRoles: Array<'Founder' | 'Investor' | 'Mentor' | 'Admin'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied: Insufficient privileges' });
    }

    next();
  };
};
