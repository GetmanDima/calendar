<?php

declare(strict_types=1);

namespace App\DataTransferObjects\User;

use App\Contracts\DataTransferObjectContract;

final readonly class CreateUserDTO implements DataTransferObjectContract
{
    public function __construct(
        public string $email,
        public string $password,
        public string $firstName,
        public ?string $lastName,
        public ?string $middleName,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            email: $data['email'],
            password: $data['password'],
            firstName: empty($data['first_name']) ? null : $data['first_name'],
            lastName: empty($data['last_name']) ? null : $data['last_name'],
            middleName: empty($data['middle_name']) ? null : $data['middle_name'],
        );
    }

    public function toArray(): array
    {
        return [
            'email' => $this->email,
            'password' => $this->password,
            'first_name' => $this->firstName,
            'last_name' => $this->lastName,
            'middle_name' => $this->middleName,
        ];
    }
}
