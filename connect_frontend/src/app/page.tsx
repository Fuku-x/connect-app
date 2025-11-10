import Image from "next/image";
import Link from "next/link";
import React from "react";

/**
 * ホームページコンポーネント
 */
const Home: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between bg-white py-32 px-4 dark:bg-black sm:items-start sm:px-8 md:px-16">
        <div className="flex flex-col items-center gap-12">
          <div className="relative h-8 w-48">
            <Image
              src="/next.svg"
              alt="Next.js Logo"
              className="dark:invert"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
          
          <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-black dark:text-zinc-50 sm:text-4xl">
              Welcome to Connect App
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Connect App は、Next.js と TypeScript を活用したモダンな Web アプリケーションです。
              開発を始めるには、
              <Link 
                href="/docs/getting-started" 
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                スタートガイド
              </Link>を確認してください。
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600 sm:w-auto"
            >
              ダッシュボードへ進む
            </Link>
            
            <a
              href="https://github.com/Fuku-x/connect-app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-6 font-medium text-zinc-900 transition-colors hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 sm:w-auto"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.595 1.028 2.688 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              GitHub で見る
            </a>
          </div>
        </div>
        
        <footer className="mt-16 w-full border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            {new Date().getFullYear()} Connect App. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Home;
