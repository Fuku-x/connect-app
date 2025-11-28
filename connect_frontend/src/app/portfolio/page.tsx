'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, Spin, Tag, Empty, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, GithubOutlined, LinkOutlined } from '@ant-design/icons';
import api from '@/lib/api';
import { PortfolioRecord } from '@/types/portfolio';

export default function MyPortfoliosPage() {
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<PortfolioRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const response = await api.get('/portfolio');
      const data = response.data?.data || response.data || [];
      setPortfolios(Array.isArray(data) ? data : [data]);
    } catch (error: any) {
      console.error('Failed to fetch portfolios:', error);
      if (error.response?.status === 401) {
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'ポートフォリオを削除しますか？',
      content: 'この操作は取り消せません。',
      okText: '削除',
      okType: 'danger',
      cancelText: 'キャンセル',
      onOk: async () => {
        try {
          await api.delete(`/portfolio/${id}`);
          message.success('ポートフォリオを削除しました');
          fetchPortfolios();
        } catch (error) {
          console.error('Failed to delete portfolio:', error);
          message.error('削除に失敗しました');
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">マイポートフォリオ</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push('/portfolio/new')}
          >
            新規作成
          </Button>
        </div>

        {portfolios.length === 0 ? (
          <Card>
            <Empty
              description="ポートフォリオがまだありません"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={() => router.push('/portfolio/new')}>
                最初のポートフォリオを作成
              </Button>
            </Empty>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {portfolios.map((portfolio) => (
              <Card
                key={portfolio.id}
                hoverable
                cover={
                  portfolio.thumbnail_url ? (
                    <img
                      src={portfolio.thumbnail_url}
                      alt={portfolio.title}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="h-48 w-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">
                        {portfolio.title?.charAt(0) || 'P'}
                      </span>
                    </div>
                  )
                }
                actions={[
                  <Button
                    key="view"
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => router.push(`/portfolio/${portfolio.id}`)}
                  >
                    表示
                  </Button>,
                  <Button
                    key="edit"
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => router.push(`/portfolio/edit/${portfolio.id}`)}
                  >
                    編集
                  </Button>,
                  <Button
                    key="delete"
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => portfolio.id && handleDelete(portfolio.id)}
                  >
                    削除
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={
                    <div className="flex items-center justify-between">
                      <span className="truncate">{portfolio.title}</span>
                      <Tag color={portfolio.is_public ? 'green' : 'default'}>
                        {portfolio.is_public ? '公開' : '非公開'}
                      </Tag>
                    </div>
                  }
                  description={
                    <div className="space-y-2">
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                        {portfolio.description || '説明なし'}
                      </p>
                      {portfolio.skills && portfolio.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {portfolio.skills.slice(0, 4).map((skill) => (
                            <Tag key={skill} className="text-xs">{skill}</Tag>
                          ))}
                          {portfolio.skills.length > 4 && (
                            <Tag className="text-xs">+{portfolio.skills.length - 4}</Tag>
                          )}
                        </div>
                      )}
                      <div className="flex gap-2 pt-2">
                        {portfolio.github_url && (
                          <a href={portfolio.github_url} target="_blank" rel="noopener noreferrer">
                            <GithubOutlined className="text-gray-500 hover:text-gray-700" />
                          </a>
                        )}
                        {portfolio.external_url && (
                          <a href={portfolio.external_url} target="_blank" rel="noopener noreferrer">
                            <LinkOutlined className="text-gray-500 hover:text-gray-700" />
                          </a>
                        )}
                      </div>
                    </div>
                  }
                />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
