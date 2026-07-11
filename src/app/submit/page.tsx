'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TextArea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { VIDEO_CATEGORIES } from '@/lib/constants';

export default function SubmitPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    language: 'Hindi',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!termsAccepted) {
      setError('You must accept the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const submitData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      };

      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Submission failed');
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Submit Your Horror Story</h1>
            <p className="text-gray-400">Share your spine-chilling story with our community and start earning</p>
          </div>

          {error && (
            <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="bg-gray-800 rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Story Title"
                id="title"
                placeholder="Enter a captivating title for your story"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <TextArea
                label="Story Description"
                id="description"
                placeholder="Write a detailed description of your horror story (minimum 20 characters)"
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />

              <Select
                label="Category"
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                options={VIDEO_CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
                required
              />

              <Input
                label="Tags (comma-separated)"
                id="tags"
                placeholder="e.g., supernatural, spooky, paranormal"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />

              <Select
                label="Language"
                id="language"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                options={[
                  { value: 'Hindi', label: 'Hindi' },
                  { value: 'English', label: 'English' },
                  { value: 'Other', label: 'Other' },
                ]}
              />

              <div className="bg-gray-700 rounded-lg p-6 mt-6">
                <h3 className="font-semibold mb-4">Video Upload</h3>
                <p className="text-gray-300 mb-4">
                  In the next step, you'll be able to upload your video file. The video will be stored temporarily for review by our moderation team.
                </p>
                <p className="text-sm text-gray-400">
                  Once approved, your video will be uploaded to Dailymotion and published on our platform.
                </p>
              </div>

              {/* Terms Checkbox */}
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-5 h-5"
                    required
                  />
                  <span className="text-sm text-gray-300">
                    I confirm this is my original content and I have full rights to it. I agree to the{' '}
                    <a href="/terms" className="text-red-500 hover:text-red-400">Terms of Service</a> and{' '}
                    <a href="/contributor-agreement" className="text-red-500 hover:text-red-400">Contributor Agreement</a>
                  </span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Story'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
