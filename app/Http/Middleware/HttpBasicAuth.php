<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class HttpBasicAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = config('auth.http_basic.user');
        $password = config('auth.http_basic.password');

        if (
            $request->getUser() !== $user ||
            $request->getPassword() !== $password
        ) {
            return response('Unauthorized', 401, [
                'WWW-Authenticate' => 'Basic realm="Restricted Area"',
            ]);
        }

        return $next($request);
    }
}
