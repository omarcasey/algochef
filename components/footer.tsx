import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-950 to-black pt-16 pb-8">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Top section with logo, CTA and links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and CTA */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 p-0.5 transition-all">
                <div className="absolute inset-0.5 bg-black rounded-lg"></div>
                <Image
                  src="/tradetrackr logo.jpg"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="relative z-10 rounded-lg"
                />
              </div>
              <span className="text-xl text-white font-medium group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-purple-500 transition-all">AlgoChef</span>
            </Link>
            <p className="mt-5 text-lg text-gray-400">
              Let's create something awesome together!
            </p>
            <div className="mt-6">
              <Link href="/signup" className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg">
                <span>Get Started</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Spacer for medium screens */}
          <div className="hidden md:block lg:hidden"></div>

          {/* Pages */}
          <div className="lg:col-span-1">
            <h3 className="text-sm uppercase font-semibold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 mb-5">Pages</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/features"
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-0 h-[1px] bg-gradient-to-r from-cyan-500 to-purple-500 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-0 h-[1px] bg-gradient-to-r from-cyan-500 to-purple-500 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-0 h-[1px] bg-gradient-to-r from-cyan-500 to-purple-500 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-0 h-[1px] bg-gradient-to-r from-cyan-500 to-purple-500 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div className="lg:col-span-1">
            <h3 className="text-sm uppercase font-semibold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 mb-5">Connect With Us</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://twitter.com"
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="w-0 h-[1px] bg-gradient-to-r from-cyan-500 to-purple-500 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="w-0 h-[1px] bg-gradient-to-r from-cyan-500 to-purple-500 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="w-0 h-[1px] bg-gradient-to-r from-cyan-500 to-purple-500 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  className="text-gray-300 hover:text-white transition-colors flex items-center group"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="w-0 h-[1px] bg-gradient-to-r from-cyan-500 to-purple-500 mr-0 group-hover:w-3 group-hover:mr-2 transition-all duration-300"></span>
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="text-sm uppercase font-semibold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 mb-5">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for trading insights and updates.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 py-2 px-4 bg-gray-900 border border-gray-800 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white text-sm"
              />
              <button className="py-2 px-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-r-lg text-white text-sm font-medium hover:from-cyan-600 hover:to-purple-600 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom section with copyright and legal links */}
        <div className="border-t border-gray-800 mt-14 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <p className="text-gray-400 text-sm">© 2024 AlgoChef. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-400 text-sm hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 text-sm hover:text-white transition-colors">Terms & Conditions</Link>
              <Link href="/cookies" className="text-gray-400 text-sm hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
