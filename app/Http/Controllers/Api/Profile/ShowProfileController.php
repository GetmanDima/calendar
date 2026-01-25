<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Profile;

use App\Http\Controllers\Controller;
use App\Http\Resources\Profile\ProfileResource;
use Illuminate\Http\Resources\Json\JsonResource;

class ShowProfileController extends Controller
{
    public function __invoke(): JsonResource
    {
        return new ProfileResource(auth()->user());
    }
}
