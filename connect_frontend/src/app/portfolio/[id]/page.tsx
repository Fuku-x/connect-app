'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Empty,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  ArrowLeftOutlined,
  GithubOutlined,
  LinkOutlined,
  PictureOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import api from '@/lib/api';
import { PortfolioProject, PortfolioRecord } from '@/types/portfolio';

const { Title, Paragraph, Text } = Typography;

export default function PortfolioDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const portfolioId = params?.id;
  const [portfolio, setPortfolio] = useState<PortfolioRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!portfolioId) return;
    fetchPortfolio(portfolioId);
  }, [portfolioId]);

  const fetchPortfolio = async (id: string) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/public/portfolios/${id}`);
      setPortfolio(data?.data ?? data ?? null);
    } catch (error: any) {
      console.error(error);
      const status = error?.response?.status;
      if (status === 404) {
        message.error('このポートフォリオは公開されていません。');
        router.push('/portfolios');
        return;
      }
      message.error('ポートフォリオの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const renderProjects = (projects?: PortfolioProject[]) => {
    if (!projects || projects.length === 0) {
      return <Empty description="登録されたプロジェクトがありません" />;
    }

    return (
      <Row gutter={[16, 16]}>
        {projects.map((project, index) => (
          <Col key={`${project.name}-${index}`} xs={24} md={12}>
            <Card
              size="small"
              title={project.name}
              extra={
                project.url && (
                  <Link href={project.url} target="_blank" rel="noopener noreferrer">
                    <Button type="link" size="small">
                      リンク
                    </Button>
                  </Link>
                )
              }
            >
              <Paragraph className="text-gray-600" ellipsis={{ rows: 4 }}>
                {project.description || '説明は未設定です。'}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card>
          <Empty description="ポートフォリオが見つかりませんでした" />
          <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => router.push('/portfolios')}>
            一覧に戻る
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      <Breadcrumb
        items={[
          { title: <Link href="/">Home</Link> },
          { title: <Link href="/portfolios">ポートフォリオ一覧</Link> },
          { title: portfolio.title },
        ]}
      />

      <Card className="shadow-md">
        <div className="flex flex-col gap-6 md:flex-row">
          {portfolio.thumbnail_url ? (
            <img
              src={portfolio.thumbnail_url}
              alt={`${portfolio.title} thumbnail`}
              className="h-64 w-full rounded-lg object-cover md:w-2/5"
            />
          ) : (
            <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-100 text-gray-400 md:w-2/5">
              <PictureOutlined className="text-4xl" />
            </div>
          )}

          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Title level={2} className="!mb-2">
                  {portfolio.title}
                </Title>
                {portfolio.user && (
                  <Text type="secondary">
                    {portfolio.user.name}
                    {portfolio.user.department && <> ・ {portfolio.user.department}</>}
                  </Text>
                )}
              </div>
              <Tag color={portfolio.is_public ? 'green' : 'default'}>
                {portfolio.is_public ? '公開中' : '非公開'}
              </Tag>
            </div>

            <Paragraph className="text-gray-600 whitespace-pre-line">
              {portfolio.description || '自己紹介文はまだありません。'}
            </Paragraph>

            <Space size="middle" wrap>
              <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
                戻る
              </Button>
              {portfolio.user?.id && (
                <Button
                  type="primary"
                  icon={<MessageOutlined />}
                  onClick={async () => {
                    try {
                      const response = await api.post('/messages/start', {
                        user_id: portfolio.user?.id,
                      });
                      const data = response.data?.data || response.data;
                      router.push(`/messages/${data.conversation_id}`);
                    } catch (error: any) {
                      console.error('Failed to start conversation:', error);
                      if (error.response?.status === 401) {
                        message.info('ログインが必要です');
                        router.push('/auth/login');
                      } else {
                        message.error('会話の開始に失敗しました');
                      }
                    }
                  }}
                >
                  {portfolio.user?.name}にメッセージを送る
                </Button>
              )}
              {portfolio.github_url && (
                <Button
                  icon={<GithubOutlined />}
                  href={portfolio.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </Button>
              )}
              {portfolio.external_url && (
                <Button
                  icon={<LinkOutlined />}
                  href={portfolio.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  外部サイト
                </Button>
              )}
            </Space>
          </div>
        </div>
      </Card>

      <Card title="スキルセット">
        {portfolio.skills?.length ? (
          <Space size={[8, 12]} wrap>
            {portfolio.skills.map((skill) => (
              <Tag key={skill}>{skill}</Tag>
            ))}
          </Space>
        ) : (
          <Text type="secondary">スキルは登録されていません。</Text>
        )}
      </Card>

      <Card title="プロジェクト">
        {renderProjects(portfolio.projects)}
      </Card>

      <Card title="ギャラリー">
        {portfolio.gallery_image_urls?.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {portfolio.gallery_image_urls.map((url, index) => (
              <img
                key={`${url}-${index}`}
                src={url}
                alt={`gallery-${index}`}
                className="h-48 w-full rounded-lg object-cover"
              />
            ))}
          </div>
        ) : (
          <Text type="secondary">ギャラリー画像はまだありません。</Text>
        )}
      </Card>

      <Card title="リンク">
        {portfolio.links?.length ? (
          <Space direction="vertical" className="w-full">
            {portfolio.links.map((link) => (
              <Button
                key={link.url}
                type="link"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                icon={<LinkOutlined />}
              >
                {link.name}
              </Button>
            ))}
          </Space>
        ) : (
          <Text type="secondary">登録されているリンクはありません。</Text>
        )}
      </Card>
    </div>
  );
}
