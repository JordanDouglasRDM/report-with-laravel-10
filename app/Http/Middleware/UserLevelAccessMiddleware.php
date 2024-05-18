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
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $level): Response
    {
        if (!auth()->check() || auth()->guard()->user()->level !== $level) {
//            abort(403, 'Acesso não autorizado.');
            if (auth()->check()) {
                return redirect()->route('dashboard');
            } else {
                return redirect()->route('login');
            }
        }
        return $next($request);
    }
}
