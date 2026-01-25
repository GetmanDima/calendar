<?php

declare(strict_types=1);

namespace App\Filters\Event;

use App\DataTransferObjects\Event\FilterEventDTO;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Carbon;

class EventFilter
{
    public function __construct(
        private readonly FilterEventDTO $dto,
    ) {}

    public function __invoke(Builder $query): Builder
    {
        return $query
            ->when($this->dto->titleSubstring, function (Builder $query) {
                $query->where('title', 'LIKE', "%{$this->dto->titleSubstring}%");
            })
            ->when($this->dto->startAtGreaterOrEqual, function (Builder $query, Carbon $startAtGreaterOrEqual) {
                $query->where('start_at', '>=', $startAtGreaterOrEqual->toDateTimeString());
            })
            ->when($this->dto->startAtLowerOrEqual, function (Builder $query, Carbon $startAtLowerOrEqual) {
                $query->where('start_at', '<=', $startAtLowerOrEqual->toDateTimeString());
            })
            ->when($this->dto->finishAtGreaterOrEqual, function (Builder $query, Carbon $finishAtGreaterOrEqual) {
                $query->where('finish_at', '>=', $finishAtGreaterOrEqual->toDateTimeString());
            })
            ->when($this->dto->finishAtLowerOrEqual, function (Builder $query, Carbon $finishAtLowerOrEqual) {
                $query->where('finish_at', '<=', $finishAtLowerOrEqual->toDateTimeString());
            });
    }
}
