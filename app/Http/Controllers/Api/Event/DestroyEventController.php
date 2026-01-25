<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Event;

use App\Contracts\Repositories\EventRepositoryContract;
use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\JsonResponse;

class DestroyEventController extends Controller
{
    public function __construct(
        private readonly EventRepositoryContract $eventRepository,
    ) {}

    public function __invoke(Event $event): JsonResponse
    {
        $this->eventRepository->delete($event->id);

        return response()->json([], 204);
    }
}
