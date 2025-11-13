import Link from 'next/link';

const HeroSection = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          <span className="block">Connect App で</span>
          <span className="block text-blue-600 dark:text-blue-400">つながりを広げよう</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
          Connect App は、シンプルで使いやすいコミュニケーションツールです。
          メッセージのやり取りから、プロジェクト管理まで、チームの生産性を高めます。
        </p>
        <div className="mx-auto mt-10 flex max-w-md justify-center gap-x-6">
          <Link
            href="/auth/register"
            className="flex items-center justify-center rounded-md bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 md:py-4 md:px-10 md:text-lg"
          >
            無料で始める
          </Link>
          <Link
            href="#features"
            className="flex items-center justify-center rounded-md bg-white px-8 py-3 text-base font-medium text-blue-700 hover:bg-gray-100 dark:bg-zinc-800 dark:text-blue-400 dark:hover:bg-zinc-700 md:py-4 md:px-10 md:text-lg"
          >
            詳細を見る
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
