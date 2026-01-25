<?php

declare(strict_types=1);

namespace Tests\Feature\Language;

use App\Enums\Language;

use function Pest\Laravel\postJson;

test('Successful change language', function () {
    foreach (Language::cases() as $language) {
        postJson('/api/language/change', ['language' => $language->value])
            ->assertStatus(200)
            ->assertCookie('language', $language->value, false);
    }
});

test('Language Validation', function () {
    $invalidData = [null, '', 'de'];

    foreach ($invalidData as $value) {
        postJson('/api/language/change', ['language' => $value])
            ->assertStatus(422)
            ->assertJsonValidationErrors('language');
    }
});
