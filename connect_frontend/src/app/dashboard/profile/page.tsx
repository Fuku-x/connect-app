'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
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

const ProfilePage = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>({
    id: 0,
    name: '',
    email: '',
    student_id: '',
    department: '',
    grade: 1,
    bio: '',
    profile_image: ''
  });

  useEffect(() => {
    // 認証チェックとプロフィールデータの取得
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
            // 認証エラーの場合、ログイン画面にリダイレクト
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

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // エラーメッセージをリセット
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);
    
    // Get the auth token using our utility
    const token = getAuthToken();
    
    if (!token) {
      setErrorMessage('認証トークンが見つかりません。再度ログインしてください。');
      setIsLoading(false);
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/auth/login');
      }, 1500);
      return;
    }
    
    try {
      console.log('Sending profile update request with data:', profile);
      
      const response = await fetch('http://localhost:8000/api/profile', {
        method: 'PUT',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(profile)
      });

      // レスポンスのテキストを取得
      const responseText = await response.text();
      console.log('Raw response text:', responseText);
      
      // 空のレスポンスをチェック
      if (!responseText) {
        throw new Error('サーバーからの応答が空です');
      }
      
      // JSONとしてパースを試みる
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        throw new Error(`無効なJSONレスポンス: ${responseText.substring(0, 100)}...`);
      }
      
      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          removeAuthToken();
          // Redirect to login after a short delay
          setTimeout(() => {
            router.push('/auth/login');
          }, 1500);
          throw new Error('認証に失敗しました。再度ログインしてください。');
        }
        throw new Error(data.message || `プロフィールの更新に失敗しました (${response.status})`);
      }
      
      console.log('Profile update response:', data);
      
      // 成功時の処理
      const updatedProfile = data.user || data;
      setProfile(prev => ({
        ...prev,
        ...updatedProfile
      }));
      
      // ローカルストレージのユーザー情報も更新
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...user,
        ...updatedProfile
      }));
      
      setSuccessMessage('プロフィールを更新しました');
      setIsEditing(false);
      
      // 3秒後に成功メッセージを消す
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
      // クリーンアップ関数を返す
      return () => clearTimeout(timer);
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      let errorMessage = 'プロフィールの更新中にエラーが発生しました';
      
      if (error instanceof SyntaxError) {
        // JSON パースエラーの場合
        console.error('JSON Parse Error:', error);
        errorMessage = 'サーバーからの応答の解析中にエラーが発生しました';
      } else if (error.response) {
        // レスポンスがあるがエラーステータスの場合
        console.error('Error response status:', error.response.status);
        
        // 認証エラーの場合
        if (error.response.status === 401) {
          removeAuthToken();
          setErrorMessage('セッションの有効期限が切れました。再度ログインしてください。');
          setTimeout(() => {
            router.push('/auth/login');
          }, 2000);
          return;
        }
        
        // バリデーションエラーの場合
        if (error.response.status === 422 && error.response.data?.errors) {
          const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
          errorMessage = errorMessages;
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = `サーバーエラーが発生しました (${error.response.status})`;
        }
      } else if (error.request) {
        // リクエストは送信されたが、レスポンスが返ってこなかった場合
        console.error('No response received:', error.request);
        errorMessage = 'サーバーからの応答がありません。ネットワーク接続を確認してください。';
      } else {
        // リクエストの設定中にエラーが発生した場合
        console.error('Request setup error:', error.message);
        errorMessage = `リクエストの送信中にエラーが発生しました: ${error.message}`;
      }
      
      setErrorMessage(errorMessage);
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* 成功メッセージ */}
        {successMessage && (
          <div className="rounded-md bg-green-50 dark:bg-green-900 p-4">
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

        {/* エラーメッセージ */}
        {errorMessage && (
          <div className="rounded-md bg-red-50 dark:bg-red-900 p-4">
            <div className="flex">
              <div className="shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200 whitespace-pre-line">
                  {errorMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-zinc-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200 dark:border-zinc-700">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="ダッシュボードに戻る"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                プロフィール
              </h3>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                編集する
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-zinc-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleSubmit}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  保存する
                </button>
              </div>
            )}
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            {isEditing ? (
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      氏名
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      メールアドレス
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={profile.email}
                      readOnly
                      className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-gray-300 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="student_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      学籍番号
                    </label>
                    <input
                      type="text"
                      name="student_id"
                      id="student_id"
                      value={profile.student_id || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      学科
                    </label>
                    <input
                      type="text"
                      name="department"
                      id="department"
                      value={profile.department || ''}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="grade" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      学年
                    </label>
                    <select
                      id="grade"
                      name="grade"
                      value={profile.grade || 1}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white sm:text-sm"
                    >
                      {[1, 2, 3, 4, 5, 6].map(grade => (
                        <option key={grade} value={grade}>
                          {grade}年
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    自己紹介
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={profile.bio || ''}
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                      placeholder="自己紹介を入力してください"
                    />
                  </div>
                </div>
                
                {/* プロフィール画像アップロード機能は後で実装 */}
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">氏名</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{profile.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">メールアドレス</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{profile.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">学籍番号</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {profile.student_id || '未設定'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">学科</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {profile.department || '未設定'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">学年</p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {profile.grade ? `${profile.grade}年` : '未設定'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">自己紹介</p>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-line">
                    {profile.bio || '自己紹介がありません'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
