<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Event;

use App\Contracts\Repositories\EventRepositoryContract;
use App\DataTransferObjects\Event\PaginateEventsDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Event\IndexEventRequest;
use App\Http\Resources\Event\PaginatedEventCollection;
use Illuminate\Http\Resources\Json\JsonResource;

class IndexEventController extends Controller
{
    public function __construct(
        private readonly EventRepositoryContract $eventRepository,
    ) {}

    public function __invoke(IndexEventRequest $request): JsonResource
    {
        /**
         * @var int
         */
        $userId = auth()->user()?->id;

        $validated = $request->validated();
        $validated['user_id'] = $userId;

        $paginatedEvents = $this->eventRepository->paginate(
            PaginateEventsDTO::fromArray($validated),
            $request->getFilter(),
        );

        return new PaginatedEventCollection($paginatedEvents);
    }
}
