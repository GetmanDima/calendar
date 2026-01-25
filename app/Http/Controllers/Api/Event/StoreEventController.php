<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Event;

use App\Contracts\Repositories\EventRepositoryContract;
use App\DataTransferObjects\Event\CreateEventDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Event\StoreEventRequest;
use App\Http\Resources\Event\EventResource;
use Illuminate\Http\Resources\Json\JsonResource;

class StoreEventController extends Controller
{
    public function __construct(
        private readonly EventRepositoryContract $eventRepository,
    ) {}

    public function __invoke(StoreEventRequest $request): JsonResource
    {
        /**
         * @var int
         */
        $userId = auth()->user()?->id;

        $validated = $request->validated();
        $validated['user_id'] = $userId;

        $event = $this->eventRepository->create(
            CreateEventDTO::fromArray($validated)
        );

        return new EventResource($event);
    }
}
