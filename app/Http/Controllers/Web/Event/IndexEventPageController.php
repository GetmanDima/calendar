<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web\Event;

use Inertia\Inertia;
use Inertia\Response;

class IndexEventPageController
{
    public function __invoke(): Response
    {
        return Inertia::render('event/Index/IndexEventPage');
    }
}
