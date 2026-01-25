<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Event;

use App\Http\Controllers\Controller;
use App\Http\Resources\Event\EventResource;
use App\Models\Event;
use Illuminate\Http\Resources\Json\JsonResource;

class ShowEventController extends Controller
{
    public function __invoke(Event $event): JsonResource
    {
        return new EventResource($event);
    }
}
