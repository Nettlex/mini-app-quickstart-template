import { NextRequest } from 'next/server';

/**
 * Simple admin authentication middleware
 * Checks for admin secret in Authorization header
 * 
 * In production, set ADMIN_SECRET_KEY environment variable
 */
export function isAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const adminSecret = process.env.ADMIN_SECRET_KEY;
  
  if (!adminSecret) {
    console.warn('⚠️  ADMIN_SECRET_KEY not configured! Admin endpoints are unprotected.');
    // In development, allow without secret (but warn)
    return process.env.NODE_ENV === 'development';
  }
  
  if (!authHeader) {
    return false;
  }
  
  // Support both "Bearer <secret>" and raw secret
  const providedSecret = authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7)
    : authHeader;
  
  return providedSecret === adminSecret;
}

/**
 * Returns a 401 response for unauthorized access
 */
export function unauthorizedResponse() {
  return Response.json(
    { error: 'Unauthorized. Admin authentication required.' },
    { status: 401 }
  );
}

