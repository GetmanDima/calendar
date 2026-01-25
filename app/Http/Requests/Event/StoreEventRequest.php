<?php

declare(strict_types=1);

namespace App\Http\Requests\Event;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => [
                'required',
                'string',
                'max:255',
            ],
            'description' => [
                'nullable',
                'string',
                'max:1000',
            ],
            'start_at' => [
                'required',
                'date_format:Y-m-d H:i:s',
            ],
            'finish_at' => [
                'required',
                'date_format:Y-m-d H:i:s',
                'after_or_equal:start_at',
            ],
            'remind_about_start_at' => [
                'nullable',
                'date_format:Y-m-d H:i:s',
                'before_or_equal:start_at',
                'after_or_equal:now',
            ],
            'remind_about_finish_at' => [
                'nullable',
                'date_format:Y-m-d H:i:s',
                'before_or_equal:finish_at',
                'after_or_equal:now',
            ],
        ];
    }
}
