<?php

declare(strict_types=1);

namespace App\DataTransferObjects\Event;

use App\Contracts\DataTransferObjectContract;
use App\Contracts\Repositories\UserRepositoryContract;
use App\Models\User;

final readonly class PaginateEventsDTO implements DataTransferObjectContract
{
    public function __construct(
        public int $perPage,
        public int $page,
        public int $descriptionLimit,
        public User $user,
    ) {}

    public static function fromArray(array $data): self
    {
        $user = app(UserRepositoryContract::class)->findOrFail($data['user_id']);

        return new self(
            $data['per_page'] ?? 15,
            $data['page'] ?? 1,
            $data['description_limit'] ?? 100,
            $user,
        );
    }

    public function toArray(): array
    {
        return [
            'per_page' => $this->perPage,
            'page' => $this->page,
            'description_limit' => $this->descriptionLimit,
            'user_id' => $this->user->id,
        ];
    }
}
