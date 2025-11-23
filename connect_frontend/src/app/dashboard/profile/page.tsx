'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, getAuthHeader, removeAuthToken } from '@/lib/auth';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  student_id?: string;
  department?: string;
  grade?: number;
  bio?: string;
  profile_image?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    id: 0,
    name: '',
    email: '',
    student_id: '',
    department: '',
    grade: 1,
    bio: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getAuthToken();
      if (!token) {
        router.push('/auth/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/profile', {
          headers: {
            ...getAuthHeader(),
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            removeAuthToken();
            router.push('/auth/login');
            return;
          }
          throw new Error('プロフィールの取得に失敗しました');
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error instanceof Error) {
          setErrorMessage(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === 'grade' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);
    
    const token = getAuthToken();
    if (!token) {
      setErrorMessage('認証トークンが見つかりません。再度ログインしてください。');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        if (response.status === 401) {
          removeAuthToken();
          router.push('/auth/login');
          return;
        }
        throw new Error('プロフィールの更新に失敗しました');
      }

      const data = await response.json();
      setProfile(data);
      setSuccessMessage('プロフィールを更新しました');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage(error instanceof Error ? error.message : 'プロフィールの更新中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={handleGoBack}
          className="mb-6 inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
        >
          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          戻る
        </button>
        {successMessage && (
          <div className="mb-6 rounded-md bg-green-50 dark:bg-green-900 p-4">
            <div className="flex">
              <div className="shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  {successMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-md bg-red-50 dark:bg-red-900 p-4">
            <div className="flex">
              <div className="shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  {errorMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-zinc-800 shadow-lg rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-zinc-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">プロフィール</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  編集する
                </button>
              ) : (
                <div className="space-x-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-zinc-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? '保存中...' : '保存する'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-6">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        氏名
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={profile.name}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        メールアドレス
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={profile.email}
                          readOnly
                          className="bg-gray-100 shadow-sm block w-full sm:text-sm border-gray-300 rounded-md dark:bg-zinc-800 dark:border-zinc-600 dark:text-gray-300"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="student_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        学籍番号
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="student_id"
                          id="student_id"
                          value={profile.student_id || ''}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        学科
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="department"
                          id="department"
                          value={profile.department || ''}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="grade" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        学年
                      </label>
                      <div className="mt-1">
                        <select
                          id="grade"
                          name="grade"
                          value={profile.grade || 1}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                        >
                          {[1, 2, 3, 4, 5, 6].map((grade) => (
                            <option key={grade} value={grade}>
                              {grade}年
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        自己紹介
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="bio"
                          name="bio"
                          rows={3}
                          value={profile.bio || ''}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                          placeholder="自己紹介を入力してください"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">氏名</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{profile.name}</p>
                  </div>

                  <div className="sm:col-span-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">メールアドレス</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{profile.email}</p>
                  </div>

                  <div className="sm:col-span-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">学籍番号</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{profile.student_id || '未設定'}</p>
                  </div>

                  <div className="sm:col-span-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">学科</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{profile.department || '未設定'}</p>
                  </div>

                  <div className="sm:col-span-3">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">学年</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{profile.grade || '1'}年</p>
                  </div>

                  {profile.bio && (
                    <div className="sm:col-span-6">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">自己紹介</p>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-line">{profile.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
