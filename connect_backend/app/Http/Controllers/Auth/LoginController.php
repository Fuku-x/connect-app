<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
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

        if (! $token = auth('api')->attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['提供された認証情報が正しくありません。'],
            ]);
        }

        $user = auth('api')->user();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'student_id' => $user->student_id,
                'department' => $user->department,
                'grade' => $user->grade,
                'bio' => $user->bio,
                'profile_image' => $user->profile_image,
                'created_at' => $user->created_at,
            ],
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60
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
    
    /**
     * ログインユーザーの情報を取得
     *
     * @return JsonResponse
     */
    public function me(): JsonResponse
    {
        return response()->json(auth('api')->user());
    }
    
    /**
     * トークンをリフレッシュ
     *
     * @return JsonResponse
     */
    public function refresh(): JsonResponse
    {
        return $this->respondWithToken(auth('api')->refresh());
    }
    
    /**
     * トークン付きレスポンスを生成
     *
     * @param  string $token
     * @return JsonResponse
     */
    protected function respondWithToken($token): JsonResponse
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60
        ]);
    }
}
