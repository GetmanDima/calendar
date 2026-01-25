<?php

declare(strict_types=1);

namespace App\DataTransferObjects\User;

use App\Contracts\DataTransferObjects\UpdateUserDTOContract;

final readonly class UpdatePasswordDTO implements UpdateUserDTOContract
{
    public function __construct(
        public string $password,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            password: $data['password'],
        );
    }

    public function toArray(): array
    {
        return [
            'password' => $this->password,
        ];
    }
}
