'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    console.log('Form submitted');

    // メールアドレスのバリデーション
    const emailRegex = /^[^\s@]+@st\.kobedenshi\.ac\.jp$/;
    if (!emailRegex.test(formData.email)) {
      const errorMsg = '有効な神戸電子のメールアドレス(@st.kobedenshi.ac.jp)を入力してください';
      console.error('Validation error:', errorMsg);
      setError(errorMsg);
      return;
    }

    // パスワードの最小文字数チェック
    if (formData.password.length < 8) {
      const errorMsg = 'パスワードは8文字以上で入力してください';
      console.error('Validation error:', errorMsg);
      setError(errorMsg);
      return;
    }

    setIsLoading(true);
    console.log('Sending registration request...');

    try {
      // Prepare registration data
      const registrationData = {
        name: formData.email.split('@')[0],
        email: formData.email.trim(),
        password: formData.password,
        password_confirmation: formData.password,
      };

      console.log('Sending registration data:', registrationData);

      // Send the registration request
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(registrationData),
      });

      console.log('Registration response status:', response.status);

      const responseData = await response.json().catch(e => {
        console.error('Failed to parse JSON response:', e);
        return { message: 'Invalid server response' };
      });

      console.log('Response status:', response.status);
      console.log('Response data:', responseData);

      if (!response.ok) {
        // バリデーションエラーメッセージを処理
        if (responseData.errors) {
          const errorMessages = Object.values(responseData.errors).flat();
          throw new Error(errorMessages.join('\n'));
        }
        throw new Error(responseData.message || `登録に失敗しました (${response.status})`);
      }

      // 登録成功時の処理
      console.log('Registration successful, redirecting to login...');
      
      // 登録成功メッセージを表示してログインページにリダイレクト
      alert('登録が完了しました。ログインページに移動します。');
      router.push('/auth/login');
      
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || '登録中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-zinc-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center">
          <Link href="/" className="flex items-center">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">Kobe Connect</span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
          新規アカウントを作成
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-6 py-8 shadow sm:rounded-lg sm:px-10 dark:bg-zinc-800">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                  メールアドレス
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-zinc-700 dark:text-white dark:ring-zinc-600"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                  パスワード
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-zinc-700 dark:text-white dark:ring-zinc-600"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  8文字以上のパスワードを設定してください
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? '登録中...' : 'アカウントを作成'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                既にアカウントをお持ちの方は{' '}
                <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                  ログイン
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default RegisterPage;
