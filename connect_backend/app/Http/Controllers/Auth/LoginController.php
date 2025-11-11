<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

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
        $credentials = $request->only('email', 'password');

        try {
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    'message' => '認証に失敗しました。メールアドレスまたはパスワードが正しくありません。',
                ], 401);
            }
        } catch (JWTException $e) {
            return response()->json([
                'message' => 'トークンの作成に失敗しました。',
            ], 500);
        }

        $user = Auth::user();

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60, // in seconds
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]
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
