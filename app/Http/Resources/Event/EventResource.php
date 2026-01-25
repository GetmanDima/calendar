<?php

declare(strict_types=1);

namespace App\Http\Resources\Event;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Event */
class EventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'start_at' => $this->start_at->toDatetimeString(),
            'finish_at' => $this->finish_at->toDatetimeString(),
            'remind_about_start_at' => $this->remind_about_start_at?->toDatetimeString(),
            'remind_about_finish_at' => $this->remind_about_finish_at?->toDatetimeString(),
        ];
    }
}
