// pages/index.tsx
import Link from 'next/link';
import { Button } from '../components/ui/Button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to the Health Information System</h1>
      <div className="space-x-4">
        <Link href="/users">
          <Button variant="primary">Manage Users</Button>
        </Link>
        <Link href="/doctors">
          <Button variant="primary">Manage Doctors</Button>
        </Link>
      </div>
    </div>
  );
}
