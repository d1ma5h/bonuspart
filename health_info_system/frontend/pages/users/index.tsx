// pages/users/index.tsx

import useSWR from 'swr';
import { Button } from '../../components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface User {
  email: string;
  name: string;
  surname: string;
  phone: string;
  cname: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function UsersList() {
  const router = useRouter();
  const { data, error, mutate } = useSWR<{ users: User[] }>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
    fetcher
  );

  const handleDelete = async (email: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${email}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      mutate(); // Refresh the data
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert(`Error deleting user: ${error.message}`);
    }
  };

  if (error) {
    return <div className="text-red-500">Failed to load users.</div>;
  }

  if (!data) {
    return <div className="text-center">Loading users...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Users</h2>
        <Link href="/users/create">
          <Button variant="primary">Add New User</Button>
        </Link>
      </div>
      {data.users.length === 0 ? (
        <div className="text-center text-gray-500">No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Surname</th>
                <th className="py-2 px-4 border-b">Phone</th>
                <th className="py-2 px-4 border-b">Country</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr key={user.email}>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{user.name}</td>
                  <td className="py-2 px-4 border-b">{user.surname}</td>
                  <td className="py-2 px-4 border-b">{user.phone}</td>
                  <td className="py-2 px-4 border-b">{user.cname}</td>
                  <td className="py-2 px-4 border-b space-x-2">
                    <Link href={`/users/update/${user.email}`}>
                      <Button variant="secondary">Edit</Button>
                    </Link>
                    <Button variant="danger" onClick={() => handleDelete(user.email)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
