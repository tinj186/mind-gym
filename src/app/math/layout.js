import { enforceActiveSubscription } from '@/lib/auth-utils';

export default async function MathLayout({ children }) {
  // Ensure only users with ACTIVE subscriptions can access the Math wings
  await enforceActiveSubscription();

  return (
    <>
      {children}
    </>
  );
}
