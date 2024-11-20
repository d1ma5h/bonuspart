// pages/doctors/create.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function CreateDoctor() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    degree: '',
    salary: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/api/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create doctor');
      }

      router.push('/doctors');
    } catch (error: any) {
      console.error(error);
      alert(`Error creating doctor: ${error.message}`);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Doctor</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            type="email"
            name="email"
            id="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        {/* Degree */}
        <div>
          <label htmlFor="degree" className="block text-sm font-medium text-gray-700">
            Degree
          </label>
          <Input
            type="text"
            name="degree"
            id="degree"
            required
            value={formData.degree}
            onChange={handleChange}
          />
        </div>
        {/* Salary */}
        <div>
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
            Salary
          </label>
          <Input
            type="text"
            name="salary"
            id="salary"
            required
            value={formData.salary}
            onChange={handleChange}
          />
        </div>
        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="secondary" onClick={() => router.push('/doctors')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create
          </Button>
        </div>
      </form>
    </div>
  );
}
