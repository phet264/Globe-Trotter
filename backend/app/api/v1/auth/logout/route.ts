import { NextResponse } from 'next/server';
import { signOut } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { generateRequestId } from '@/lib/requestId';

export async function POST() {
  const requestId = generateRequestId();
  try {
    await signOut({ redirect: false });
    return NextResponse.json(successResponse({ message: 'Logout successful' }));
  } catch {
    return NextResponse.json(
      errorResponse('LOGOUT_FAILED', 'Failed to log out securely', requestId),
      { status: 500 }
    );
  }
}
