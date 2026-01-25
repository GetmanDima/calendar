<?php

declare(strict_types=1);

namespace App\Actions\Fortify;

use App\Contracts\Repositories\UserRepositoryContract;
use App\DataTransferObjects\User\CreateUserDTO;
use App\Models\User;
use App\Rules\Auth\NameRule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    public function __construct(
        private readonly UserRepositoryContract $userRepository,
    ) {}

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make(
            $input,
            $this->getValidationRules(),
            $this->getValidationMessages(),
        )->validate();

        $input['password'] = Hash::make($input['password']);

        return $this->userRepository->create(
            CreateUserDTO::fromArray($input)
        );
    }

    /**
     * @return array<string, array<mixed>>
     */
    private function getValidationRules(): array
    {
        return [
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'first_name' => ['required', 'string', 'max:255', new NameRule],
            'last_name' => ['nullable', 'string', 'max:255', new NameRule],
            'middle_name' => ['nullable', 'string', 'max:255', new NameRule],
            'password' => $this->passwordRules(),
        ];
    }

    /**
     * @return array<string, string>
     */
    private function getValidationMessages(): array
    {
        return [
            'email.unique' => __('auth.validation.unique_email'),
        ];
    }
}
