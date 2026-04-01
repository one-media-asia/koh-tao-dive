import Link from 'next/link';

export default function AdminNav() {
  return (
    <nav className="bg-gray-800 text-white px-4 py-2 flex space-x-4">
      <Link href="/admin"><span className="hover:underline">Dashboard</span></Link>
      <Link href="/admin/project-manager"><span className="hover:underline">Project Manager</span></Link>
      {/* Add more links as needed */}
    </nav>
  );
}
