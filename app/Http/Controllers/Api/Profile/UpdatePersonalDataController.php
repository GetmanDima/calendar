<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Profile;

use App\Contracts\Repositories\UserRepositoryContract;
use App\DataTransferObjects\User\UpdatePersonalDataDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdatePersonalDataRequest;
use App\Http\Resources\Profile\ProfileResource;
use Illuminate\Http\Resources\Json\JsonResource;

class UpdatePersonalDataController extends Controller
{
    public function __construct(
        private readonly UserRepositoryContract $userRepository,
    ) {}

    public function __invoke(UpdatePersonalDataRequest $request): JsonResource
    {
        /**
         * @var int
         */
        $userId = auth()->user()?->id;

        $user = $this->userRepository->update(
            $userId,
            UpdatePersonalDataDTO::fromArray($request->validated())
        );

        return new ProfileResource($user);
    }
}
