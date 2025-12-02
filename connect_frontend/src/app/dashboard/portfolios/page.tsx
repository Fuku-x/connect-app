'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Divider,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Tag,
  Typography,
  Upload,
  message,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  GlobalOutlined,
  InboxOutlined,
  LinkOutlined,
  LockOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import api from '@/lib/api';
import {
  PortfolioFormValues,
  PortfolioMediaUpload,
  PortfolioRecord,
} from '@/types/portfolio';

const { TextArea } = Input;
const { Dragger } = Upload;
const { Title, Paragraph } = Typography;

type UploadCustomRequest = Parameters<NonNullable<UploadProps['customRequest']>>[0];

const defaultFormValues: PortfolioFormValues = {
  title: '',
  description: '',
  skills: [],
  projects: [],
  links: [],
  is_public: false,
  thumbnail_path: undefined,
  gallery_images: [],
  github_url: '',
  external_url: '',
};

const normalizePortfolioList = (payload: any): PortfolioRecord[] => {
  if (!payload) return [];
  const nested = payload.data ?? payload;
  if (Array.isArray(nested)) {
    return nested as PortfolioRecord[];
  }
  if (Array.isArray(nested?.data)) {
    return nested.data as PortfolioRecord[];
  }
  return [];
};

export default function DashboardPortfoliosPage() {
  const [form] = Form.useForm<PortfolioFormValues>();
  const [portfolios, setPortfolios] = useState<PortfolioRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [thumbnailFileList, setThumbnailFileList] = useState<UploadFile[]>([]);
  const [galleryFileList, setGalleryFileList] = useState<UploadFile[]>([]);
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioRecord | null>(null);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/portfolio');
      setPortfolios(normalizePortfolioList(response.data));
    } catch (error) {
      console.error(error);
      message.error('ポートフォリオの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingPortfolio(null);
    form.setFieldsValue(defaultFormValues);
    setThumbnailFileList([]);
    setGalleryFileList([]);
    setModalOpen(true);
  };

  const openEditModal = (record: PortfolioRecord) => {
    setEditingPortfolio(record);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      skills: record.skills ?? [],
      projects: record.projects ?? [],
      links: record.links ?? [],
      is_public: record.is_public ?? false,
      thumbnail_path: record.thumbnail_path ?? undefined,
      gallery_images: record.gallery_images ?? [],
      github_url: record.github_url ?? '',
      external_url: record.external_url ?? '',
    });

    if (record.thumbnail_url) {
      setThumbnailFileList([
        {
          uid: `${record.id}-thumbnail`,
          name: 'thumbnail.jpg',
          status: 'done',
          url: record.thumbnail_url,
          response: {
            path: record.thumbnail_path,
            url: record.thumbnail_url,
          } as PortfolioMediaUpload,
        },
      ]);
    } else {
      setThumbnailFileList([]);
    }

    if (record.gallery_image_urls?.length) {
      setGalleryFileList(
        record.gallery_image_urls.map((url, index) => ({
          uid: `${record.id}-gallery-${index}`,
          name: `gallery-${index + 1}.jpg`,
          status: 'done',
          url,
          response: {
            path: record.gallery_images?.[index],
            url,
          } as PortfolioMediaUpload,
        }))
      );
    } else {
      setGalleryFileList([]);
    }

    setModalOpen(true);
  };

  const resetModal = () => {
    setModalOpen(false);
    setSubmitting(false);
    form.resetFields();
    setThumbnailFileList([]);
    setGalleryFileList([]);
  };

  const submitPortfolio = async (values: PortfolioFormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        skills: values.skills?.filter(Boolean) ?? [],
        projects: values.projects
          ?.filter((project) => project?.name)
          .map((project) => ({
            name: project.name,
            description: project.description ?? '',
            url: project.url ?? '',
            image: project.image ?? null,
          })) ?? [],
        links: values.links
          ?.filter((link) => link?.name && link?.url)
          .map((link) => ({ name: link.name, url: link.url })) ?? [],
      };

      if (editingPortfolio?.id) {
        await api.put(`/api/portfolio/${editingPortfolio.id}`, payload);
        message.success('ポートフォリオを更新しました');
      } else {
        await api.post('/api/portfolio', payload);
        message.success('ポートフォリオを作成しました');
      }

      resetModal();
      fetchPortfolios();
    } catch (error) {
      console.error(error);
      message.error('ポートフォリオの保存に失敗しました');
      setSubmitting(false);
    }
  };

  const handleDelete = async (record: PortfolioRecord) => {
    if (!record.id) return;
    try {
      await api.delete(`/api/portfolio/${record.id}`);
      message.success('ポートフォリオを削除しました');
      fetchPortfolios();
    } catch (error) {
      console.error(error);
      message.error('ポートフォリオの削除に失敗しました');
    }
  };

  const thumbnailUploadProps: UploadProps = useMemo(
    () => ({
      name: 'thumbnail',
      multiple: false,
      accept: 'image/*',
      fileList: thumbnailFileList,
      listType: 'picture',
      customRequest: async (options: UploadCustomRequest) => {
        const { file, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append('thumbnail', file as RcFile);
        try {
          const response = await api.post('/api/portfolio/upload-thumbnail', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          const upload: PortfolioMediaUpload = response.data?.data;
          form.setFieldsValue({ thumbnail_path: upload.path });
          setThumbnailFileList([
            {
              uid: 'thumbnail-uploaded',
              name: (file as RcFile).name,
              status: 'done',
              url: upload.url,
              response: upload,
            },
          ]);
          onSuccess?.(upload, file as RcFile);
          message.success('サムネイルをアップロードしました');
        } catch (err) {
          console.error(err);
          onError?.(err as Error);
          message.error('サムネイルのアップロードに失敗しました');
        }
      },
      onRemove: () => {
        form.setFieldsValue({ thumbnail_path: undefined });
        setThumbnailFileList([]);
      },
      maxCount: 1,
      showUploadList: true,
    }),
    [thumbnailFileList, form]
  );

  const galleryUploadProps: UploadProps = useMemo(
    () => ({
      name: 'images',
      multiple: true,
      accept: 'image/*',
      fileList: galleryFileList,
      listType: 'picture-card',
      customRequest: async (options: UploadCustomRequest) => {
        const { file, onSuccess, onError } = options;
        const formData = new FormData();
        formData.append('images[]', file as RcFile);
        try {
          const response = await api.post('/api/portfolio/upload-gallery', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          const uploads: PortfolioMediaUpload[] = response.data?.data ?? [];
          const [upload] = uploads;
          if (upload) {
            const current = form.getFieldValue('gallery_images') ?? [];
            form.setFieldsValue({ gallery_images: [...current, upload.path] });
            setGalleryFileList((prev: UploadFile[]) => [
              ...prev,
              {
                uid: `${Date.now()}`,
                name: (file as RcFile).name,
                status: 'done',
                url: upload.url,
                response: upload,
              },
            ]);
            onSuccess?.(upload, file as RcFile);
            message.success('ギャラリー画像を追加しました');
          }
        } catch (err) {
          console.error(err);
          onError?.(err as Error);
          message.error('ギャラリー画像のアップロードに失敗しました');
        }
      },
      onRemove: (file: UploadFile) => {
        const current: string[] = form.getFieldValue('gallery_images') ?? [];
        const targetPath = (file.response as PortfolioMediaUpload | undefined)?.path;
        form.setFieldsValue({
          gallery_images: current.filter((path) => path !== targetPath),
        });
        setGalleryFileList((prev: UploadFile[]) => prev.filter((item: UploadFile) => item.uid !== file.uid));
      },
    }),
    [galleryFileList, form]
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <Title level={3} className="!mb-1">
            マイポートフォリオ
          </Title>
          <Paragraph className="!mb-0 text-gray-500">
            あなたの実績やスキルをまとめ、公開・共有しましょう。
          </Paragraph>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
          新しく作成
        </Button>
      </div>

      {portfolios.length === 0 ? (
        <Card loading={loading}>
          <Empty description="まだポートフォリオがありません" />
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {portfolios.map((portfolio) => (
            <Card
              key={portfolio.id}
              hoverable
              cover={
                portfolio.thumbnail_url ? (
                  <img
                    src={portfolio.thumbnail_url}
                    alt={`${portfolio.title} thumbnail`}
                    className="h-52 w-full object-cover"
                  />
                ) : (
                  <div className="h-52 w-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <InboxOutlined className="text-3xl" />
                  </div>
                )
              }
              actions={[
                <Button type="link" icon={<EditOutlined />} onClick={() => openEditModal(portfolio)}>
                  編集
                </Button>,
                <Popconfirm
                  title="ポートフォリオを削除"
                  description="このポートフォリオを削除しますか？"
                  okText="削除"
                  okButtonProps={{ danger: true }}
                  cancelText="キャンセル"
                  onConfirm={() => handleDelete(portfolio)}
                >
                  <Button type="link" danger icon={<DeleteOutlined />}>
                    削除
                  </Button>
                </Popconfirm>,
              ]}
            >
              <div className="flex items-center justify-between mb-3">
                <Title level={5} className="!mb-0">
                  {portfolio.title}
                </Title>
                <Tag color={portfolio.is_public ? 'green' : 'default'} icon={portfolio.is_public ? <GlobalOutlined /> : <LockOutlined />}>
                  {portfolio.is_public ? '公開中' : '非公開'}
                </Tag>
              </div>
              <Paragraph ellipsis={{ rows: 3 }}>{portfolio.description}</Paragraph>

              {portfolio.skills?.length ? (
                <Space wrap size={[0, 8]} className="mt-3">
                  {portfolio.skills.map((skill) => (
                    <Tag key={skill}>{skill}</Tag>
                  ))}
                </Space>
              ) : null}

              <Divider className="!my-4" />

              <div className="space-y-2 text-sm text-gray-500">
                {portfolio.github_url && (
                  <a href={portfolio.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-500">
                    <LinkOutlined /> GitHub
                  </a>
                )}
                {portfolio.external_url && (
                  <a href={portfolio.external_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-500">
                    <LinkOutlined /> Website
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        title={editingPortfolio ? 'ポートフォリオを編集' : 'ポートフォリオを作成'}
        open={modalOpen}
        onCancel={resetModal}
        onOk={() => form.submit()}
        okText={editingPortfolio ? '更新' : '作成'}
        confirmLoading={submitting}
        width={900}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={defaultFormValues}
          onFinish={submitPortfolio}
        >
          <Form.Item name="title" label="タイトル" rules={[{ required: true, message: 'タイトルを入力してください' }]}
>
            <Input placeholder="例: フロントエンドエンジニア" />
          </Form.Item>

          <Form.Item name="description" label="自己紹介">
            <TextArea rows={3} placeholder="経歴や得意分野を入力" />
          </Form.Item>

          <Form.Item name="skills" label="スキルタグ">
            <Select
              mode="tags"
              placeholder="スキルを追加"
              tokenSeparators={[',']}
              options={(form.getFieldValue('skills') ?? []).map((skill: string) => ({ label: skill, value: skill }))}
            />
          </Form.Item>

          <div className="grid gap-4 lg:grid-cols-2">
            <Form.Item label="サムネイル" name="thumbnail_path">
              <Dragger {...thumbnailUploadProps} className="max-h-48">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">サムネイルをドラッグ＆ドロップ、またはクリックして選択</p>
                <p className="ant-upload-hint">最大 2MB / 1枚</p>
              </Dragger>
            </Form.Item>

            <Form.Item label="ギャラリー画像" name="gallery_images">
              <Dragger {...galleryUploadProps} multiple>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">複数枚のスクリーンショットをドラッグ＆ドロップ</p>
                <p className="ant-upload-hint">最大6枚までアップロード可能</p>
              </Dragger>
            </Form.Item>
          </div>

          <Form.List name="projects">
            {(fields, { add, remove }) => (
                <Card
                  title="プロジェクト"
                  extra={
                    <Button type="dashed" icon={<PlusOutlined />} onClick={() => add({ name: '', description: '', url: '' })}>
                      プロジェクトを追加
                    </Button>
                  }
                >
                  {fields.length === 0 && <Empty description="プロジェクト未登録" />}
                  {fields.map((field) => (
                    <Card key={field.key} type="inner" className="mb-4" title={`#${field.name + 1}`}
                      extra={<Button type="link" danger onClick={() => remove(field.name)}>削除</Button>}
                    >
                      <Form.Item
                        {...field}
                        name={[field.name, 'name']}
                        label="プロジェクト名"
                        rules={[{ required: true, message: 'プロジェクト名を入力してください' }]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item {...field} name={[field.name, 'description']} label="概要">
                        <TextArea rows={2} />
                      </Form.Item>
                      <Form.Item {...field} name={[field.name, 'url']} label="URL" rules={[{ type: 'url', message: '正しいURLを入力してください' }]}>
                        <Input placeholder="https://" />
                      </Form.Item>
                    </Card>
                  ))}
                </Card>
            )}
          </Form.List>

          <Form.List name="links">
            {(fields, { add, remove }) => (
                <Card
                  title="リンク"
                  className="mt-6"
                  extra={
                    <Button type="dashed" icon={<PlusOutlined />} onClick={() => add({ name: '', url: '' })}>
                      リンクを追加
                    </Button>
                  }
                >
                  {fields.length === 0 && <Empty description="リンク未登録" />}
                  {fields.map((field) => (
                    <div key={field.key} className="grid gap-3 md:grid-cols-2 mb-4">
                      <Form.Item
                        {...field}
                        name={[field.name, 'name']}
                        label="表示名"
                        rules={[{ required: true, message: '表示名を入力してください' }]}
                      >
                        <Input placeholder="GitHub / Notion など" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'url']}
                        label="URL"
                        rules={[
                          { required: true, message: 'URLを入力してください' },
                          { type: 'url', message: '正しいURLを入力してください' },
                        ]}
                      >
                        <Input placeholder="https://" />
                      </Form.Item>
                      <Button type="link" danger onClick={() => remove(field.name)}>
                        削除
                      </Button>
                    </div>
                  ))}
                </Card>
            )}
          </Form.List>

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <Form.Item name="github_url" label="GitHub URL" rules={[{ type: 'url', message: '正しいURLを入力してください' }]}>
              <Input placeholder="https://github.com/username" />
            </Form.Item>
            <Form.Item name="external_url" label="外部URL" rules={[{ type: 'url', message: '正しいURLを入力してください' }]}>
              <Input placeholder="https://your-portfolio.com" />
            </Form.Item>
          </div>

          <Form.Item name="is_public" label="公開設定" valuePropName="checked">
            <Switch checkedChildren="公開" unCheckedChildren="非公開" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
