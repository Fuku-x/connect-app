'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Button,
  Card,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Spin,
  Empty,
} from 'antd';
import {
  PlusOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import api from '@/lib/api';
import dayjs from 'dayjs';

const { TextArea } = Input;

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  created_at: string;
}

interface TaskFormValues {
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: dayjs.Dayjs;
}

const statusConfig = {
  todo: { label: '未着手', color: 'default', icon: <ClockCircleOutlined /> },
  in_progress: { label: '進行中', color: 'processing', icon: <ExclamationCircleOutlined /> },
  done: { label: '完了', color: 'success', icon: <CheckCircleOutlined /> },
};

const priorityConfig = {
  low: { label: '低', color: 'green' },
  medium: { label: '中', color: 'orange' },
  high: { label: '高', color: 'red' },
};

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm<TaskFormValues>();
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      const data = response.data?.data || response.data || [];
      setTasks(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Failed to fetch tasks:', error);
      if (error.response?.status === 401) {
        router.push('/auth/login');
      } else {
        message.error('タスクの取得に失敗しました');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      form.setFieldsValue({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        due_date: task.due_date ? dayjs(task.due_date) : undefined,
      });
    } else {
      setEditingTask(null);
      form.resetFields();
      form.setFieldsValue({
        status: 'todo',
        priority: 'medium',
      });
    }
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: TaskFormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        due_date: values.due_date?.format('YYYY-MM-DD') || null,
      };

      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, payload);
        message.success('タスクを更新しました');
      } else {
        await api.post('/tasks', payload);
        message.success('タスクを作成しました');
      }
      setIsModalVisible(false);
      fetchTasks();
    } catch (error) {
      console.error('Failed to save task:', error);
      message.error('タスクの保存に失敗しました');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (task: Task, newStatus: string) => {
    try {
      await api.patch(`/tasks/${task.id}/status`, { status: newStatus });
      message.success('ステータスを更新しました');
      fetchTasks();
    } catch (error) {
      console.error('Failed to update status:', error);
      message.error('ステータスの更新に失敗しました');
    }
  };

  const handleDelete = (task: Task) => {
    Modal.confirm({
      title: 'タスクを削除しますか？',
      content: 'この操作は取り消せません。',
      okText: '削除',
      okType: 'danger',
      cancelText: 'キャンセル',
      onOk: async () => {
        try {
          await api.delete(`/tasks/${task.id}`);
          message.success('タスクを削除しました');
          fetchTasks();
        } catch (error) {
          console.error('Failed to delete task:', error);
          message.error('削除に失敗しました');
        }
      },
    });
  };

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  const groupedTasks = {
    todo: filteredTasks.filter(t => t.status === 'todo'),
    in_progress: filteredTasks.filter(t => t.status === 'in_progress'),
    done: filteredTasks.filter(t => t.status === 'done'),
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
      <div className="max-w-7xl mx-auto px-4">
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">タスク管理</h1>
          <div className="flex gap-3">
            <Select
              value={filter}
              onChange={setFilter}
              className="w-32"
              options={[
                { value: 'all', label: 'すべて' },
                { value: 'todo', label: '未着手' },
                { value: 'in_progress', label: '進行中' },
                { value: 'done', label: '完了' },
              ]}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
              タスクを追加
            </Button>
          </div>
        </div>

        {/* カンバンボード風レイアウト */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['todo', 'in_progress', 'done'] as const).map((status) => (
            <div key={status} className="bg-gray-100 dark:bg-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                {statusConfig[status].icon}
                <h2 className="font-semibold text-gray-700 dark:text-gray-200">
                  {statusConfig[status].label}
                </h2>
                <span className="text-sm text-gray-500">({groupedTasks[status].length})</span>
              </div>

              <div className="space-y-3">
                {groupedTasks[status].length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    タスクがありません
                  </div>
                ) : (
                  groupedTasks[status].map((task) => (
                    <Card
                      key={task.id}
                      size="small"
                      className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleOpenModal(task)}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-bold text-lg text-black dark:text-white line-clamp-2">
                            {task.title}
                          </h3>
                          <Tag color={priorityConfig[task.priority].color}>
                            {priorityConfig[task.priority].label}
                          </Tag>
                        </div>
                        
                        {task.description && (
                          <p className="text-xs text-gray-400 line-clamp-1">
                            {task.description}
                          </p>
                        )}

                        {task.due_date && (
                          <div className="text-xs text-blue-500 font-medium">
                            期限: {dayjs(task.due_date).format('YYYY/MM/DD')}
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-2 border-t">
                          <Select
                            size="small"
                            value={task.status}
                            onChange={(value) => {
                              // イベントの伝播を防ぐ
                              handleStatusChange(task, value);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            options={[
                              { value: 'todo', label: '未着手' },
                              { value: 'in_progress', label: '進行中' },
                              { value: 'done', label: '完了' },
                            ]}
                            className="w-24"
                          />
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(task);
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 作成・編集モーダル */}
        <Modal
          title={editingTask ? 'タスクを編集' : 'タスクを作成'}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={500}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="title"
              label="タイトル"
              rules={[{ required: true, message: 'タイトルを入力してください' }]}
            >
              <Input placeholder="タスクのタイトル" />
            </Form.Item>

            <Form.Item name="description" label="説明">
              <TextArea rows={3} placeholder="タスクの説明（任意）" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="status" label="ステータス">
                <Select
                  options={[
                    { value: 'todo', label: '未着手' },
                    { value: 'in_progress', label: '進行中' },
                    { value: 'done', label: '完了' },
                  ]}
                />
              </Form.Item>

              <Form.Item name="priority" label="優先度">
                <Select
                  options={[
                    { value: 'low', label: '低' },
                    { value: 'medium', label: '中' },
                    { value: 'high', label: '高' },
                  ]}
                />
              </Form.Item>
            </div>

            <Form.Item name="due_date" label="期限">
              <DatePicker className="w-full" placeholder="期限を選択" />
            </Form.Item>

            <div className="flex justify-end space-x-3 mt-6">
              <Button onClick={() => setIsModalVisible(false)}>キャンセル</Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {editingTask ? '更新' : '作成'}
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
