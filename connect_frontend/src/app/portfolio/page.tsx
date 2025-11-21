'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Form, Input, message, Tag, FormListFieldData, FormListOperation } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '@/lib/api';

type Project = {
  name: string;
  description: string;
  url: string;
};

type Link = {
  name: string;
  url: string;
};

interface Portfolio {
  id?: number;
  title: string;
  description: string;
  skills: string[];
  projects: Project[];
  links: Link[];
}

    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await api.get('/api/portfolio');
      if (response.data) {
        setPortfolio(response.data);
        form.setFieldsValue(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: PortfolioFormValues) => {
    try {
      await api.post('/api/portfolio', values);
      message.success('Portfolio updated successfully');
      setEditing(false);
      fetchPortfolio();
    } catch (error) {
      console.error('Failed to update portfolio:', error);
      message.error('Failed to update portfolio');
    }
  };

interface FormListProps {
  fields: FormListFieldData[];
  add: FormListOperation['add'];
  remove: FormListOperation['remove'];
}

const { TextArea } = Input;

type PortfolioFormValues = Omit<Portfolio, 'id'>;

export default function PortfolioPage() {
  const [form] = Form.useForm<PortfolioFormValues>();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await api.get('/api/portfolio');
      if (response.data) {
        setPortfolio(response.data);
        form.setFieldsValue(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: PortfolioFormValues) => {
    try {
      await api.post('/api/portfolio', values);
      message.success('Portfolio updated successfully');
      setEditing(false);
      fetchPortfolio();
    } catch (error) {
      console.error('Failed to update portfolio:', error);
      message.error('Failed to update portfolio');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">読み込み中...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Portfolio</h1>
        <Button
          type={editing ? 'default' : 'primary'}
          icon={editing ? <EditOutlined /> : <PlusOutlined />}
          onClick={() => setEditing(!editing)}
        >
          {editing ? 'Cancel' : 'Edit Portfolio'}
        </Button>
      </div>

      {editing ? (
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={portfolio || { skills: [], projects: [], links: [] }}
          >
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input placeholder="Frontend Developer" />
            </Form.Item>

            <Form.Item name="description" label="Description">
              <TextArea rows={4} placeholder="Tell us about yourself..." />
            </Form.Item>

            <Form.List name="skills">
              {({ fields, add, remove }: FormListProps) => (
                <div>
                  {fields.map((field) => (
                    <Form.Item
                      {...field}
                      key={field.key}
                      label={field.key === '0' ? 'Skills' : ''}
                      extra="Add your skills (e.g., React, Node.js, Design)"
                    >
                      <div className="flex">
                        <Form.Item
                          {...field}
                          noStyle
                          rules={[{ required: true, message: 'Please input a skill' }]}
                        >
                          <Input placeholder="Add a skill" style={{ width: '100%' }} />
                        </Form.Item>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(field.name)}
                        />
                      </div>
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Skill
                    </Button>
                  </Form.Item>
                </div>
              )}
            </Form.List>

            <Form.List name="projects">
              {({ fields, add, remove }: FormListProps) => (
                <div>
                  <h3 className="text-lg font-medium mb-4">Projects</h3>
                  {fields.map((field) => (
                    <Card key={field.key} className="mb-4" size="small">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Project {parseInt(field.key) + 1}</h4>
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
                        label="Project Name"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'description']}
                        label="Description"
                      >
                        <TextArea rows={3} />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'url']}
                        label="Project URL"
                        rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
                      >
                        <Input />
                      </Form.Item>
                    </Card>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() =>
                        add({ name: '', description: '', url: '' })
                      }
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Project
                    </Button>
                  </Form.Item>
                </div>
              )}
            </Form.List>

            <Form.List name="links">
              {({ fields, add, remove }: FormListProps) => (
                <div>
                  <h3 className="text-lg font-medium mb-4">Links</h3>
                  {fields.map((field) => (
                    <div key={field.key} className="flex items-center mb-2">
                      <Form.Item
                        {...field}
                        name={[field.name, 'name']}
                        style={{ flex: 1, marginRight: 8, marginBottom: 0 }}
                        rules={[{ required: true, message: 'Name is required' }]}
                      >
                        <Input placeholder="Label (e.g., GitHub, LinkedIn)" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, 'url']}
                        style={{ flex: 2, marginRight: 8, marginBottom: 0 }}
                        rules={[
                          { required: true, message: 'URL is required' },
                          { type: 'url', message: 'Please enter a valid URL' },
                        ]}
                      >
                        <Input placeholder="https://" />
                      </Form.Item>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(field.name)}
                      />
                    </div>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add({ name: '', url: '' })}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Link
                    </Button>
                  </Form.Item>
                </div>
              )}
            </Form.List>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ) : (
        <Card loading={loading}>
          {portfolio ? (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold">{portfolio.title}</h2>
                <p className="text-gray-600 mt-2">{portfolio.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {portfolio.skills?.map((skill, index) => (
                    <Tag key={index} color="blue">
                      {skill}
                    </Tag>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Projects</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {portfolio.projects?.map((project, index) => (
                    <Card key={index} size="small" className="h-full">
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-gray-600 my-2">{project.description}</p>
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500"
                        >
                          View Project
                        </a>
                      )}
                    </Card>
                  ))}
                </div>
              </div>

              {portfolio.links?.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Links</h3>
                  <div className="flex flex-wrap gap-4">
                    {portfolio.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No portfolio found</p>
              <Button type="primary" onClick={() => setEditing(true)}>
                Create Portfolio
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
