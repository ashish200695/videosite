export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-red-600 mb-4">Horror Stories</h3>
            <p className="text-gray-400 text-sm">
              A platform for horror storytellers to share their work and earn.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-red-500">Home</a></li>
              <li><a href="/stories" className="hover:text-red-500">Browse Stories</a></li>
              <li><a href="/guidelines" className="hover:text-red-500">Guidelines</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/terms" className="hover:text-red-500">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-red-500">Privacy Policy</a></li>
              <li><a href="/dmca" className="hover:text-red-500">DMCA</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: <a href="mailto:support@horrorstories.com" className="hover:text-red-500">support@horrorstories.com</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Horror Stories Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
