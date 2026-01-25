<?php

declare(strict_types=1);

namespace App\Rules\Auth;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class NameRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!$value || !is_string($value)) {
            return;
        }

        if (!preg_match("/^[A-Za-zА-Яа-яЁё\s'-]+$/u", $value)) {
            $fail('The :attribute must contain only alphabetic characters', null);
        }
    }
}
