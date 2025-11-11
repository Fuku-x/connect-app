'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const DashboardPage = () => {
  const router = useRouter();

  useEffect(() => {
    // 認証状態をチェック
    const token = localStorage.getItem('access_token');
    if (!token) {
      // トークンがない場合はログインページにリダイレクト
      router.push('/auth/login');
    }
  }, [router]);

  const handleLogout = () => {
    // トークンとユーザー情報を削除
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    // ログインページにリダイレクト
    router.push('/auth/login');
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50 dark:bg-zinc-900">
      <header className="bg-white shadow-sm dark:bg-zinc-800">
        <div className="mx-auto w-full px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/next.svg"
                  alt="Kobe Connect"
                  width={100}
                  height={24}
                  className="dark:invert"
                  priority
                />
                <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">Kobe Connect</span>
              </Link>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:bg-red-700 dark:hover:bg-red-600"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kobe Connect Dashboard</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              ログインに成功しました！ここからアプリケーションの機能をご利用いただけます。
            </p>
            
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'プロフィール',
                  description: 'アカウント情報の確認と編集が行えます。',
                  icon: (
                    <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  ),
                  href: '/dashboard/profile',
                },
                {
                  title: 'メッセージ',
                  description: 'チームメンバーとメッセージをやり取りできます。',
                  icon: (
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  ),
                  href: '/dashboard/messages',
                },
                {
                  title: 'タスク',
                  description: 'タスクの作成と管理が行えます。',
                  icon: (
                    <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  ),
                  href: '/dashboard/tasks',
                },
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex flex-col rounded-lg border border-gray-200 p-6 transition-colors hover:bg-gray-50 dark:border-zinc-700 dark:hover:bg-zinc-700/50"
                >
                  <div className="mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                  <div className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    開く →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t border-gray-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Connect App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
