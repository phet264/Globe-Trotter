import { NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/auth/requireAuth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { generateRequestId } from '@/lib/requestId';

export async function GET() {
  const requestId = generateRequestId();
  
  try {
    const user = await requireAuthenticatedUser();
    return NextResponse.json(successResponse({ user }));
  } catch {
    return NextResponse.json(
      errorResponse('UNAUTHENTICATED', 'Not authenticated', requestId),
      { status: 401 }
    );
  }
}
