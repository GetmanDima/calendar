<?php

declare(strict_types=1);

namespace App\Http\Requests\Event;

use App\DataTransferObjects\Event\FilterEventDTO;
use App\Filters\Event\EventFilter;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;

class IndexEventRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'page' => [
                'required',
                'integer',
                'min:1',
            ],
            'per_page' => [
                'required',
                'integer',
                'min:1',
                'max:100',
            ],
            'title' => [
                'nullable',
                'string',
                'max:255',
            ],
            'start_at_from' => [
                'nullable',
                'date_format:Y-m-d H:i:s',
            ],
            'start_at_to' => [
                'nullable',
                'date_format:Y-m-d H:i:s',
                'after_or_equal:start_at_from',
            ],
            'finish_at_from' => [
                'nullable',
                'date_format:Y-m-d H:i:s',
                'after_or_equal:start_at_from',
            ],
            'finish_at_to' => [
                'nullable',
                'date_format:Y-m-d H:i:s',
                'after_or_equal:finish_at_from',
            ],
        ];
    }

    public function getFilter(): EventFilter
    {
        $validated = $this->validated();

        return new EventFilter(
            new FilterEventDTO(
                $validated['title'] ?? null,
                isset($validated['start_at_from']) ?
                    (new Carbon($validated['start_at_from'])) : null,
                isset($validated['start_at_to']) ?
                    (new Carbon($validated['start_at_to'])) : null,
                isset($validated['finish_at_from']) ?
                    (new Carbon($validated['finish_at_from'])) : null,
                isset($validated['finish_at_to']) ?
                    (new Carbon($validated['finish_at_to'])) : null,
            )
        );
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('per_page')) {
            $this->merge([
                'per_page' => (int) $this->per_page,
            ]);
        }

        if ($this->has(key: 'page')) {
            $this->merge([
                'page' => (int) $this->page,
            ]);
        }
    }
}
