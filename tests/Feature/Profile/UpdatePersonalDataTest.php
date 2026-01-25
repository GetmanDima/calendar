<?php

declare(strict_types=1);

namespace Tests\Feature\Profile;

use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\putJson;

test('Unauthenticated user cannot update personal data', function () {
    putJson('/api/profile/personal-data')->assertStatus(401);
});

test('User can update personal data', function () {
    $user = User::factory()->create();
    $newFirstName = 'New First Name';
    $newLastName = 'New Last Name';
    $newMiddleName = 'New Middle Name';

    actingAs($user)->putJson('/api/profile/personal-data', [
        'first_name' => $newFirstName,
        'last_name' => $newLastName,
        'middle_name' => $newMiddleName,
    ])
        ->assertStatus(200)
        ->assertJsonFragment([
            'id' => $user->id,
            'first_name' => $newFirstName,
            'last_name' => $newLastName,
            'middle_name' => $newMiddleName,
        ]);

    assertDatabaseHas('users', [
        'id' => $user->id,
        'first_name' => $newFirstName,
        'last_name' => $newLastName,
        'middle_name' => $newMiddleName,
    ]);
});

test('Update personal data validation with invalid data', function (array $values, string $field) {
    $user = User::factory()->create();
    actingAs($user);

    foreach ($values as $value) {
        putJson('api/profile/personal-data', [$field => $value])
            ->assertStatus(422)
            ->assertJsonValidationErrors($field);
    }
})->with([
    'first_name' => [
        ['123', 'Ivan123', '!', ' ', str_repeat('a', 256), '', null],
        'first_name',
    ],
    'last_name' => [
        ['123', 'Ivanov123', '!', str_repeat('a', 256)],
        'last_name',
    ],
    'middle_name' => [
        ['123', 'Ivanovich123', '!', str_repeat('a', 256)],
        'middle_name',
    ],
]);

test('Update personal data validation with valid data', function (array $values, string $field) {
    $user = User::factory()->create();
    actingAs($user);

    foreach ($values as $value) {
        putJson('api/profile/personal-data', [$field => $value])
            ->assertStatus($field === 'first_name' ? 200 : 422)
            ->assertValid($field);
    }
})->with([
    'first_name' => [
        ['Ivan', 'Иван', 'I', 'Anna Maria'],
        'first_name',
    ],
    'last_name' => [
        ['Ivanov', 'Иванов', 'I', 'Anna Maria', '', null],
        'last_name',
    ],
    'middle_name' => [
        ['Ivanovich', 'Иванович', 'I', 'Anna Maria', '', null],
        'middle_name',
    ],
]);
