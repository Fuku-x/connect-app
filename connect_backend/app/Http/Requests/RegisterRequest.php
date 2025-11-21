<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
{
    /**
     * リクエストの認証を決定
     */
    public function authorize(): bool
    {
        return true; // 認証なしでアクセス可能
    }

    /**
     * バリデーションルールを取得
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'string',
                'email:rfc,dns',
                'max:255',
                'unique:users,email',
                'regex:/^[^@]+@st\.kobedenshi\.ac\.jp$/i',
            ],
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/^[a-zA-Z0-9]+$/',
            ],
        ];
    }

    /**
     * バリデーションエラーメッセージをカスタマイズ
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required' => 'メールアドレスは必須です。',
            'email.email' => '有効なメールアドレスを入力してください。',
            'email.unique' => 'このメールアドレスは既に登録されています。',
            'email.regex' => '神戸電子のメールアドレス(@st.kobedenshi.ac.jp)を使用してください',
            'password.required' => 'パスワードは必須です。',
            'password.min' => 'パスワードは8文字以上で入力してください。',
            'password.confirmed' => 'パスワードが確認用と一致しません。',
            'password.regex' => 'パスワードは半角英数字で入力してください',
        ];
    }
}
