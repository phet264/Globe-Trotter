import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';
import { registerSchema } from '@/lib/validations/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { generateRequestId } from '@/lib/requestId';

export async function POST(req: Request) {
  const requestId = generateRequestId();
  
  try {
    const body = await req.json();
    const validatedData = await registerSchema.parseAsync(body);
    
    // Check for duplicate email safely
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        errorResponse('EMAIL_IN_USE', 'This email is already registered.', requestId),
        { status: 409 }
      );
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 10);
    
    // Create user and return safe object
    const newUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
      }
    });
    
    return NextResponse.json(
      successResponse({ user: newUser })
    );
    
  } catch (error) {
    const err = error as Error;
    if (err.name === 'ZodError') {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Invalid input data', requestId),
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      errorResponse('INTERNAL_SERVER_ERROR', 'An unexpected error occurred', requestId),
      { status: 500 }
    );
  }
}
