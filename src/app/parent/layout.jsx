import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import SupportWidget from '@/components/support/SupportWidget';

export default async function ParentLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <>
      {children}
      <SupportWidget 
        defaultName={session?.user?.name || ''} 
        defaultEmail={session?.user?.email || ''} 
      />
    </>
  );
}
