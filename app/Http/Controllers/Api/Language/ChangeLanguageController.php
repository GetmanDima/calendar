<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Language;

use App\Http\Controllers\Controller;
use App\Http\Requests\Language\ChangeLanguageRequest;
use Illuminate\Http\JsonResponse;

class ChangeLanguageController extends Controller
{
    public function __invoke(ChangeLanguageRequest $request): JsonResponse
    {
        return response()
            ->json()
            ->withCookie(
                cookie()->forever(
                    'language',
                    $request->getLanguage()->value,
                    httpOnly: false,
                )
            );
    }
}
