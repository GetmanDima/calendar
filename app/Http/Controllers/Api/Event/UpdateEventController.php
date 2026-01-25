<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Event;

use App\Contracts\Repositories\EventRepositoryContract;
use App\DataTransferObjects\Event\UpdateEventDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Event\UpdateEventRequest;
use App\Http\Resources\Event\EventResource;
use App\Models\Event;
use Illuminate\Http\Resources\Json\JsonResource;

class UpdateEventController extends Controller
{
    public function __construct(
        private readonly EventRepositoryContract $eventRepository,
    ) {}

    public function __invoke(Event $event, UpdateEventRequest $request): JsonResource
    {
        $validated = $request->validated();

        $event = $this->eventRepository->update(
            $event->id,
            UpdateEventDTO::fromArray($validated)
        );

        return new EventResource($event);
    }
}
