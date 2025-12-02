'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  Form,
  Input,
  Switch,
  Upload,
  message,
  Space,
} from 'antd';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import {
  PlusOutlined,
  DeleteOutlined,
  GithubOutlined,
  LinkOutlined,
  InboxOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { PortfolioFormValues, PortfolioRecord, PortfolioMediaUpload } from '@/types/portfolio';
import api from '@/lib/api';

const { TextArea } = Input;
const { Dragger } = Upload;

interface PortfolioFormProps {
  initialValues?: PortfolioRecord;
  onSubmit: (values: PortfolioFormValues) => Promise<void>;
  loading?: boolean;
}

export default function PortfolioForm({ initialValues, onSubmit, loading }: PortfolioFormProps) {
  const router = useRouter();
  const [form] = Form.useForm<PortfolioFormValues>();
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(initialValues?.thumbnail_url || null);
  const [thumbnailPath, setThumbnailPath] = useState<string | null>(initialValues?.thumbnail_path || null);
  const [galleryFiles, setGalleryFiles] = useState<UploadFile[]>(() => {
    if (initialValues?.gallery_images && initialValues?.gallery_image_urls) {
      return initialValues.gallery_images.map((path, index) => ({
        uid: `-${index}`,
        name: path.split('/').pop() || `image-${index}`,
        status: 'done' as const,
        url: initialValues.gallery_image_urls?.[index],
      }));
    }
    return [];
  });
  const [galleryPaths, setGalleryPaths] = useState<string[]>(initialValues?.gallery_images || []);
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(initialValues?.skills || []);

  const handleThumbnailUpload: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append('thumbnail', file as File);

    try {
      const response = await api.post<{ data: PortfolioMediaUpload }>('/portfolio/upload-thumbnail', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const result = response.data.data;
      setThumbnailUrl(result.url);
      setThumbnailPath(result.path);
      onSuccess?.(result);
      message.success('サムネイルをアップロードしました');
    } catch (error) {
      onError?.(error as Error);
      message.error('サムネイルのアップロードに失敗しました');
    }
  };

  const handleGalleryUpload: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append('images[]', file as File);

    try {
      const response = await api.post<{ data: PortfolioMediaUpload[] }>('/portfolio/upload-gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const result = response.data.data[0];
      setGalleryPaths((prev) => [...prev, result.path]);
      onSuccess?.(result);
      message.success('画像をアップロードしました');
    } catch (error) {
      onError?.(error as Error);
      message.error('画像のアップロードに失敗しました');
    }
  };

  const handleGalleryChange: UploadProps['onChange'] = ({ fileList }) => {
    setGalleryFiles(fileList);
    // 削除された場合はpathsも更新
    const remainingPaths = fileList
      .filter((f) => f.status === 'done')
      .map((f) => f.response?.path || galleryPaths[parseInt(f.uid.replace('-', ''))])
      .filter(Boolean);
    setGalleryPaths(remainingPaths);
  };

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleFinish = async (values: PortfolioFormValues) => {
    const submitData: PortfolioFormValues = {
      ...values,
      skills,
      thumbnail_path: thumbnailPath,
      gallery_images: galleryPaths,
    };
    await onSubmit(submitData);
  };

  return (
    <Card className="shadow-lg">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          title: initialValues?.title || '',
          description: initialValues?.description || '',
          is_public: initialValues?.is_public ?? true,
          projects: initialValues?.projects || [],
          links: initialValues?.links || [],
          github_url: initialValues?.github_url || '',
          external_url: initialValues?.external_url || '',
        }}
      >
        {/* 基本情報 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">基本情報</h2>
          
          <Form.Item
            name="title"
            label="タイトル"
            rules={[{ required: true, message: 'タイトルを入力してください' }]}
          >
            <Input placeholder="例: フロントエンドエンジニアポートフォリオ" maxLength={255} />
          </Form.Item>

          <Form.Item name="description" label="説明">
            <TextArea
              rows={4}
              placeholder="自己紹介やスキルの概要を記入してください"
              maxLength={2000}
              showCount
            />
          </Form.Item>

          <Form.Item name="is_public" label="公開設定" valuePropName="checked">
            <Switch checkedChildren="公開" unCheckedChildren="非公開" />
          </Form.Item>
        </div>

        {/* サムネイル */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">サムネイル画像</h2>
          <div className="flex items-start gap-4">
            {thumbnailUrl && (
              <div className="relative">
                <img
                  src={thumbnailUrl}
                  alt="Thumbnail"
                  className="w-40 h-40 object-cover rounded-lg"
                />
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  className="absolute top-1 right-1"
                  onClick={() => {
                    setThumbnailUrl(null);
                    setThumbnailPath(null);
                  }}
                />
              </div>
            )}
            <Upload
              accept="image/*"
              showUploadList={false}
              customRequest={handleThumbnailUpload}
            >
              <Button icon={<PlusOutlined />}>
                {thumbnailUrl ? '変更' : 'アップロード'}
              </Button>
            </Upload>
          </div>
          <p className="text-sm text-gray-500 mt-2">推奨サイズ: 800x600px、最大2MB</p>
        </div>

        {/* ギャラリー */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">ギャラリー画像</h2>
          <Dragger
            accept="image/*"
            multiple
            fileList={galleryFiles}
            customRequest={handleGalleryUpload}
            onChange={handleGalleryChange}
            listType="picture-card"
            maxCount={6}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">クリックまたはドラッグ＆ドロップで画像をアップロード</p>
            <p className="ant-upload-hint">最大6枚まで、各4MBまで</p>
          </Dragger>
        </div>

        {/* スキルタグ */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">技術スキル</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-300"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <Space.Compact className="w-full max-w-md">
            <Input
              placeholder="スキルを入力 (例: React, TypeScript)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={50}
            />
            <Button type="primary" onClick={handleAddSkill}>
              追加
            </Button>
          </Space.Compact>
        </div>

        {/* 外部リンク */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">外部リンク</h2>
          
          <Form.Item
            name="github_url"
            label={<span><GithubOutlined className="mr-2" />GitHub URL</span>}
            rules={[{ type: 'url', message: '有効なURLを入力してください' }]}
          >
            <Input placeholder="https://github.com/username" />
          </Form.Item>

          <Form.Item
            name="external_url"
            label={<span><LinkOutlined className="mr-2" />外部サイトURL</span>}
            rules={[{ type: 'url', message: '有効なURLを入力してください' }]}
          >
            <Input placeholder="https://example.com" />
          </Form.Item>
        </div>

        {/* プロジェクト */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">プロジェクト</h2>
          <Form.List name="projects">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Card key={field.key} className="mb-4" size="small">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">プロジェクト {index + 1}</span>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(field.name)}
                      />
                    </div>
                    <Form.Item
                      {...field}
                      name={[field.name, 'name']}
                      label="プロジェクト名"
                      rules={[{ required: true, message: 'プロジェクト名を入力してください' }]}
                    >
                      <Input placeholder="プロジェクト名" />
                    </Form.Item>
                    <Form.Item {...field} name={[field.name, 'description']} label="説明">
                      <TextArea rows={2} placeholder="プロジェクトの説明" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'url']}
                      label="URL"
                      rules={[{ type: 'url', message: '有効なURLを入力してください' }]}
                    >
                      <Input placeholder="https://..." />
                    </Form.Item>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => add({ name: '', description: '', url: '' })} block icon={<PlusOutlined />}>
                  プロジェクトを追加
                </Button>
              </>
            )}
          </Form.List>
        </div>

        {/* その他リンク */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">その他のリンク</h2>
          <Form.List name="links">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <div key={field.key} className="flex items-center gap-2 mb-2">
                    <Form.Item
                      {...field}
                      name={[field.name, 'name']}
                      className="flex-1 mb-0"
                      rules={[{ required: true, message: '名前を入力' }]}
                    >
                      <Input placeholder="リンク名 (例: Twitter)" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'url']}
                      className="flex-[2] mb-0"
                      rules={[
                        { required: true, message: 'URLを入力' },
                        { type: 'url', message: '有効なURLを入力' },
                      ]}
                    >
                      <Input placeholder="https://..." />
                    </Form.Item>
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(field.name)} />
                  </div>
                ))}
                <Button type="dashed" onClick={() => add({ name: '', url: '' })} block icon={<PlusOutlined />}>
                  リンクを追加
                </Button>
              </>
            )}
          </Form.List>
        </div>

        {/* 送信ボタン */}
        <div className="flex justify-between pt-4 border-t">
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
            戻る
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            {initialValues?.id ? '更新する' : '作成する'}
          </Button>
        </div>
      </Form>
    </Card>
  );
}
