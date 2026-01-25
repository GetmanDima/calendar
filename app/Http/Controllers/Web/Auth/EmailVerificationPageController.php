<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web\Auth;

use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPageController
{
    public function __invoke(): Response
    {
        return Inertia::render('auth/EmailVerification/EmailVerificationPage');
    }
}
