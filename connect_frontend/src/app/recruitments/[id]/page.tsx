'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, Tag, Spin, message, Modal, Form, Input, Select } from 'antd';
import {
  ArrowLeftOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import api from '@/lib/api';

const { TextArea } = Input;

interface Recruitment {
  id: number;
  user_id: number;
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
  updated_at: string;
}

interface EditFormValues {
  title: string;
  description: string;
  required_skills: string;
  project_duration: string;
  status: 'open' | 'closed';
}

export default function RecruitmentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [recruitment, setRecruitment] = useState<Recruitment | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [form] = Form.useForm<EditFormValues>();

  useEffect(() => {
    if (params?.id) {
      fetchRecruitment(params.id);
      fetchCurrentUser();
    }
  }, [params?.id]);

  const fetchRecruitment = async (id: string) => {
    try {
      const response = await api.get(`/recruitments/${id}`);
      const data = response.data?.data || response.data;
      setRecruitment(data);
    } catch (error) {
      console.error('Failed to fetch recruitment:', error);
      message.error('募集の取得に失敗しました');
      router.push('/recruitments');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/me');
      setCurrentUserId(response.data?.id || response.data?.user?.id);
    } catch (error) {
      // ログインしていない場合は無視
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: '募集を削除しますか？',
      content: 'この操作は取り消せません。',
      okText: '削除',
      okType: 'danger',
      cancelText: 'キャンセル',
      onOk: async () => {
        try {
          await api.delete(`/recruitments/${params?.id}`);
          message.success('募集を削除しました');
          router.push('/recruitments');
        } catch (error) {
          console.error('Failed to delete recruitment:', error);
          message.error('削除に失敗しました');
        }
      },
    });
  };

  const handleOpenEditModal = () => {
    if (recruitment) {
      form.setFieldsValue({
        title: recruitment.title,
        description: recruitment.description,
        required_skills: recruitment.required_skills?.join(', ') || '',
        project_duration: recruitment.project_duration,
        status: recruitment.status,
      });
      setIsEditModalVisible(true);
    }
  };

  const handleEditSubmit = async (values: EditFormValues) => {
    if (!params?.id) return;
    
    setEditLoading(true);
    try {
      const updateData = {
        ...values,
        required_skills: values.required_skills
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0),
      };
      
      await api.put(`/recruitments/${params.id}`, updateData);
      message.success('募集を更新しました');
      setIsEditModalVisible(false);
      fetchRecruitment(params.id);
    } catch (error) {
      console.error('Failed to update recruitment:', error);
      message.error('更新に失敗しました');
    } finally {
      setEditLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!recruitment) {
    return null;
  }

  const isOwner = currentUserId === recruitment.user_id;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 戻るボタン */}
        <div className="mb-6">
          <Link href="/recruitments">
            <Button icon={<ArrowLeftOutlined />} type="text">
              募集一覧に戻る
            </Button>
          </Link>
        </div>

        <Card className="shadow-lg">
          {/* ヘッダー */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {recruitment.title}
                </h1>
                <Tag color={recruitment.status === 'open' ? 'green' : 'red'}>
                  {recruitment.status === 'open' ? '募集中' : '終了'}
                </Tag>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <UserOutlined />
                  {recruitment.user?.name || '匿名'}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarOutlined />
                  {formatDate(recruitment.created_at)}
                </span>
              </div>
            </div>

            {/* オーナーのみ編集・削除ボタン表示 */}
            {isOwner && (
              <div className="flex gap-2">
                <Button
                  icon={<EditOutlined />}
                  onClick={handleOpenEditModal}
                >
                  編集
                </Button>
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  onClick={handleDelete}
                >
                  削除
                </Button>
              </div>
            )}
          </div>

          {/* プロジェクト期間 */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <ClockCircleOutlined />
              <span className="font-medium">プロジェクト期間:</span>
              <span>{recruitment.project_duration}</span>
            </div>
          </div>

          {/* 必要スキル */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              必要スキル
            </h2>
            <div className="flex flex-wrap gap-2">
              {recruitment.required_skills?.map((skill, index) => (
                <Tag key={index} color="blue" className="text-sm py-1 px-3">
                  {skill}
                </Tag>
              ))}
            </div>
          </div>

          {/* 説明 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              募集詳細
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {recruitment.description}
              </p>
            </div>
          </div>

          {/* メッセージ・応募ボタン（オーナー以外） */}
          {!isOwner && (
            <div className="pt-6 border-t space-y-3">
              <Button 
                type="default" 
                size="large" 
                className="w-full"
                icon={<MessageOutlined />}
                onClick={async () => {
                  try {
                    const response = await api.post('/messages/start', {
                      user_id: recruitment.user_id,
                    });
                    const data = response.data?.data || response.data;
                    router.push(`/messages/${data.conversation_id}`);
                  } catch (error) {
                    console.error('Failed to start conversation:', error);
                    message.error('会話の開始に失敗しました');
                  }
                }}
              >
                {recruitment.user?.name || '投稿者'}にメッセージを送る
              </Button>
              {recruitment.status === 'open' && (
                <Button type="primary" size="large" className="w-full">
                  この募集に応募する
                </Button>
              )}
            </div>
          )}
        </Card>

        {/* 編集モーダル */}
        <Modal
          title="募集を編集"
          open={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          footer={null}
          width={700}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleEditSubmit}
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

            <Form.Item
              name="project_duration"
              label="プロジェクト期間"
              rules={[{ required: true, message: '期間を入力してください' }]}
            >
              <Input placeholder="3ヶ月" />
            </Form.Item>

            <Form.Item
              name="status"
              label="ステータス"
              rules={[{ required: true, message: 'ステータスを選択してください' }]}
            >
              <Select
                options={[
                  { value: 'open', label: '募集中' },
                  { value: 'closed', label: '終了' },
                ]}
              />
            </Form.Item>

            <div className="flex justify-end space-x-3 mt-6">
              <Button onClick={() => setIsEditModalVisible(false)}>
                キャンセル
              </Button>
              <Button type="primary" htmlType="submit" loading={editLoading}>
                更新
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
