<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Api\Controller as BaseController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Lang;
use Illuminate\Validation\ValidationException;

class ForgotPasswordController extends BaseController
{
    /**
     * パスワードリセット用のリンクを送信
     *
     * @param Request $request
     * @return JsonResponse
     * @throws ValidationException
     */
    public function sendResetLinkEmail(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return $this->success(
                null,
                Lang::get('passwords.sent'),
                200
            );
        }

        return $this->error(
            Lang::get('passwords.user'),
            ['email' => [Lang::get('passwords.user')]],
            422
        );
    }
}
