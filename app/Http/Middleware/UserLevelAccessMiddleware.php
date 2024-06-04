<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserLevelAccessMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     */
    public function handle(Request $request, Closure $next, string $level, string $secondMiddleware = ''): Response
    {

        $userAuth = auth()->guard()->user()->level ?? null;

        if (!auth()->check() || $userAuth !== $level) {

            if ($secondMiddleware !== $userAuth) {
                if (auth()->check()) {
                    return redirect()->route('report.index');
                } else {
                    return redirect()->route('login');
                }
            }

        }
        return $next($request);
    }
}
