<?php

declare(strict_types=1);

namespace App\Contracts\Repositories;

use App\Contracts\DataTransferObjects\UpdateUserDTOContract;
use App\DataTransferObjects\User\CreateUserDTO;
use App\Models\User;

interface UserRepositoryContract
{
    public function findOrFail(int $userId): User;

    public function create(CreateUserDTO $dto): User;

    public function update(int $userId, UpdateUserDTOContract $dto): User;
}
