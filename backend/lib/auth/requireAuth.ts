import { auth } from "@/lib/auth";

export async function requireAuthenticatedUser() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("UNAUTHENTICATED");
  }
  
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  };
}
