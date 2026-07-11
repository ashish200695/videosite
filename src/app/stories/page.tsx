'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { VIDEO_CATEGORIES } from '@/lib/constants';

interface Story {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl?: string;
  viewCount: number;
  contributor: {
    name?: string;
  } | null;
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category) params.append('category', category);
        params.append('page', page.toString());

        const response = await fetch(`/api/stories?${params}`);
        const data = await response.json();
        setStories(data.stories || []);
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [search, category, page]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-12">Browse Stories</h1>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Input
              placeholder="Search stories..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <Select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              options={[
                { value: '', label: 'All Categories' },
                ...VIDEO_CATEGORIES.map((cat) => ({ value: cat, label: cat })),
              ]}
            />
          </div>

          {/* Stories Grid */}
          {loading ? (
            <div className="py-12">
              <LoadingSpinner />
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No stories found. Try a different search.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stories.map((story) => (
                  <Link key={story.id} href={`/stories/${story.id}`}>
                    <div className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition cursor-pointer group h-full flex flex-col">
                      <div className="relative overflow-hidden h-48 bg-gray-700">
                        {story.thumbnailUrl && (
                          <img
                            src={story.thumbnailUrl}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:brightness-75 transition"
                          />
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-sm text-red-500 mb-2">{story.category}</p>
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{story.title}</h3>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-400">
                          <span>{story.viewCount.toLocaleString()} views</span>
                          {story.contributor?.name && (
                            <span>{story.contributor.name}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-800 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">Page {page}</span>
                <button
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
