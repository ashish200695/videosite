'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Submission {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  revenueShare: number;
  totalEarnings: number;
  totalPaid: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/auth/login');
      return;
    }

    const storedUser = JSON.parse(userStr);
    setUser(storedUser);

    const fetchData = async () => {
      try {
        const [profileRes, submissionsRes] = await Promise.all([
          fetch('/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/submissions', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setUser(profileData);
        }

        if (submissionsRes.ok) {
          const submissionsData = await submissionsRes.json();
          setSubmissions(submissionsData.submissions || []);
        }
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}!</h1>
              <p className="text-gray-400">{user?.email}</p>
            </div>
            <div className="flex gap-4">
              <Link href="/submit">
                <Button className="bg-red-600 hover:bg-red-700">
                  Submit New Story
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-gray-400 text-sm mb-2">Total Submissions</p>
              <p className="text-3xl font-bold">{submissions.length}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-gray-400 text-sm mb-2">Revenue Share</p>
              <p className="text-3xl font-bold">{user?.revenueShare}%</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-gray-400 text-sm mb-2">Total Earnings</p>
              <p className="text-3xl font-bold text-red-500">₹{user?.totalEarnings.toFixed(2)}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <p className="text-gray-400 text-sm mb-2">Total Paid</p>
              <p className="text-3xl font-bold text-green-500">₹{user?.totalPaid.toFixed(2)}</p>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold">Your Submissions</h2>
            </div>
            <div className="overflow-x-auto">
              {submissions.length === 0 ? (
                <div className="p-6 text-center text-gray-400">
                  <p>No submissions yet. <Link href="/submit" className="text-red-500 hover:text-red-400">Submit your first story</Link></p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-900 text-left text-sm">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Title</th>
                      <th className="px-6 py-4 font-semibold">Category</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Submitted</th>
                      <th className="px-6 py-4 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {submissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-gray-700 transition">
                        <td className="px-6 py-4">
                          <p className="font-medium">{submission.title}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-400">{submission.category}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              submission.status === 'PUBLISHED'
                                ? 'bg-green-900 text-green-200'
                                : submission.status === 'REJECTED'
                                ? 'bg-red-900 text-red-200'
                                : submission.status === 'APPROVED'
                                ? 'bg-blue-900 text-blue-200'
                                : 'bg-yellow-900 text-yellow-200'
                            }`}
                          >
                            {submission.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/submissions/${submission.id}`}>
                            <Button size="sm" variant="ghost">
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
