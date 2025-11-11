import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-16 lg:px-8">
        <nav className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
          <div className="pb-6">
            <Link href="/about" className="text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              会社情報
            </Link>
          </div>
          <div className="pb-6">
            <Link href="/privacy" className="text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              プライバシーポリシー
            </Link>
          </div>
          <div className="pb-6">
            <Link href="/terms" className="text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              利用規約
            </Link>
          </div>
          <div className="pb-6">
            <Link href="/contact" className="text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              お問い合わせ
            </Link>
          </div>
        </nav>
        <p className="mt-10 text-center text-xs leading-5 text-gray-500 dark:text-gray-400">
          &copy; {currentYear} Connect App. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
