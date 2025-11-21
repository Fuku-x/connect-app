import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  if (typeof window === 'undefined') {
    return null; // サーバーサイドレンダリング時は何も表示しない
  }
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isAuthPage = pathname?.startsWith('/auth');
  const isLoginPage = pathname === '/auth/login';
  const isRegisterPage = pathname === '/auth/register';
  const isDashboardPage = pathname?.startsWith('/dashboard');
  
  // Show different navigation based on the current page
  const renderNavigation = () => {
    // Auth pages (login/register)
    if (isAuthPage) {
      return (
        <div className="flex items-center gap-x-4">
          {isLoginPage && (
            <Link
              href="/auth/register"
              className="rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700 dark:hover:bg-zinc-700"
            >
              登録
            </Link>
          )}
          {isRegisterPage && (
            <Link
              href="/auth/login"
              className="rounded-md bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              ログイン
            </Link>
          )}
        </div>
      );
    }

    // Dashboard/authenticated pages
    if (isDashboardPage) {
      return (
        <div className="flex items-center gap-x-4">
          {pathname !== '/dashboard' && (
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              ダッシュボードに戻る
            </Link>
          )}
          <Link
            href="/settings"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
          >
            設定
          </Link>
          <Link
            href="/auth/logout"
            className="rounded-md bg-red-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            ログアウト
          </Link>
        </div>
      );
    }

    // Home page (first visit or not logged in)
    return (
      <div className="flex items-center gap-x-4">
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
    );
  };

  // ダッシュボード配下のページかどうかをチェック
  const isInDashboardSubpage = pathname?.split('/').filter(Boolean).length > 1;

  return (
    <header className="w-full border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="shrink-0">
              <Link 
                href="/dashboard" 
                className="text-xl font-bold text-gray-900 dark:text-white"
              >
                Kobe Connect
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {window.location.pathname !== '/dashboard' && (
              <Link
                href="/dashboard"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                ダッシュボードに戻る
              </Link>
            )}
            <Link
              href="/auth/logout"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              ログアウト
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
