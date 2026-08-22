import { NextResponse } from 'next/server';
import { signIn } from '@/lib/auth';
import { loginSchema } from '@/lib/validations/auth';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { generateRequestId } from '@/lib/requestId';

export async function POST(req: Request) {
  const requestId = generateRequestId();
  
  try {
    const body = await req.json();
    const validatedData = await loginSchema.parseAsync(body);
    
    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });
    
    return NextResponse.json(
      successResponse({ message: 'Login successful' })
    );
    
  } catch (error) {
    const err = error as Error & { type?: string };
    if (err.name === 'ZodError') {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Invalid input data', requestId),
        { status: 400 }
      );
    }
    
    // Auth.js throws CredentialsSignin for invalid login
    if (err.type === 'CredentialsSignin' || err.name === 'CredentialsSignin' || err.message?.includes('Credentials')) {
      return NextResponse.json(
        errorResponse('INVALID_CREDENTIALS', 'Invalid email or password', requestId),
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      errorResponse('INTERNAL_SERVER_ERROR', 'An unexpected error occurred during login', requestId),
      { status: 500 }
    );
  }
}
