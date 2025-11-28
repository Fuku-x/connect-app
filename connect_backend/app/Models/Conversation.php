<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_one_id',
        'user_two_id',
    ];

    public function userOne()
    {
        return $this->belongsTo(User::class, 'user_one_id');
    }

    public function userTwo()
    {
        return $this->belongsTo(User::class, 'user_two_id');
    }

    public function messages()
    {
        return $this->hasMany(Message::class)->orderBy('created_at', 'asc');
    }

    public function latestMessage()
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }

    // 相手ユーザーを取得
    public function getOtherUser($userId)
    {
        return $this->user_one_id === $userId ? $this->userTwo : $this->userOne;
    }

    // 2人のユーザー間の会話を取得または作成
    public static function findOrCreateBetween($userOneId, $userTwoId)
    {
        // IDの小さい方をuser_one_idにして重複を防ぐ
        $ids = [$userOneId, $userTwoId];
        sort($ids);

        return self::firstOrCreate([
            'user_one_id' => $ids[0],
            'user_two_id' => $ids[1],
        ]);
    }
}
