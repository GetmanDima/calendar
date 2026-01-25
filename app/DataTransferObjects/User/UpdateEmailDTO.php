<?php

declare(strict_types=1);

namespace App\DataTransferObjects\User;

use App\Contracts\DataTransferObjects\UpdateUserDTOContract;

final readonly class UpdateEmailDTO implements UpdateUserDTOContract
{
    public function __construct(
        public string $email,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            email: $data['email'],
        );
    }

    public function toArray(): array
    {
        return [
            'email' => $this->email,
        ];
    }
}
