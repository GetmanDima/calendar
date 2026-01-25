<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Contracts\Repositories\EventRepositoryContract;
use App\DataTransferObjects\Event\CreateEventDTO;
use App\DataTransferObjects\Event\PaginatedEventDTO;
use App\DataTransferObjects\Event\PaginateEventsDTO;
use App\DataTransferObjects\Event\UpdateEventDTO;
use App\Filters\Event\EventFilter;
use App\Models\Event;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class EventRepository implements EventRepositoryContract
{
    private const array PAGINATION_SELECTED_COLUMNS = [
        'id',
        'title',
        'start_at',
        'finish_at',
        'remind_about_start_at',
        'remind_about_finish_at',
    ];

    public function __construct(
        private readonly Event $event,
    ) {}

    public function paginate(PaginateEventsDTO $dto, ?EventFilter $filter = null): LengthAwarePaginator
    {
        $query = DB::table($this->event->getTable())
            ->select(self::PAGINATION_SELECTED_COLUMNS)
            ->addSelect([
                DB::raw("LEFT(description, {$dto->descriptionLimit}) as limited_description"),
                DB::raw('CHAR_LENGTH(description) as description_real_length'),
            ])
            ->where('user_id', '=', $dto->user->id)
            ->when($filter, function ($query) use ($filter) {
                /**
                 * @var EventFilter $filter
                 */
                $query->pipe($filter);
            })
            ->orderByDesc('start_at');

        /**
         * @var LengthAwarePaginator<int, PaginatedEventDTO>
         */
        $paginator = $query
            ->paginate(
                perPage: $dto->perPage,
                columns: self::PAGINATION_SELECTED_COLUMNS,
                page: $dto->page,
            );

        $paginator->getCollection()->transform(function ($item): PaginatedEventDTO {
            return PaginatedEventDTO::fromArray((array) $item);
        });

        return $paginator;
    }

    public function findOrFail(int $eventId): Event
    {
        return $this->event::findOrFail($eventId);
    }

    public function create(CreateEventDTO $dto): Event
    {
        return $this->event::create($dto->toArray());
    }

    public function update(int $eventId, UpdateEventDTO $dto): Event
    {
        $event = $this->findOrFail($eventId);
        $event->update($dto->toArray());

        return $event;
    }

    public function delete(int $eventId): void
    {
        $this->findOrFail($eventId)->delete();
    }
}
