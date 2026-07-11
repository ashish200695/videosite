'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { TextArea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Submission {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  rejectionReason?: string;
  contributor: {
    name: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [approvalData, setApprovalData] = useState({ dailymotionVideoId: '', rejectionReason: '' });
  const [error, setError] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      router.push('/auth/login');
      return;
    }

    const userData = JSON.parse(user);
    if (userData.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchSubmissions(token);
  }, [router]);

  const fetchSubmissions = async (token: string) => {
    try {
      const response = await fetch('/api/submissions?status=PENDING', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      setError('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedSubmission || !approvalData.dailymotionVideoId) {
      setError('Please enter Dailymotion Video ID');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`/api/submissions/${selectedSubmission.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'approve',
          dailymotionVideoId: approvalData.dailymotionVideoId,
        }),
      });

      if (response.ok) {
        setSubmissions(submissions.filter((s) => s.id !== selectedSubmission.id));
        setSelectedSubmission(null);
        setAction(null);
        setApprovalData({ dailymotionVideoId: '', rejectionReason: '' });
      } else {
        setError('Failed to approve submission');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  const handleReject = async () => {
    if (!selectedSubmission) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`/api/submissions/${selectedSubmission.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'reject',
          rejectionReason: approvalData.rejectionReason || 'No reason provided',
        }),
      });

      if (response.ok) {
        setSubmissions(submissions.filter((s) => s.id !== selectedSubmission.id));
        setSelectedSubmission(null);
        setAction(null);
        setApprovalData({ dailymotionVideoId: '', rejectionReason: '' });
      } else {
        setError('Failed to reject submission');
      }
    } catch (err) {
      setError('An error occurred');
    }
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
          <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

          {error && (
            <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Submissions List */}
            <div className="lg:col-span-2 bg-gray-800 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold">Pending Submissions ({submissions.length})</h2>
              </div>
              <div className="divide-y divide-gray-700 max-h-96 overflow-y-auto">
                {submissions.length === 0 ? (
                  <div className="p-6 text-center text-gray-400">
                    No pending submissions
                  </div>
                ) : (
                  submissions.map((submission) => (
                    <div
                      key={submission.id}
                      onClick={() => setSelectedSubmission(submission)}
                      className={`p-4 cursor-pointer hover:bg-gray-700 transition ${
                        selectedSubmission?.id === submission.id ? 'bg-gray-700' : ''
                      }`}
                    >
                      <p className="font-semibold">{submission.title}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        by {submission.contributor.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{submission.category}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Details & Actions */}
            <div className="bg-gray-800 rounded-lg p-6 h-fit">
              {selectedSubmission ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Title</p>
                    <p className="font-semibold">{selectedSubmission.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Contributor</p>
                    <p className="font-semibold">{selectedSubmission.contributor.name}</p>
                    <p className="text-sm text-gray-500">{selectedSubmission.contributor.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Category</p>
                    <p className="font-semibold">{selectedSubmission.category}</p>
                  </div>
                  <div className="border-t border-gray-700 pt-4">
                    <p className="text-sm text-gray-400 mb-3">Description</p>
                    <p className="text-sm text-gray-300 line-clamp-4">
                      {selectedSubmission.description}
                    </p>
                  </div>

                  {action === 'approve' && (
                    <div className="space-y-3 border-t border-gray-700 pt-4">
                      <Input
                        label="Dailymotion Video ID"
                        id="dailymotionId"
                        placeholder="e.g., x123456"
                        value={approvalData.dailymotionVideoId}
                        onChange={(e) =>
                          setApprovalData({ ...approvalData, dailymotionVideoId: e.target.value })
                        }
                      />
                      <Button
                        onClick={handleApprove}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Confirm Approval
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setAction(null);
                          setApprovalData({ dailymotionVideoId: '', rejectionReason: '' });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  {action === 'reject' && (
                    <div className="space-y-3 border-t border-gray-700 pt-4">
                      <TextArea
                        label="Rejection Reason"
                        id="rejectionReason"
                        placeholder="Explain why this submission is being rejected"
                        rows={3}
                        value={approvalData.rejectionReason}
                        onChange={(e) =>
                          setApprovalData({ ...approvalData, rejectionReason: e.target.value })
                        }
                      />
                      <Button
                        onClick={handleReject}
                        className="w-full bg-red-600 hover:bg-red-700"
                      >
                        Confirm Rejection
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setAction(null);
                          setApprovalData({ dailymotionVideoId: '', rejectionReason: '' });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  {!action && (
                    <div className="space-y-2 border-t border-gray-700 pt-4">
                      <Button
                        onClick={() => setAction('approve')}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => setAction('reject')}
                        variant="outline"
                        className="w-full text-red-500 border-red-500 hover:bg-red-900"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <p>Select a submission to review</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
