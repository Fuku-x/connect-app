<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    /**
     * 新規ユーザー登録
     *
     * @param RegisterRequest $request
     * @return JsonResponse
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();
        
        // メールアドレスからユーザー名を生成 (例: example@st.kobedenshi.ac.jp -> example)
        $username = explode('@', $validated['email'])[0];
        
        $user = User::create([
            'name' => $username, // メールアドレスの@より前の部分をユーザー名として使用
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'email_verified_at' => null, // Explicitly set to null
        ]);

        // トークンを生成
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'created_at' => $user->created_at,
            ],
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }
}
