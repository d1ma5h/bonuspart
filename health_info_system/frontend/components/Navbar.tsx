import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              Health Info System
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/users" className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1">
                Users
              </Link>
              <Link href="/doctors" className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1">
                Doctors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
