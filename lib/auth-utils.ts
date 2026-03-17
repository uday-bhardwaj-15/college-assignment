import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from './db';
import User from '../models/User';

const secret = process.env.AUTH_SECRET;

/**
 * Middleware utility to authenticate custom API routes 
 * expecting a JWT token.
 */
export async function authenticate(req: NextRequest) {
  try {
    // Check for authorization header (Bearer token)
    const authHeader = req.headers.get('authorization');
    let tokenValue = '';
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      tokenValue = authHeader.substring(7);
      
      // Inject it into a mock NextAuth session cookie structure so getToken can parse it
      // if it was supplied purely as a Bearer string. 
      // Note: next-auth/jwt prefers cookies. We can also just decode it if standard JWT.
    }
    
    // Instead of forcing next-auth cookies, we can decode the raw JWT if needed, 
    // but the cleanest way is using the built-in getToken which reads req.cookies
    const decoded = await getToken({ req, secret, raw: true });
    
    // Fall back to manual verify if token is passed via header in custom apps
    const finalToken = tokenValue || decoded;

    if (!finalToken) {
      return { user: null, error: 'Unauthorized: No token provided' };
    }

    // Since we are mocking the next-auth JWT behavior, we need a manual jwt.verify 
    // if `getToken` fails because the frontend didn't set the cookie.
    const jwt = require('jsonwebtoken');
    const payload = jwt.verify(finalToken, secret || process.env.NEXTAUTH_SECRET || 'fallback_secret_do_not_use');

    await dbConnect();
    const user = await User.findById(payload.sub || payload.id);
    
    if (!user) {
       return { user: null, error: 'User not found' };
    }

    return { user, error: null };
  } catch (error) {
    console.error('Authentication error:', error);
    return { user: null, error: 'Invalid token' };
  }
}
