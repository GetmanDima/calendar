<?php

declare(strict_types=1);

namespace App\DataTransferObjects\Event;

use App\Contracts\DataTransferObjectContract;
use Illuminate\Support\Carbon;

final readonly class FilterEventDTO implements DataTransferObjectContract
{
    public function __construct(
        public ?string $titleSubstring = null,
        public ?Carbon $startAtGreaterOrEqual = null,
        public ?Carbon $startAtLowerOrEqual = null,
        public ?Carbon $finishAtGreaterOrEqual = null,
        public ?Carbon $finishAtLowerOrEqual = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['title_substring'] ?? null,
            isset($data['start_at_greater_or_equal']) ? new Carbon($data['start_at_greater_or_equal']) : null,
            isset($data['start_at_lower_or_equal']) ? new Carbon($data['start_at_lower_or_equal']) : null,
            isset($data['finish_at_greater_or_equal']) ? new Carbon($data['finish_at_greater_or_equal']) : null,
            isset($data['finish_at_lower_or_equal']) ? new Carbon($data['finish_at_lower_or_equal']) : null,
        );
    }

    public function toArray(): array
    {
        return [
            'title_substring' => $this->titleSubstring,
            'start_at_greater_or_equal' => $this->startAtGreaterOrEqual?->toDateString(),
            'start_at_lower_or_equal' => $this->startAtLowerOrEqual?->toDateString(),
            'finish_at_greater_or_equal' => $this->finishAtGreaterOrEqual?->toDateString(),
            'finish_at_lower_or_equal' => $this->finishAtLowerOrEqual?->toDateString(),
        ];
    }
}
