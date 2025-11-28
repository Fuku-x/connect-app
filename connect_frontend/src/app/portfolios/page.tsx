'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Card,
  Empty,
  Input,
  Pagination,
  Select,
  Space,
  Tag,
  Typography,
  message,
} from 'antd';
import { GlobalOutlined, SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import api from '@/lib/api';
import { PortfolioRecord } from '@/types/portfolio';

const { Title, Paragraph, Text } = Typography;

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface PaginatedResponse<T> {
  data: T[];
  meta?: PaginationMeta;
}

const PAGE_SIZE = 12;

export default function PublicPortfoliosPage() {
  const [portfolios, setPortfolios] = useState<PortfolioRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  useEffect(() => {
    fetchPortfolios();
  }, [currentPage, selectedSkills, search]);

  const fetchPortfolios = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<PaginatedResponse<PortfolioRecord>>('/public/portfolios', {
        params: {
          page: currentPage,
          per_page: PAGE_SIZE,
          search: search || undefined,
          skills: selectedSkills.length ? selectedSkills.join(',') : undefined,
        },
      });
      const normalizedData = data?.data ?? [];
      const normalizedMeta: PaginationMeta = data?.meta ?? {
        current_page: currentPage,
        last_page: currentPage,
        per_page: PAGE_SIZE,
        total: normalizedData.length,
      };
      setPortfolios(normalizedData);
      setMeta(normalizedMeta);
    } catch (error) {
      console.error(error);
      message.error('ポートフォリオ一覧の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const skillOptions = useMemo(() => {
    const uniqueSkills = new Set<string>();
    portfolios.forEach((portfolio) => {
      portfolio.skills?.forEach((skill) => uniqueSkills.add(skill));
    });
    return Array.from(uniqueSkills).map((skill) => ({ label: skill, value: skill }));
  }, [portfolios]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handleSkillChange = (value: string[]) => {
    setSelectedSkills(value);
    setCurrentPage(1);
  };

  const showPagination = (meta?.total ?? 0) > PAGE_SIZE;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* ダッシュボードに戻るボタン */}
      <div className="mb-6">
        <Link href="/dashboard">
          <Button icon={<ArrowLeftOutlined />} type="text">
            ダッシュボードに戻る
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
        <div>
          <Title level={2} className="!mb-2">
            公開ポートフォリオ
          </Title>
          <Paragraph className="!mb-0 text-gray-500">
            Connectメンバーの実績やスキルを閲覧できます。気になるメンバーを探してみましょう。
          </Paragraph>
        </div>
        <Space direction="vertical" size="middle" className="w-full md:w-auto">
          <Input
            allowClear
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="キーワードで検索"
            value={search}
            onChange={handleSearchChange}
          />
          <Select
            mode="multiple"
            allowClear
            placeholder="スキルで絞り込み"
            className="w-full"
            options={skillOptions}
            value={selectedSkills}
            onChange={handleSkillChange}
          />
        </Space>
      </div>

      {portfolios.length === 0 && !loading ? (
        <Card>
          <Empty description="条件に一致するポートフォリオがありません" />
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {portfolios.map((portfolio) => (
            <Card
              key={portfolio.id}
              hoverable
              loading={loading}
              cover={
                portfolio.thumbnail_url ? (
                  <img
                    src={portfolio.thumbnail_url as string}
                    alt={`${portfolio.title} thumbnail`}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="h-48 w-full bg-gray-50 flex items-center justify-center text-gray-400">
                    <GlobalOutlined className="text-3xl" />
                  </div>
                )
              }
              actions={[<Link href={`/portfolio/${portfolio.id}`} key="detail">詳細を見る</Link>]}
            >
              <Space direction="vertical" className="w-full">
                <div className="flex items-center justify-between">
                  <Title level={4} className="!mb-0">
                    {portfolio.title}
                  </Title>
                  <Tag color={portfolio.is_public ? 'green' : 'default'}>{portfolio.is_public ? '公開中' : '非公開'}</Tag>
                </div>
                <Paragraph ellipsis={{ rows: 2 }} className="text-gray-600">
                  {portfolio.description || '自己紹介文は未設定です。'}
                </Paragraph>
                {portfolio.skills?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {portfolio.skills.slice(0, 6).map((skill) => (
                      <Tag key={skill}>{skill}</Tag>
                    ))}
                    {portfolio.skills.length > 6 && <Text type="secondary">+{portfolio.skills.length - 6}</Text>}
                  </div>
                ) : (
                  <Text type="secondary">登録されたスキルはありません</Text>
                )}
                {portfolio.user && (
                  <div className="text-sm text-gray-500">
                    <Text strong>{portfolio.user.name}</Text>
                    {portfolio.user.department && <span> ・ {portfolio.user.department}</span>}
                  </div>
                )}
              </Space>
            </Card>
          ))}
        </div>
      )}

      {showPagination && meta && (
        <div className="mt-8 flex justify-center">
          <Pagination
            current={meta.current_page}
            pageSize={meta.per_page}
            total={meta.total}
            showSizeChanger={false}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
}
