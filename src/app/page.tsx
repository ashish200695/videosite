import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';

export default function Home() {
  const featuredStories = [
    {
      id: '1',
      title: 'The Haunted Village',
      category: 'Village Horror',
      thumbnail: 'https://via.placeholder.com/300x200?text=Haunted+Village',
      views: 12500,
    },
    {
      id: '2',
      title: 'Urban Legend - The Black Phone',
      category: 'Urban Legends',
      thumbnail: 'https://via.placeholder.com/300x200?text=Black+Phone',
      views: 8300,
    },
    {
      id: '3',
      title: 'Paranormal Activity',
      category: 'Paranormal',
      thumbnail: 'https://via.placeholder.com/300x200?text=Paranormal',
      views: 15200,
    },
    {
      id: '4',
      title: 'The Ghost in the Mirror',
      category: 'Ghost Stories',
      thumbnail: 'https://via.placeholder.com/300x200?text=Ghost+Mirror',
      views: 9800,
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-950 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-red-600">Horror Stories</span> Platform
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Watch spine-chilling horror stories from talented Indian creators. Share your own story and earn from your content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/stories">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse Stories
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Submit Your Story
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Stories */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">Featured Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredStories.map((story) => (
                <Link key={story.id} href={`/stories/${story.id}`}>
                  <div className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition cursor-pointer group">
                    <div className="relative overflow-hidden h-48 bg-gray-700">
                      <img
                        src={story.thumbnail}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:brightness-75 transition"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-red-500 mb-2">{story.category}</p>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{story.title}</h3>
                      <p className="text-gray-400 text-sm">{story.views.toLocaleString()} views</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-red-600 mb-2">500+</p>
                <p className="text-gray-400">Stories Published</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-600 mb-2">50K+</p>
                <p className="text-gray-400">Active Viewers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-600 mb-2">₹50L+</p>
                <p className="text-gray-400">Revenue Shared</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-600 mb-2">200+</p>
                <p className="text-gray-400">Content Creators</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-red-900 to-red-800 rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Share Your Horror Story?</h2>
            <p className="text-lg text-gray-200 mb-8">
              Join our community of creators and start earning from your content today.
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
