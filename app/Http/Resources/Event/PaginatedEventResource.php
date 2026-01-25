<?php

declare(strict_types=1);

namespace App\Http\Resources\Event;

use App\DataTransferObjects\Event\PaginatedEventDTO;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @property PaginatedEventDTO $resource */
class PaginatedEventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return $this->resource->toArray();
    }
}
