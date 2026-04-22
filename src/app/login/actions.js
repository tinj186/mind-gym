'use server';

import { redirect } from 'next/navigation';

export async function loginAction(formData) {
  // Normalize inputs to match client-side logic
  const email = formData.get('email')?.toString().trim().toLowerCase();
  const password = formData.get('password')?.toString().trim();

  console.log(`Server Action: Attempting login for ${email}`);

  // Pull the access code from environment, matching the client-side logic
  const accessCode = process.env.NEXT_PUBLIC_APP_ACCESS_CODE || 'gym-2026';

  if (email === 'student@mathmindgym.com' && password === accessCode) {
    console.log('Server Action: Access Granted. Redirecting...');
    redirect('/');
  }
  // Failure logic can be added here if needed for server-side feedback
}