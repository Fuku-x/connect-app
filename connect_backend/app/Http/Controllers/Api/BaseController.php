<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    /**
     * 成功レスポンスを返す
     *
     * @param mixed $data
     * @param string $message
     * @param int $code
     * @return \Illuminate\Http\JsonResponse
     */
    protected function success($data = null, string $message = '', int $code = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ], $code);
    }

    /**
     * エラーレスポンスを返す
     *
     * @param string $message
     * @param array $errors
     * @param int $code
     * @return \Illuminate\Http\JsonResponse
     */
    protected function error(string $message, array $errors = [], int $code = 400)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors
        ], $code);
    }

    /**
     * Backwards compatible helpers (sendResponse/sendError)
     */
    protected function sendResponse($data = null, string $message = '', int $code = 200)
    {
        return $this->success($data, $message, $code);
    }

    protected function sendError(string $message, array $errors = [], int $code = 400)
    {
        return $this->error($message, $errors, $code);
    }
}
