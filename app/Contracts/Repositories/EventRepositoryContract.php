<?php

declare(strict_types=1);

namespace App\Contracts\Repositories;

use App\DataTransferObjects\Event\CreateEventDTO;
use App\DataTransferObjects\Event\PaginatedEventDTO;
use App\DataTransferObjects\Event\PaginateEventsDTO;
use App\DataTransferObjects\Event\UpdateEventDTO;
use App\Filters\Event\EventFilter;
use App\Models\Event;
use Illuminate\Pagination\LengthAwarePaginator;

interface EventRepositoryContract
{
    /** @return LengthAwarePaginator<int, PaginatedEventDTO> */
    public function paginate(PaginateEventsDTO $dto, ?EventFilter $filter = null): LengthAwarePaginator;

    public function findOrFail(int $eventId): Event;

    public function create(CreateEventDTO $dto): Event;

    public function update(int $eventId, UpdateEventDTO $dto): Event;

    public function delete(int $eventId): void;
}
