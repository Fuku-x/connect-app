'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PortfolioForm from '@/components/Portfolio/PortfolioForm';
import { PortfolioFormValues } from '@/types/portfolio';
import api from '@/lib/api';
import { message } from 'antd';

export default function NewPortfolioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: PortfolioFormValues) => {
    setLoading(true);
    try {
      await api.post('/portfolio', values);
      message.success('ポートフォリオを作成しました');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Failed to create portfolio:', error);
      message.error(error.response?.data?.message || 'ポートフォリオの作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          新規ポートフォリオ作成
        </h1>
        <PortfolioForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
