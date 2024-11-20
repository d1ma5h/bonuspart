// components/Layout.tsx
import Link from 'next/link';
import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Health Info System
          </Link>
          <div className="space-x-4">
            <Link href="/users" className="hover:underline">
              Users
            </Link>
            <Link href="/doctors" className="hover:underline">
              Doctors
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-4 py-6">{children}</main>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          &copy; {new Date().getFullYear()} Health Info System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
