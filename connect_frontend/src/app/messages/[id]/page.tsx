'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Spin, message as antMessage } from 'antd';
import { ArrowLeftOutlined, SendOutlined } from '@ant-design/icons';
import api from '@/lib/api';

interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  read_at: string | null;
  created_at: string;
  sender: {
    id: number;
    name: string;
  };
}

interface ConversationData {
  conversation_id: number;
  other_user: {
    id: number;
    name: string;
  };
  messages: Message[];
}

export default function ChatPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<ConversationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (params?.id) {
      fetchMessages();
      fetchCurrentUser();
    }
  }, [params?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [data?.messages]);

  // ポーリングで新しいメッセージをチェック
  useEffect(() => {
    if (!params?.id) return;
    
    const interval = setInterval(() => {
      fetchMessages(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [params?.id]);

  const fetchMessages = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await api.get(`/messages/conversations/${params?.id}`);
      const responseData = response.data?.data || response.data;
      setData(responseData);
    } catch (error: any) {
      console.error('Failed to fetch messages:', error);
      if (error.response?.status === 401) {
        router.push('/auth/login');
      } else if (error.response?.status === 404) {
        antMessage.error('会話が見つかりません');
        router.push('/messages');
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/me');
      setCurrentUserId(response.data?.id || response.data?.user?.id);
    } catch (error) {
      // ログインしていない場合
      router.push('/auth/login');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !data) return;

    setSending(true);
    try {
      await api.post('/messages/send', {
        receiver_id: data.other_user.id,
        content: newMessage.trim(),
      });
      setNewMessage('');
      fetchMessages(false);
    } catch (error) {
      console.error('Failed to send message:', error);
      antMessage.error('メッセージの送信に失敗しました');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // メッセージを日付でグループ化
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = '';

    messages.forEach((message) => {
      const messageDate = formatDate(message.created_at);
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({ date: messageDate, messages: [message] });
      } else {
        groups[groups.length - 1].messages.push(message);
      }
    });

    return groups;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const messageGroups = groupMessagesByDate(data.messages);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex flex-col">
      {/* ヘッダー */}
      <div className="bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/messages">
            <Button
              icon={<ArrowLeftOutlined />}
              type="text"
              className="!text-gray-600 dark:!text-gray-300"
            />
          </Link>
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {data.other_user.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">
            {data.other_user.name}
          </span>
        </div>
      </div>

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {data.messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              メッセージを送信して会話を始めましょう
            </div>
          ) : (
            messageGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* 日付セパレーター */}
                <div className="flex items-center justify-center my-4">
                  <span className="text-xs text-gray-400 bg-gray-100 dark:bg-zinc-700 px-3 py-1 rounded-full">
                    {group.date}
                  </span>
                </div>

                {/* メッセージ */}
                {group.messages.map((msg) => {
                  const isMe = msg.sender_id === currentUserId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                          isMe
                            ? 'bg-blue-500 text-white rounded-br-md'
                            : 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white rounded-bl-md shadow-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isMe ? 'text-blue-100' : 'text-gray-400'
                          }`}
                        >
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 入力エリア */}
      <div className="bg-white dark:bg-zinc-800 border-t border-gray-200 dark:border-zinc-700 px-4 py-3">
        <div className="max-w-2xl mx-auto flex gap-2">
          <Input.TextArea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="メッセージを入力..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="flex-1"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={sending}
            disabled={!newMessage.trim()}
          >
            送信
          </Button>
        </div>
      </div>
    </div>
  );
}
