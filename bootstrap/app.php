<?php

declare(strict_types=1);

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SetLanguage;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web/web.php',
        api: __DIR__.'/../routes/api/api.php',
        commands: __DIR__.'/../routes/console/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            SetLanguage::class,
        ]);

        $middleware->api([
            'web',
            'throttle:api',
            SetLanguage::class,
        ]);

        $middleware->encryptCookies(except: [
            'language',
        ]);

        $middleware->redirectGuestsTo(
            fn () => route('login.page')
        );
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
