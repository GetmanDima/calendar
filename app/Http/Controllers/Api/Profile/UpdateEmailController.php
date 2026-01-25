<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Profile;

use App\Contracts\Repositories\UserRepositoryContract;
use App\DataTransferObjects\User\UpdateEmailDTO;
use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdateEmailRequest;
use App\Http\Resources\Profile\ProfileResource;
use Illuminate\Http\Resources\Json\JsonResource;

class UpdateEmailController extends Controller
{
    public function __construct(
        private readonly UserRepositoryContract $userRepository,
    ) {}

    public function __invoke(UpdateEmailRequest $request): JsonResource
    {
        /**
         * @var int
         */
        $userId = auth()->user()?->id;

        $user = $this->userRepository->update(
            $userId,
            UpdateEmailDTO::fromArray($request->validated())
        );

        return new ProfileResource($user);
    }
}
