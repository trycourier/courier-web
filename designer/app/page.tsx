import { redirect } from 'next/navigation';

export default function RootPage() {
  // Middleware handles the redirect with query params
  // This is a fallback in case middleware doesn't run
  redirect('/inbox-demo');
}
