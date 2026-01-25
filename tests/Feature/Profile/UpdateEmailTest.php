<?php

declare(strict_types=1);

namespace Tests\Feature\Profile;

use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\putJson;

test('Unauthenticated user cannot update email', function () {
    putJson('/api/profile/email')->assertStatus(401);
});

test('User can update email', function () {
    $user = User::factory()->create();
    $newEmail = 'newemail@example.com';

    actingAs($user)->putJson('/api/profile/email', [
        'email' => $newEmail,
    ])
        ->assertStatus(200)
        ->assertJsonFragment([
            'id' => $user->id,
            'email' => $newEmail,
        ]);

    assertDatabaseHas('users', [
        'id' => $user->id,
        'email' => $newEmail,
    ]);
});

test('Cannot update email with an existing one', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    actingAs($user1)->putJson('/api/profile/email', [
        'email' => $user2->email,
    ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('Email validation with invalid data', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
    ]);
    actingAs($user);

    $values = ['short', '1234567', 'test123', str_repeat('a', 256), '', null];

    foreach ($values as $value) {
        putJson('api/profile/email', ['email' => $value])
            ->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }
});

test('Email validation with valid data', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
    ]);
    actingAs($user);

    $values = ['valid@example.com', 'TEST@EXAMPLE.COM', 'test.examp_le@example.com', 'тест@пример.рф'];

    foreach ($values as $value) {
        putJson('api/profile/email', ['email' => $value])
            ->assertStatus(200)
            ->assertValid('email');
    }
});
