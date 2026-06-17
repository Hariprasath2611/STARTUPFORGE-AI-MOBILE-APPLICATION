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
exports.requireRole = exports.authenticateJWT = void 0;
const admin = __importStar(require("firebase-admin"));
const schemas_1 = require("../models/schemas");
// Initialize firebase admin conditionally
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('✅ Firebase Admin SDK initialized.');
    }
    else if (process.env.FIREBASE_PROJECT_ID) {
        admin.initializeApp({
            projectId: process.env.FIREBASE_PROJECT_ID
        });
        console.log('✅ Firebase Admin SDK initialized with Project ID.');
    }
}
catch (error) {
    console.warn('⚠️ Firebase Admin SDK initialization failed. Operating in mock auth mode.', error);
}
const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization header missing or invalid format' });
    }
    const token = authHeader.split(' ')[1];
    // For testing and local mock development, allow "mock-token-<uid>" format
    if (token.startsWith('mock-token-') || process.env.NODE_ENV === 'test' || !process.env.FIREBASE_PROJECT_ID) {
        const mockUid = token.replace('mock-token-', '') || 'test-user-uid';
        try {
            let user = await schemas_1.User.findOne({ firebaseUid: mockUid });
            if (!user) {
                // Auto-create user for testing ease
                user = await schemas_1.User.create({
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
        }
        catch (err) {
            return res.status(500).json({ error: 'Mock authentication handler failed' });
        }
    }
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.firebaseUid = decodedToken.uid;
        let user = await schemas_1.User.findOne({ firebaseUid: decodedToken.uid });
        if (!user) {
            // Create user if they exist in Firebase but not in our DB
            user = await schemas_1.User.create({
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
    }
    catch (error) {
        console.error('❌ Authentication failed:', error);
        return res.status(403).json({ error: 'Unauthorized credentials' });
    }
};
exports.authenticateJWT = authenticateJWT;
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied: Insufficient privileges' });
        }
        next();
    };
};
exports.requireRole = requireRole;
