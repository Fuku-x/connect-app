<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $allowedOrigins = ['http://localhost:3000'];
        $origin = $request->header('Origin');
        
        // For development, you might want to allow all origins
        if (in_array($origin, $allowedOrigins) || config('app.env') === 'local') {
            $headers = [
                'Access-Control-Allow-Origin'      => $origin ?: '*',
                'Access-Control-Allow-Methods'     => 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
                'Access-Control-Allow-Credentials' => 'true',
                'Access-Control-Max-Age'           => '86400',
                'Access-Control-Allow-Headers'     => 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN, X-XSRF-TOKEN, X-Socket-Id, Accept, X-Auth-Token, X-API-Key'
            ];

            // Handle preflight OPTIONS request
            if ($request->isMethod('OPTIONS')) {
                return response()->json([], 200, $headers);
            }

            // Handle the actual request
            $response = $next($request);
            
            // Add CORS headers to the response
            foreach($headers as $key => $value) {
                $response->headers->set($key, $value);
            }

            return $response;
        }

        return $next($request);
    }
}
