import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="w-full border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4" aria-label="Global">
        <div className="flex items-center gap-x-12">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-gray-900 dark:text-white">Kobe Connect</span>
          </Link>
          <div className="hidden md:flex md:gap-x-6">
            <Link href="/" className="text-sm font-medium text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
              ホーム
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <Link
            href="/auth/register"
            className="hidden rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700 dark:hover:bg-zinc-700 sm:block"
          >
            登録
          </Link>
          <Link
            href="/auth/login"
            className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            ログイン
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
