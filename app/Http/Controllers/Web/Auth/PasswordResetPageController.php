<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web\Auth;

use Inertia\Inertia;
use Inertia\Response;

class PasswordResetPageController
{
    public function __invoke(): Response
    {
        return Inertia::render('auth/PasswordReset/PasswordResetPage');
    }
}
