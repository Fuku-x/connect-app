'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, List, Tag, Input, Modal, Form, message, Space, Divider } from 'antd';
import { PlusOutlined, SearchOutlined, ClockCircleOutlined, DollarOutlined } from '@ant-design/icons';
import api from '@/lib/api';

const { Search } = Input;
const { TextArea } = Input;

interface Recruitment {
  id: number;
  title: string;
  description: string;
  required_skills: string[];
  project_duration: string;
  compensation: string;
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
      const response = await api.get('/api/recruitments');
      setRecruitments(response.data);
    } catch (error) {
      console.error('Failed to fetch recruitments:', error);
      message.error('Failed to load recruitments');
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
      await api.post('/api/recruitments', {
        ...values,
        required_skills: values.required_skills ? values.required_skills.split(',').map((s: string) => s.trim()) : []
      });
      message.success('Recruitment post created successfully');
      setIsModalVisible(false);
      fetchRecruitments();
    } catch (error) {
      console.error('Failed to create recruitment post:', error);
      message.error('Failed to create recruitment post');
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Recruitment Board</h1>
        <div className="w-full md:w-1/3">
          <Search
            placeholder="Search by title, description, or skills"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          className="mt-4 md:mt-0"
          onClick={handleCreatePost}
        >
          Create Post
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
                {recruitment.compensation && (
                  <div className="flex items-center">
                    <DollarOutlined className="mr-1" />
                    <span>{recruitment.compensation}</span>
                  </div>
                )}
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
        title="Create Recruitment Post"
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
            label="Title"
            rules={[{ required: true, message: 'Please input the title!' }]}
          >
            <Input placeholder="Looking for a React developer" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <TextArea rows={6} placeholder="Describe the position, requirements, and project details..." />
          </Form.Item>

          <Form.Item
            name="required_skills"
            label="Required Skills (comma separated)"
            rules={[{ required: true, message: 'Please input at least one skill!' }]}
          >
            <Input placeholder="React, Node.js, TypeScript" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="project_duration"
              label="Project Duration"
              rules={[{ required: true, message: 'Please input the project duration!' }]}
            >
              <Input placeholder="3 months" />
            </Form.Item>

            <Form.Item
              name="compensation"
              label="Compensation (Optional)"
            >
              <Input placeholder="$2000/month" />
            </Form.Item>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button onClick={() => setIsModalVisible(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Post
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
