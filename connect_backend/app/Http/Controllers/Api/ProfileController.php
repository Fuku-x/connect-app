<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class ProfileController extends Controller
{
    /**
     * Get the authenticated user's profile.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function show()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'message' => 'Unauthenticated.'
                ], 401);
            }

            return response()->json([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'student_id' => $user->student_id,
                'department' => $user->department,
                'grade' => $user->grade,
                'bio' => $user->bio,
                'profile_image' => $user->profile_image,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch profile.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the authenticated user's profile.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'message' => 'Unauthenticated.'
                ], 401);
            }

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'student_id' => 'nullable|string|max:50',
                'department' => 'nullable|string|max:255',
                'grade' => 'nullable|integer|min:1|max:6',
                'bio' => 'nullable|string|max:1000',
                // プロフィール画像のバリデーションは後で追加
            ]);

            $user->update($validated);

            return response()->json([
                'message' => 'Profile updated successfully.',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'student_id' => $user->student_id,
                    'department' => $user->department,
                    'grade' => $user->grade,
                    'bio' => $user->bio,
                    'profile_image' => $user->profile_image,
                ]
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update profile.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
