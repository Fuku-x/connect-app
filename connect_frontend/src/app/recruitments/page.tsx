'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, List, Tag, Input, Modal, Form, message, Space, Divider } from 'antd';
import { PlusOutlined, SearchOutlined, ClockCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import api from '@/lib/api';

const { TextArea } = Input;

interface Recruitment {
  id: number;
  title: string;
  description: string;
  required_skills: string[];
  project_duration: string;
  status: 'open' | 'closed';
  user: {
    id: number;
    name: string;
  };
  created_at: string;
}

export default function RecruitmentsPage() {
  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();

  useEffect(() => {
    fetchRecruitments();
  }, []);

  const fetchRecruitments = async () => {
    try {
      const response = await api.get('/recruitments');
      // APIレスポンス形式に対応
      const data = response.data?.data || response.data || [];
      setRecruitments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch recruitments:', error);
      message.error('募集の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleCreatePost = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      await api.post('/recruitments', {
        ...values,
        required_skills: values.required_skills ? values.required_skills.split(',').map((s: string) => s.trim()) : []
      });
      message.success('募集を作成しました');
      setIsModalVisible(false);
      fetchRecruitments();
    } catch (error) {
      console.error('Failed to create recruitment post:', error);
      message.error('募集の作成に失敗しました');
    }
  };

  const filteredRecruitments = recruitments.filter(recruitment => 
    recruitment.title.toLowerCase().includes(searchText.toLowerCase()) ||
    recruitment.description.toLowerCase().includes(searchText.toLowerCase()) ||
    recruitment.required_skills.some(skill => 
      skill.toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return (
    <div className="container mx-auto p-4">
      {/* ダッシュボードに戻る */}
      <div className="mb-4">
        <Link href="/dashboard">
          <Button 
            icon={<ArrowLeftOutlined />} 
            className="!text-blue-500 hover:!text-blue-600 hover:!bg-blue-50 dark:hover:!bg-blue-900/20"
          >
            ダッシュボードに戻る
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">メンバー募集</h1>
        <div className="w-full md:w-1/3">
          <Input
            placeholder="タイトル、説明、スキルで検索"
            prefix={<SearchOutlined className="text-gray-400" />}
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          className="mt-4 md:mt-0"
          onClick={handleCreatePost}
        >
          募集を作成
        </Button>
      </div>

      <List
        itemLayout="vertical"
        size="large"
        loading={loading}
        dataSource={filteredRecruitments}
        renderItem={(recruitment) => (
          <List.Item
            key={recruitment.id}
            className="hover:bg-gray-50 cursor-pointer transition-colors p-4 rounded-lg"
            onClick={() => router.push(`/recruitments/${recruitment.id}`)}
          >
            <div className="w-full">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold mb-2">{recruitment.title}</h2>
                <Tag color={recruitment.status === 'open' ? 'green' : 'red'} className="ml-2">
                  {recruitment.status.toUpperCase()}
                </Tag>
              </div>
              
              <div className="mb-3 text-gray-600">
                {recruitment.description.length > 200 
                  ? `${recruitment.description.substring(0, 200)}...` 
                  : recruitment.description}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {recruitment.required_skills.map((skill, index) => (
                  <Tag key={index} color="blue">
                    {skill}
                  </Tag>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <ClockCircleOutlined className="mr-1" />
                  <span>{recruitment.project_duration}</span>
                </div>
                <div className="ml-auto">
                  <span className="text-gray-400">
                    Posted by {recruitment.user?.name || 'Anonymous'}
                  </span>
                </div>
              </div>
            </div>
          </List.Item>
        )}
      />

      <Modal
        title="メンバー募集を作成"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: 'open' }}
        >
          <Form.Item
            name="title"
            label="タイトル"
            rules={[{ required: true, message: 'タイトルを入力してください' }]}
          >
            <Input placeholder="例: Reactエンジニア募集" />
          </Form.Item>

          <Form.Item
            name="description"
            label="説明"
            rules={[{ required: true, message: '説明を入力してください' }]}
          >
            <TextArea rows={6} placeholder="ポジション、要件、プロジェクトの詳細を記載..." />
          </Form.Item>

          <Form.Item
            name="required_skills"
            label="必要スキル（カンマ区切り）"
            rules={[{ required: true, message: 'スキルを入力してください' }]}
          >
            <Input placeholder="React, Node.js, TypeScript" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="project_duration"
              label="プロジェクト期間"
              rules={[{ required: true, message: '期間を入力してください' }]}
            >
              <Input placeholder="3ヶ月" />
            </Form.Item>

          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button onClick={() => setIsModalVisible(false)}>
              キャンセル
            </Button>
            <Button type="primary" htmlType="submit">
              投稿
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
