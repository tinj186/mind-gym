'use server';

import { redirect } from 'next/navigation';

export async function loginAction(formData) {
  // Normalize inputs to match client-side logic
  const email = formData.get('email')?.toString().trim().toLowerCase();
  const password = formData.get('password')?.toString().trim();

  console.log(`Server Action: Attempting login for ${email}`);

  if (email === 'student@mathmindgym.com' && password === 'gym2026') {
    console.log('Server Action: Access Granted. Redirecting...');
    redirect('/');
  }
}