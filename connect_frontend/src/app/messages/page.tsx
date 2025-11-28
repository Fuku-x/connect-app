'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, Spin, Empty, Badge, Input } from 'antd';
import {
  ArrowLeftOutlined,
  MessageOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import api from '@/lib/api';

interface Conversation {
  id: number;
  other_user: {
    id: number;
    name: string;
  };
  latest_message: {
    content: string;
    sender_id: number;
    created_at: string;
  } | null;
  unread_count: number;
  updated_at: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/messages/conversations');
      const data = response.data?.data || response.data || [];
      setConversations(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Failed to fetch conversations:', error);
      if (error.response?.status === 401) {
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return '昨日';
    } else if (days < 7) {
      return `${days}日前`;
    } else {
      return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.other_user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* ヘッダー */}
        <div className="mb-6">
          <Link href="/dashboard">
            <Button
              icon={<ArrowLeftOutlined />}
              className="!text-blue-500 hover:!text-blue-600 hover:!bg-blue-50 dark:hover:!bg-blue-900/20"
            >
              ダッシュボードに戻る
            </Button>
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageOutlined />
            メッセージ
          </h1>
        </div>

        {/* 検索 */}
        <div className="mb-4">
          <Input
            placeholder="ユーザー名で検索"
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </div>

        {/* 会話一覧 */}
        {filteredConversations.length === 0 ? (
          <Card>
            <Empty
              description={
                searchText
                  ? "該当する会話がありません"
                  : "まだメッセージがありません"
              }
            />
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredConversations.map((conversation) => (
              <Card
                key={conversation.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/messages/${conversation.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                      {conversation.other_user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {conversation.other_user.name}
                        </span>
                        {conversation.unread_count > 0 && (
                          <Badge count={conversation.unread_count} />
                        )}
                      </div>
                      {conversation.latest_message && (
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {conversation.latest_message.content}
                        </p>
                      )}
                    </div>
                  </div>
                  {conversation.latest_message && (
                    <span className="text-xs text-gray-400 ml-2">
                      {formatTime(conversation.latest_message.created_at)}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
