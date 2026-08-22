import { NextResponse } from 'next/server';
import { signOut } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { generateRequestId } from '@/lib/requestId';

export async function POST() {
  const requestId = generateRequestId();
  try {
    const cookieName = process.env.NODE_ENV === 'production' ? '__Secure-authjs.session-token' : 'authjs.session-token';
    const response = NextResponse.json(successResponse({ message: 'Logout successful' }));
    response.cookies.delete(cookieName);
    return response;
  } catch {
    return NextResponse.json(
      errorResponse('LOGOUT_FAILED', 'Failed to log out securely', requestId),
      { status: 500 }
    );
  }
}
