<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class ProtectedApiTest extends TestCase
{
    use RefreshDatabase;

    private $user;
    private $token;

    protected function setUp(): void
    {
        parent::setUp();

        // テスト用ユーザーを作成
        $this->user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        // トークンを生成
        $this->token = JWTAuth::fromUser($this->user);
        
        // JWT認証を有効化
        $this->withHeader('Accept', 'application/json');
    }

    /** @test */
    public function it_returns_authenticated_user_info_with_valid_token()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->get('/api/user');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'name',
                'email',
                'email_verified_at',
                'created_at',
                'updated_at',
            ]);
    }

    /** @test */
    public function it_returns_unauthorized_without_token()
    {
        $response = $this->get('/api/user');

        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.'
            ]);
    }

    /** @test */
    public function it_returns_unauthorized_with_invalid_token()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer invalid.token.here',
        ])->get('/api/user');

        $response->assertStatus(401);
    }

    /** @test */
    public function it_returns_unauthorized_after_logout()
    {
        // ログアウト
        $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->post('/api/logout');

        // ログアウト後はアクセス不可
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $this->token,
        ])->get('/api/user');

        $response->assertStatus(401);
    }
}
