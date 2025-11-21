const HeroSection = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          <span className="block">Kobe Connect で</span>
          <span className="block text-blue-600 dark:text-blue-400">つながりを広げよう</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
          Kobe Connect は、神戸電子の学生のためのコミュニケーションツールです。
          メッセージのやり取りから、プロジェクト管理まで、学生生活をサポートします。
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
