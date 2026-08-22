import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';
import { loginSchema } from '@/lib/validations/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { generateRequestId } from '@/lib/requestId';
import { encode } from 'next-auth/jwt';

export async function POST(req: Request) {
  const requestId = generateRequestId();
  
  try {
    const body = await req.json();
    const validatedData = await loginSchema.parseAsync(body);
    
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });
    
    if (!user || !(await bcrypt.compare(validatedData.password, user.passwordHash))) {
      return NextResponse.json(
        errorResponse('INVALID_CREDENTIALS', 'Invalid email or password', requestId),
        { status: 401 }
      );
    }
    
    const cookieName = process.env.NODE_ENV === 'production' ? '__Secure-authjs.session-token' : 'authjs.session-token';
    const token = await encode({
      token: { id: user.id, name: user.name, email: user.email },
      secret: process.env.AUTH_SECRET || 'fallback-secret',
      salt: cookieName,
    });
    
    const response = NextResponse.json(
      successResponse({ user: { id: user.id, name: user.name, email: user.email } })
    );
    
    response.cookies.set(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });
    
    return response;
    
  } catch (error) {
    const err = error as Error;
    if (err.name === 'ZodError') {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Invalid input data', requestId),
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      errorResponse('INTERNAL_SERVER_ERROR', 'An unexpected error occurred during login', requestId),
      { status: 500 }
    );
  }
}
