import { enforceActiveSubscription } from '@/lib/auth-utils';

export default async function HubLayout({ children }) {
  // Ensure only users with ACTIVE subscriptions can access the Hub or its wings
  await enforceActiveSubscription();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Main Content Rendered Here */}
      {children}
    </div>
  );
}
