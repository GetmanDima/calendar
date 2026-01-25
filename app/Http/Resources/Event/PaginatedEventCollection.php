<?php

declare(strict_types=1);

namespace App\Http\Resources\Event;

use Illuminate\Http\Resources\Json\ResourceCollection;

class PaginatedEventCollection extends ResourceCollection
{
    protected function collects()
    {
        return PaginatedEventResource::class;
    }
}
