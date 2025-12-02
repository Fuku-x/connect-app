'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Spin, message } from 'antd';
import PortfolioForm from '@/components/Portfolio/PortfolioForm';
import { PortfolioFormValues, PortfolioRecord } from '@/types/portfolio';
import api from '@/lib/api';

export default function EditPortfolioPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<PortfolioRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (params?.id) {
      fetchPortfolio(params.id);
    }
  }, [params?.id]);

  const fetchPortfolio = async (id: string) => {
    try {
      const response = await api.get(`/portfolio`);
      // 自分のポートフォリオ一覧から該当IDを探す
      const portfolios = response.data?.data || response.data || [];
      const found = Array.isArray(portfolios) 
        ? portfolios.find((p: PortfolioRecord) => p.id === parseInt(id))
        : portfolios;
      
      if (found) {
        setPortfolio(found);
      } else {
        message.error('ポートフォリオが見つかりません');
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Failed to fetch portfolio:', error);
      if (error.response?.status === 401) {
        router.push('/auth/login');
      } else {
        message.error('ポートフォリオの取得に失敗しました');
        router.push('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: PortfolioFormValues) => {
    if (!portfolio?.id) return;
    
    setSubmitting(true);
    try {
      await api.put(`/portfolio/${portfolio.id}`, values);
      message.success('ポートフォリオを更新しました');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Failed to update portfolio:', error);
      message.error(error.response?.data?.message || 'ポートフォリオの更新に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!portfolio) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          ポートフォリオ編集
        </h1>
        <PortfolioForm 
          initialValues={portfolio} 
          onSubmit={handleSubmit} 
          loading={submitting} 
        />
      </div>
    </div>
  );
}
