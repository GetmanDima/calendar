<?php

declare(strict_types=1);

namespace App\DataTransferObjects\Event;

use App\Contracts\DataTransferObjectContract;
use Illuminate\Support\Carbon;

final readonly class PaginatedEventDTO implements DataTransferObjectContract
{
    public function __construct(
        public int $id,
        public string $title,
        public ?string $limitedDescription,
        public int $descriptionRealLength,
        public Carbon $startAt,
        public Carbon $finishAt,
        public ?Carbon $remindAboutStartAt,
        public ?Carbon $remindAboutFinishAt,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['id'],
            $data['title'],
            $data['limited_description'],
            $data['description_real_length'],
            new Carbon($data['start_at']),
            new Carbon($data['finish_at']),
            isset($data['remind_about_start_at']) ? new Carbon($data['remind_about_start_at']) : null,
            isset($data['remind_about_finish_at']) ? new Carbon($data['remind_about_finish_at']) : null,
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'limited_description' => $this->limitedDescription,
            'description_real_length' => $this->descriptionRealLength,
            'start_at' => $this->startAt->toDateTimeString(),
            'finish_at' => $this->finishAt->toDateTimeString(),
            'remind_about_start_at' => $this->remindAboutStartAt?->toDateTimeString(),
            'remind_about_finish_at' => $this->remindAboutFinishAt?->toDateTimeString(),
        ];
    }
}
