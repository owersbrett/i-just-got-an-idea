import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-100">
      <div className="max-w-6xl mx-auto py-4 px-5 sm:px-6 lg:px-8">
        <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
          <div className="px-5 py-2">
            <Link href="/">
              <a className="text-base text-gray-500 hover:text-gray-900">Home</a>
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link href="/about">
              <a className="text-base text-gray-500 hover:text-gray-900">About</a>
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link href="/contact">
              <a className="text-base text-gray-500 hover:text-gray-900">Contact</a>
            </Link>
          </div>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
