<?php

declare(strict_types=1);

namespace App\Http\Requests\Language;

use App\Enums\Language;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ChangeLanguageRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'language' => ['required', Rule::in(Language::values())],
        ];
    }

    public function getLanguage(): Language
    {
        return Language::from($this->language);
    }
}
