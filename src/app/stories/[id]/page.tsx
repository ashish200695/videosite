'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface StoryDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  dailymotionEmbedCode: string;
  viewCount: number;
  estimatedRevenue: number;
  contributor?: {
    name?: string;
    bio?: string;
    profileImage?: string;
  };
}

export default function StoryPage({ params }: { params: { id: string } }) {
  const [story, setStory] = useState<StoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`/api/stories/${params.id}`);
        if (!response.ok) {
          throw new Error('Story not found');
        }
        const data = await response.json();
        setStory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading story');
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [params.id]);

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

  if (error || !story) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-500 text-xl">{error || 'Story not found'}</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Video Player */}
          <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden mb-8">
            {story.dailymotionEmbedCode ? (
              <div
                dangerouslySetInnerHTML={{ __html: story.dailymotionEmbedCode }}
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Video player unavailable
              </div>
            )}
          </div>

          {/* Story Info */}
          <div className="mb-8">
            <p className="text-red-500 text-sm mb-2">{story.category}</p>
            <h1 className="text-4xl font-bold mb-4">{story.title}</h1>
            <div className="flex gap-6 text-gray-400 mb-6">
              <span>👁️ {story.viewCount.toLocaleString()} views</span>
              <span>💰 ₹{story.estimatedRevenue.toFixed(2)} estimated revenue</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">About this story</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {story.description}
            </p>
          </div>

          {/* Creator Info */}
          {story.contributor && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">About the creator</h2>
              <div className="flex items-start gap-4">
                {story.contributor.profileImage && (
                  <img
                    src={story.contributor.profileImage}
                    alt={story.contributor.name}
                    className="w-16 h-16 rounded-full"
                  />
                )}
                <div>
                  <p className="font-semibold text-lg">{story.contributor.name || 'Unknown Creator'}</p>
                  {story.contributor.bio && (
                    <p className="text-gray-400 mt-2">{story.contributor.bio}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
