// pages/doctors/index.tsx
import useSWR from 'swr';
import { Button } from '../../components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Doctor {
  email: string;
  degree: string;
  salary: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function DoctorsList() {
  const router = useRouter();
  const { data, error, mutate } = useSWR<{ doctors: Doctor[] }>('http://127.0.0.1:5000/api/doctors', fetcher);

  const handleDelete = async (email: string) => {
    if (!confirm('Are you sure you want to delete this doctor?')) return;

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/doctors/${email}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete doctor');
      }

      mutate(); // Refresh the data
    } catch (error: any) {
      console.error('Error deleting doctor:', error);
      alert(`Error deleting doctor: ${error.message}`);
    }
  };

  if (error) {
    return <div className="text-red-500">Failed to load doctors.</div>;
  }

  if (!data) {
    return <div className="text-center">Loading doctors...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Doctors</h2>
        <Link href="/doctors/create">
          <Button variant="primary">Add New Doctor</Button>
        </Link>
      </div>
      {data.doctors.length === 0 ? (
        <div className="text-center text-gray-500">No doctors found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Degree</th>
                <th className="py-2 px-4 border-b">Salary</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.doctors.map((doctor) => (
                <tr key={doctor.email}>
                  <td className="py-2 px-4 border-b">{doctor.email}</td>
                  <td className="py-2 px-4 border-b">{doctor.degree}</td>
                  <td className="py-2 px-4 border-b">{doctor.salary}</td>
                  <td className="py-2 px-4 border-b space-x-2">
                    <Link href={`/doctors/update/${doctor.email}`}>
                      <Button variant="secondary">Edit</Button>
                    </Link>
                    <Button variant="danger" onClick={() => handleDelete(doctor.email)}>
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
