import Navigation from "@/components/Navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-900 min-h-screen font-sans">
        <header className="border-b bg-white shadow-sm sticky top-0 z-30 w-full">
          <Navigation session={session} />
        </header>
        <main className="flex-1 w-full">{children}</main>
        <footer className="border-t bg-white text-neutral-500 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Navigation Links */}
              <div>
                <h3 className="font-semibold text-neutral-700 mb-4">Navigate</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-sm hover:text-neutral-700 transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/explore" className="text-sm hover:text-neutral-700 transition-colors">
                      Explore
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="text-sm hover:text-neutral-700 transition-colors">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/guide" className="text-sm hover:text-neutral-700 transition-colors">
                      Guide
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Research Links */}
              <div>
                <h3 className="font-semibold text-neutral-700 mb-4">Research</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/research" className="text-sm hover:text-neutral-700 transition-colors">
                      Publications
                    </Link>
                  </li>
                  <li>
                    <Link href="/research/neuroscience" className="text-sm hover:text-neutral-700 transition-colors">
                      Neuroscience
                    </Link>
                  </li>
                  <li>
                    <Link href="/research/computer-vision" className="text-sm hover:text-neutral-700 transition-colors">
                      Computer Vision
                    </Link>
                  </li>
                  <li>
                    <Link href="/research/collaboration" className="text-sm hover:text-neutral-700 transition-colors">
                      Collaboration
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Tools & Resources */}
              <div>
                <h3 className="font-semibold text-neutral-700 mb-4">Tools & Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/annotate" className="text-sm hover:text-neutral-700 transition-colors">
                      Annotation Tool
                    </Link>
                  </li>
                  <li>
                    <Link href="/research/dataset" className="text-sm hover:text-neutral-700 transition-colors">
                      Dataset
                    </Link>
                  </li>
                  <li>
                    <Link href="/research/annotation-tools" className="text-sm hover:text-neutral-700 transition-colors">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-sm hover:text-neutral-700 transition-colors">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Newsletter Signup */}
              <div>
                <h3 className="font-semibold text-neutral-700 mb-4">Stay Updated</h3>
                <p className="text-sm mb-4">
                  Subscribe to receive updates on new research, datasets, and tool releases.
                </p>
                <form className="space-y-3">
                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <Button type="submit" size="sm" className="w-full">
                    Subscribe
                  </Button>
                </form>
                <p className="text-xs mt-2 text-neutral-400">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-neutral-200 pt-8">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-8">
                {/* Copyright */}
                <div className="text-center lg:text-left grid gap-4">
                  <p className="text-xs font-medium text-neutral-600">
                    &copy; {new Date().getFullYear()} Sesame Street Archive
                  </p>
                  <p className="text-xs leading-relaxed text-neutral-500">
                    This site is not affiliated with Sesame Workshop or the Joan Ganz Cooney Center. 
                    All trademarks and copyrights are the property of their respective owners. 
                    The Sesame Street Archive is for educational and research purposes only.
                  </p>
                </div>
                {/* Legal Links */}
                <div className="flex justify-center lg:justify-end space-x-6">
                  <Link href="/privacy" className="text-xs hover:text-neutral-700 transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="text-xs hover:text-neutral-700 transition-colors">
                    Terms of Use
                  </Link>
                  <Link href="/accessibility" className="text-xs hover:text-neutral-700 transition-colors">
                    Accessibility
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}