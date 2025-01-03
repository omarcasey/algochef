import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-black">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-4 gap-8">
          {/* Logo and CTA */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/tradetrackr logo.jpg"
                alt="Logo"
                width={40}
                height={40}
              />
              <span className="text-xl text-white font-medium">AlgoChef</span>
            </Link>
            <p className="mt-4 text-xl font-medium text-white">
              Let's create something awesome together!
            </p>
            <button className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Get AlgoChef
            </button>
          </div>

          {/* Pages */}
          <div className="col-span-1"></div>
          <div className="col-span-1">
            <h3 className="text-gray-400 font-medium mb-4">Pages</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/features"
                  className="text-white hover:text-gray-300"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-white hover:text-gray-300"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white hover:text-gray-300">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* More Pages */}
          {/* <div className="col-span-1">
            <h3 className="text-gray-400 font-medium mb-4">Pages</h3>
            <ul className="space-y-3">
              <li><Link href="/post" className="text-white hover:text-gray-300">Post</Link></li>
              <li><Link href="/contact" className="text-white hover:text-gray-300">Contact</Link></li>
              <li><Link href="/404" className="text-white hover:text-gray-300">404</Link></li>
            </ul>
          </div> */}

          {/* Socials */}
          <div className="col-span-1">
            <h3 className="text-gray-400 font-medium mb-4">Socials</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://twitter.com"
                  className="text-white hover:text-gray-300"
                >
                  Twitter (x)
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  className="text-white hover:text-gray-300"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  className="text-white hover:text-gray-300"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://dribbble.com"
                  className="text-white hover:text-gray-300"
                >
                  Dribbble
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-900 mt-10">
          <div className="mt-5 flex space-x-10">
            <Link href="" className="text-gray-500 transition-all hover:text-gray-300">Privacy Policy</Link>
            <Link href="" className="text-gray-500 flex-1 transition-all hover:text-gray-300">Terms & Conditions</Link>
            <p className="text-gray-500">© 2024 AlgoChef. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
