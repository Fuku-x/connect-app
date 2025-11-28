<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends BaseController
{
    // 会話一覧を取得
    public function conversations()
    {
        $userId = Auth::id();

        $conversations = Conversation::where('user_one_id', $userId)
            ->orWhere('user_two_id', $userId)
            ->with(['userOne', 'userTwo', 'latestMessage.sender'])
            ->get()
            ->map(function ($conversation) use ($userId) {
                $otherUser = $conversation->user_one_id === $userId 
                    ? $conversation->userTwo 
                    : $conversation->userOne;
                
                // 未読メッセージ数をカウント
                $unreadCount = Message::where('conversation_id', $conversation->id)
                    ->where('sender_id', '!=', $userId)
                    ->whereNull('read_at')
                    ->count();

                return [
                    'id' => $conversation->id,
                    'other_user' => [
                        'id' => $otherUser->id,
                        'name' => $otherUser->name,
                    ],
                    'latest_message' => $conversation->latestMessage ? [
                        'content' => $conversation->latestMessage->content,
                        'sender_id' => $conversation->latestMessage->sender_id,
                        'created_at' => $conversation->latestMessage->created_at,
                    ] : null,
                    'unread_count' => $unreadCount,
                    'updated_at' => $conversation->updated_at,
                ];
            })
            ->sortByDesc(function ($conversation) {
                return $conversation['latest_message']['created_at'] ?? $conversation['updated_at'];
            })
            ->values();

        return $this->sendResponse($conversations, 'Conversations retrieved successfully.');
    }

    // 特定の会話のメッセージを取得
    public function messages($conversationId)
    {
        $userId = Auth::id();

        $conversation = Conversation::where('id', $conversationId)
            ->where(function ($query) use ($userId) {
                $query->where('user_one_id', $userId)
                    ->orWhere('user_two_id', $userId);
            })
            ->firstOrFail();

        // メッセージを既読にする
        Message::where('conversation_id', $conversationId)
            ->where('sender_id', '!=', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $messages = Message::where('conversation_id', $conversationId)
            ->with('sender:id,name')
            ->orderBy('created_at', 'asc')
            ->get();

        $otherUser = $conversation->user_one_id === $userId 
            ? $conversation->userTwo 
            : $conversation->userOne;

        return $this->sendResponse([
            'conversation_id' => $conversation->id,
            'other_user' => [
                'id' => $otherUser->id,
                'name' => $otherUser->name,
            ],
            'messages' => $messages,
        ], 'Messages retrieved successfully.');
    }

    // メッセージを送信
    public function send(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content' => 'required|string|max:2000',
        ]);

        $senderId = Auth::id();
        $receiverId = $request->receiver_id;

        if ($senderId === $receiverId) {
            return $this->sendError('Cannot send message to yourself.', [], 400);
        }

        // 会話を取得または作成
        $conversation = Conversation::findOrCreateBetween($senderId, $receiverId);

        // メッセージを作成
        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $senderId,
            'content' => $request->content,
        ]);

        // 会話のupdated_atを更新
        $conversation->touch();

        $message->load('sender:id,name');

        return $this->sendResponse($message, 'Message sent successfully.');
    }

    // 会話を開始（または既存の会話を取得）
    public function startConversation(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $currentUserId = Auth::id();
        $otherUserId = $request->user_id;

        if ($currentUserId === $otherUserId) {
            return $this->sendError('Cannot start conversation with yourself.', [], 400);
        }

        $conversation = Conversation::findOrCreateBetween($currentUserId, $otherUserId);
        
        $otherUser = User::find($otherUserId);

        return $this->sendResponse([
            'conversation_id' => $conversation->id,
            'other_user' => [
                'id' => $otherUser->id,
                'name' => $otherUser->name,
            ],
        ], 'Conversation started successfully.');
    }

    // 未読メッセージ数を取得
    public function unreadCount()
    {
        $userId = Auth::id();

        $count = Message::whereHas('conversation', function ($query) use ($userId) {
            $query->where('user_one_id', $userId)
                ->orWhere('user_two_id', $userId);
        })
            ->where('sender_id', '!=', $userId)
            ->whereNull('read_at')
            ->count();

        return $this->sendResponse(['count' => $count], 'Unread count retrieved successfully.');
    }
}
