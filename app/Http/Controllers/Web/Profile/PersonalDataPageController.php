<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web\Profile;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class PersonalDataPageController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('profile/PersonalData/PersonalDataPage');
    }
}
