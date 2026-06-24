import { redirect } from 'next/navigation';
import { hasAccessTokenSession } from '../lib/server-session';

export default function HomePage(): never {
  if (hasAccessTokenSession()) {
    redirect('/dashboard');
  }

  redirect('/login');
}
