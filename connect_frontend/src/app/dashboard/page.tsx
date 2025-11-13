'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Import individual components to reduce bundle size
import Button from 'antd/es/button';
import Card from 'antd/es/card';
import Avatar from 'antd/es/avatar';
import List from 'antd/es/list';
import Tag from 'antd/es/tag';
import { message } from 'antd';
import { PlusOutlined, UserOutlined, TeamOutlined, FileTextOutlined, MessageOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Meta } = Card;
import api from '@/lib/api';

interface Project {
  id: number;
  name: string;
  description: string;
  skills: string[];
}

interface Recruitment {
  id: number;
  title: string;
  description: string;
  required_skills: string[];
  created_at: string;
}

const DashboardPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [activeTab, setActiveTab] = useState('projects');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No access token found');
      router.push('/auth/login');
      return;
    }
    
    // Verify token is not expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        console.error('Token expired');
        localStorage.removeItem('access_token');
        router.push('/auth/login');
        return;
      }
    } catch (error) {
      console.error('Invalid token format:', error);
      localStorage.removeItem('access_token');
      router.push('/auth/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        // プロジェクトと募集情報を並行して取得
        const [projectsRes, recruitmentsRes] = await Promise.all([
          api.get('/api/portfolio'),
          api.get('/api/recruitments')
        ]);
        
        if (projectsRes.data) {
          setProjects(projectsRes.data.projects || []);
        }
        
        if (recruitmentsRes.data) {
          setRecruitments(recruitmentsRes.data);
        }
      } catch (error: any) {
        console.error('データの取得に失敗しました:', error);
        if (error.response?.status === 401) {
          // Token might be invalid or expired
          localStorage.removeItem('access_token');
          router.push('/auth/login');
          return;
        }
        message.error(`データの取得に失敗しました: ${error.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await api.post('/api/logout');
    } catch (error) {
      console.error('ログアウト中にエラーが発生しました:', error);
    } finally {
      // トークンとユーザー情報を削除
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      // ログインページにリダイレクト
      router.push('/auth/login');
    }
  };

  const tabList = [
    {
      key: 'projects',
      tab: 'マイプロジェクト',
      icon: <FileTextOutlined />
    },
    {
      key: 'recruitments',
      tab: 'メンバー募集',
      icon: <TeamOutlined />
    },
    {
      key: 'messages',
      tab: 'メッセージ',
      icon: <MessageOutlined />
    }
  ];

  // 型定義を明示的に指定
  interface ContentListType {
    [key: string]: React.ReactNode;
  }

  const contentList: ContentListType = {
    projects: (
      <List
        itemLayout="horizontal"
        dataSource={projects}
        loading={loading}
        renderItem={(project: Project) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => router.push(`/portfolio/edit/${project.id}`)}>編集</Button>,
              <Button type="link" onClick={() => router.push(`/projects/${project.id}`)}>
                詳細を見る
              </Button>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<FileTextOutlined />} />}
              title={project.name}
              description={
                <div>
                  <p className="mb-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {project.skills?.map((skill, i) => (
                      <Tag key={i} color="blue" style={{ margin: 0 }}>
                        {skill}
                      </Tag>
                    ))}
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    ),
    recruitments: (
      <List
        itemLayout="horizontal"
        dataSource={recruitments}
        loading={loading}
        renderItem={(recruitment: Recruitment) => (
          <List.Item
            actions={[
              <Button 
                type="primary" 
                ghost
                onClick={() => router.push(`/recruitments/${recruitment.id}`)}
              >
                詳細を見る
              </Button>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<TeamOutlined />} />}
              title={recruitment.title}
              description={
                <div>
                  <p className="mb-2">{recruitment.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {recruitment.required_skills?.map((skill, i) => (
                      <Tag key={i} color="green" style={{ margin: 0 }}>
                        {skill}
                      </Tag>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    募集日: {new Date(recruitment.created_at).toLocaleDateString()}
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    ),
    messages: (
      <div className="text-center py-8">
        <MessageOutlined className="text-4xl text-gray-400 mb-4" />
        <p className="text-gray-500">メッセージはまだありません</p>
      </div>
    )
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50 dark:bg-zinc-900">
      <header className="bg-white shadow-sm dark:bg-zinc-800">
        <div className="mx-auto w-full px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                Kobe Connect
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => {
                  if (activeTab === 'projects') {
                    router.push('/portfolio/new');
                  } else if (activeTab === 'recruitments') {
                    router.push('/recruitments/new');
                  }
                }}
              >
                {activeTab === 'projects' ? '新規プロジェクト' : '新規募集'}
              </Button>
              <Button
                type="primary"
                danger
                onClick={handleLogout}
              >
                ログアウト
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl pt-4">
          <Card
            className="shadow-lg"
            tabList={tabList}
            activeTabKey={activeTab}
            onTabChange={(key) => setActiveTab(key as string)}
            tabBarExtraContent={
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {activeTab === 'projects' 
                    ? `${projects.length} プロジェクト`
                    : activeTab === 'recruitments'
                    ? `${recruitments.length} 件の募集`
                    : 'メッセージ'}
                </span>
              </div>
            }
          >
            {contentList[activeTab]}
          </Card>
          
          {/* クイックアクション */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <style jsx>{`
              .card-content {
                display: flex;
                flex-direction: column;
                height: 100%;
              }
              .card-content > :not(:last-child) {
                flex-grow: 1;
              }
              .card-content {
                padding: 1.25rem;
                box-sizing: border-box;
              }
              .action-button {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                margin-top: 1.5rem;
                padding: 0.5rem 1rem;
                height: auto;
                min-height: 40px;
              }
            `}</style>
            
            {/* ポートフォリオカード */}
            <Card className="hover:shadow-lg transition-shadow h-full">
              <div className="card-content">
                <div className="flex items-start space-x-4 mb-2">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FileTextOutlined className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium">ポートフォリオを作成</h3>
                    <p className="text-sm text-gray-500 mt-1">あなたのスキルや実績をアピール</p>
                  </div>
                </div>
                <Button 
                  type="primary" 
                  ghost
                  className="action-button"
                  onClick={() => router.push('/portfolio/new')}
                >
                  作成する <span>→</span>
                </Button>
              </div>
            </Card>
            
            {/* メンバー募集カード */}
            <Card className="hover:shadow-lg transition-shadow h-full">
              <div className="card-content">
                <div className="flex items-start space-x-4 mb-2">
                  <div className="p-3 bg-green-100 rounded-full">
                    <TeamOutlined className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium">メンバーを募集</h3>
                    <p className="text-sm text-gray-500 mt-1">プロジェクトに必要なスキルを募集</p>
                  </div>
                </div>
                <Button 
                  type="primary" 
                  ghost
                  className="action-button"
                  onClick={() => router.push('/recruitments/new')}
                >
                  募集を投稿 <span>→</span>
                </Button>
              </div>
            </Card>
            
            {/* タスク管理カード */}
            <Card className="hover:shadow-lg transition-shadow h-full">
              <div className="card-content">
                <div className="flex items-start space-x-4 mb-2">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <CheckCircleOutlined className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium">タスク管理</h3>
                    <p className="text-sm text-gray-500 mt-1">プロジェクトのタスクを管理</p>
                  </div>
                </div>
                <Button 
                  type="primary" 
                  ghost
                  className="action-button"
                  onClick={() => setActiveTab('tasks')}
                >
                  タスクを確認 <span>→</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t border-gray-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Connect App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
