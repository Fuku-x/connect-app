<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Response;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Api\ProfileController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// CORS middleware is applied globally in bootstrap/app.php

// 認証不要なルート
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [LoginController::class, 'login'])->name('login');

// トークンリフレッシュ
Route::post('/refresh-token', [\App\Http\Controllers\Api\AuthController::class, 'refresh']);

// パスワードリセット
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [ResetPasswordController::class, 'reset']);

// 認証が必要なルート - JWT ミドルウェアを使用
Route::middleware(['auth:api'])->group(function () {
    // 現在のユーザー情報を取得
    Route::get('/me', [LoginController::class, 'me']);
    // トークンリフレッシュ
    Route::post('/refresh-token', [LoginController::class, 'refresh']);
    // ログアウト
    Route::post('/logout', [LoginController::class, 'logout']);
    
    // ユーザー情報の取得
    Route::get('/user', [UserController::class, 'show']);

    // ポートフォリオ関連
    Route::prefix('portfolio')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\PortfolioController::class, 'index']);
        Route::get('/{id}', [\App\Http\Controllers\Api\PortfolioController::class, 'show']);
        Route::post('/', [\App\Http\Controllers\Api\PortfolioController::class, 'store']);
    });

    // メンバー募集関連
    Route::prefix('recruitments')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\RecruitmentController::class, 'index']);
        Route::get('/{id}', [\App\Http\Controllers\Api\RecruitmentController::class, 'show']);
        Route::post('/', [\App\Http\Controllers\Api\RecruitmentController::class, 'store']);
        Route::put('/{id}', [\App\Http\Controllers\Api\RecruitmentController::class, 'update']);
        Route::delete('/{id}', [\App\Http\Controllers\Api\RecruitmentController::class, 'destroy']);
    });

    // プロフィール関連
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::put('/', [ProfileController::class, 'update']);
    });

    // ログアウト
    Route::post('/logout', [LoginController::class, 'logout']);
});

// 存在しないルート用のハンドラー
Route::fallback(function () {
    return response()->json([
        'message' => 'Not Found',
    ], Response::HTTP_NOT_FOUND);
});
