<?php

declare(strict_types=1);

namespace App\DataTransferObjects\User;

use App\Contracts\DataTransferObjects\UpdateUserDTOContract;

final readonly class UpdatePersonalDataDTO implements UpdateUserDTOContract
{
    public function __construct(
        public string $firstName,
        public ?string $lastName,
        public ?string $middleName,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            firstName: $data['first_name'],
            lastName: empty($data['last_name']) ? null : $data['last_name'],
            middleName: empty($data['middle_name']) ? null : $data['middle_name'],
        );
    }

    public function toArray(): array
    {
        return [
            'first_name' => $this->firstName,
            'last_name' => $this->lastName,
            'middle_name' => $this->middleName,
        ];
    }
}
