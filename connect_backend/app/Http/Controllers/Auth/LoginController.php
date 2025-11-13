<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    /**
     * ユーザーログイン処理
     *
     * @param LoginRequest $request
     * @return JsonResponse
     * @throws ValidationException
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $request->authenticate();

        $user = User::where('email', $request->email)->first();
        
        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['提供された認証情報が正しくありません。'],
            ]);
        }

        // 既存のトークンを削除
        $user->tokens()->delete();
        
        // 新しいトークンを作成
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'created_at' => $user->created_at,
            ],
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * ユーザーログアウト処理
     *
     * @return JsonResponse
     */
    public function logout(): JsonResponse
    {
        try {
            auth('api')->logout();
            return response()->json(['message' => 'ログアウトしました。']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'ログアウトに失敗しました。'], 500);
        }
    }
}
