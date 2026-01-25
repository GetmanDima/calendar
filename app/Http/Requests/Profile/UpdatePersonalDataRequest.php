<?php

declare(strict_types=1);

namespace App\Http\Requests\Profile;

use App\Rules\Auth\NameRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePersonalDataRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255', new NameRule],
            'last_name' => ['nullable', 'string', 'max:255', new NameRule],
            'middle_name' => ['nullable', 'string', 'max:255', new NameRule],
        ];
    }
}
