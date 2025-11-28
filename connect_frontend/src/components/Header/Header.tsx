'use client';

import Link from 'next/link';

const Header = () => {
  return (
    <header className="w-full border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="shrink-0">
              <Link 
                href="/" 
                className="text-xl font-bold text-gray-900 dark:text-white"
              >
                Kobe Connect
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/auth/register"
              className="hidden rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700 dark:hover:bg-zinc-700 sm:block"
            >
              登録
            </Link>
            <Link
              href="/auth/login"
              className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              ログイン
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
