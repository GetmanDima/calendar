<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Contracts\DataTransferObjects\UpdateUserDTOContract;
use App\Contracts\Repositories\UserRepositoryContract;
use App\DataTransferObjects\User\CreateUserDTO;
use App\Models\User;

class UserRepository implements UserRepositoryContract
{
    public function __construct(
        private readonly User $user,
    ) {}

    public function findOrFail(int $userId): User
    {
        return $this->user::findOrFail($userId);
    }

    public function create(CreateUserDTO $dto): User
    {
        return $this->user::create($dto->toArray());
    }

    public function update(int $userId, UpdateUserDTOContract $dto): User
    {
        $user = $this->findOrFail($userId);
        $user->update($dto->toArray());

        return $user;
    }
}
