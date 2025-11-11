'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import components with no SSR
const Header = dynamic(() => import('@/components/Header/Header'), { ssr: false });
const HeroSection = dynamic(() => import('@/components/HeroSection/HeroSection'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer/Footer'), { ssr: false });

/**
 * ホームページコンポーネント
 */
const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // 認証状態をチェック（JWTトークンの有無など）
    const token = localStorage.getItem('token');
    if (token) {
      // トークンがある場合はダッシュボードにリダイレクト
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      <Header />
      <main className="flex-1">
        <HeroSection />
        
        {/* 特徴セクション */}
        <section id="features" className="bg-gray-50 py-16 dark:bg-zinc-900 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Connect App の特徴
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500 dark:text-gray-400">
                シンプルで使いやすいインターフェースで、チームの生産性を向上させます。
              </p>
            </div>

            <div className="mt-16">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    name: 'リアルタイムチャット',
                    description: 'チームメンバーとリアルタイムでコミュニケーションが取れます。',
                    icon: (
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    ),
                  },
                  {
                    name: 'タスク管理',
                    description: 'プロジェクトのタスクを効率的に管理し、進捗を可視化します。',
                    icon: (
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    ),
                  },
                  {
                    name: 'ファイル共有',
                    description: '必要なファイルをチームメンバーと簡単に共有できます。',
                    icon: (
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    ),
                  },
                ].map((feature, index) => (
                  <div key={index} className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-zinc-800">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30">
                      {feature.icon}
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{feature.name}</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
