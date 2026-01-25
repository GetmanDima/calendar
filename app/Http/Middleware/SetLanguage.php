<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Enums\Language;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLanguage
{
    private const DEFAULT_LANGUAGE = Language::EN;

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        /**
         * @var string
         */
        $language = $request->cookie('language');

        if (!in_array($language, Language::values())) {
            $language = self::DEFAULT_LANGUAGE->value;
        }

        app()->setLocale($language);

        return $next($request);
    }
}
