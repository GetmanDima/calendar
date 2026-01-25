<?php

declare(strict_types=1);

namespace App\DataTransferObjects\Event;

use App\Contracts\DataTransferObjectContract;
use App\Contracts\Repositories\UserRepositoryContract;
use App\Models\User;
use Illuminate\Support\Carbon;

final readonly class CreateEventDTO implements DataTransferObjectContract
{
    public function __construct(
        public User $user,
        public string $title,
        public ?string $description,
        public Carbon $startAt,
        public Carbon $finishAt,
        public ?Carbon $remindAboutStartAt,
        public ?Carbon $remindAboutFinishAt,
    ) {}

    public static function fromArray(array $data): self
    {
        $user = app(UserRepositoryContract::class)->findOrFail($data['user_id']);

        return new self(
            $user,
            $data['title'],
            $data['description'] ?? null,
            new Carbon($data['start_at']),
            new Carbon($data['finish_at']),
            isset($data['remind_about_start_at']) ? new Carbon($data['remind_about_start_at']) : null,
            isset($data['remind_about_finish_at']) ? new Carbon($data['remind_about_finish_at']) : null,
        );
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->user->id,
            'title' => $this->title,
            'description' => $this->description,
            'start_at' => $this->startAt->toDateTimeString(),
            'finish_at' => $this->finishAt->toDateTimeString(),
            'remind_about_start_at' => $this->remindAboutStartAt?->toDateTimeString(),
            'remind_about_finish_at' => $this->remindAboutFinishAt?->toDateTimeString(),
        ];
    }
}
