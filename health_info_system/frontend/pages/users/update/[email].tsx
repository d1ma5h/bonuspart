// pages/users/update/[email].tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';

interface Country {
  cname: string;
  population: number;
}

interface User {
  email: string;
  name: string;
  surname: string;
  phone: string;
  cname: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function UpdateUser() {
  const router = useRouter();
  const { email } = router.query;

  const { data: userData, error: userError } = useSWR<User>(
    email ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${email}` : null,
    fetcher
  );

  const { data: countriesData, error: countriesError } = useSWR<{ countries: Country[] }>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/countries`,
    fetcher
  );

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    surname: '',
    phone: '',
    cname: '',
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        email: userData.email,
        name: userData.name,
        surname: userData.surname,
        phone: userData.phone,
        cname: userData.cname,
      });
    }
  }, [userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      router.push('/users');
    } catch (error: any) {
      console.error(error);
      alert(`Error updating user: ${error.message}`);
    }
  };

  if (userError || countriesError) {
    return (
      <div className="text-red-500">
        Failed to load data.{' '}
        <Button variant="secondary" onClick={() => router.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!userData || !countriesData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Update User</h2>
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
            readOnly
          />
        </div>
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <Input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        {/* Surname */}
        <div>
          <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
            Surname
          </label>
          <Input
            type="text"
            name="surname"
            id="surname"
            required
            value={formData.surname}
            onChange={handleChange}
          />
        </div>
        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <Input
            type="tel"
            name="phone"
            id="phone"
            required
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        {/* Country */}
        <div>
          <label htmlFor="cname" className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <Select
            name="cname"
            id="cname"
            required
            value={formData.cname}
            onChange={handleChange}
          >
            <option value="">Select a country</option>
            {countriesData.countries.map((country) => (
              <option key={country.cname} value={country.cname}>
                {country.cname}
              </option>
            ))}
          </Select>
        </div>
        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="secondary" onClick={() => router.push('/users')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Update
          </Button>
        </div>
      </form>
    </div>
  );
}
