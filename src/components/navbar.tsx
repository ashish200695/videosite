import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">👻</span>
            </div>
            <span className="text-xl font-bold text-red-600 hidden sm:inline">Horror Stories</span>
          </Link>

          {/* Center - Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-red-500 transition">
              Home
            </Link>
            <Link href="/stories" className="hover:text-red-500 transition">
              Browse
            </Link>
            <Link href="/guidelines" className="hover:text-red-500 transition">
              Guidelines
            </Link>
          </div>

          {/* Right - Auth Links */}
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                Submit Story
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
