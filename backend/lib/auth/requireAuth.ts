import { auth } from "@/lib/auth";

export async function requireAuthenticatedUser() {
  const session = await auth();
  if (!session?.user?.id) {
    // LOCAL DEV HACK: Since NextAuth login is bypassed locally, fallback to the first user
    const { prisma } = await import('@/lib/db/prisma');
    const firstUser = await prisma.user.findFirst();
    
    if (firstUser) {
      return {
        id: firstUser.id,
        name: firstUser.name,
        email: firstUser.email,
      };
    }
    
    throw new Error("UNAUTHENTICATED");
  }
  
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  };
}
