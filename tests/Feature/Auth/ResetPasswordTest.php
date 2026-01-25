<?php

declare(strict_types=1);

namespace tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\Password;

use function Pest\Laravel\postJson;

test('Cannot reset password with invalid token', function () {
    $user = User::factory()->create();

    $response = postJson('/api/reset-password', [
        'token' => 'invalid-token',
        'email' => $user->email,
        'password' => 'new-password-123',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email' => 'This password reset token is invalid.']);
});

test('User can reset password with valid token', function () {
    $user = User::factory()->create();
    $token = Password::broker()->createToken($user);

    $response = postJson('/api/reset-password', [
        'token' => $token,
        'email' => $user->email,
        'password' => 'new-password-123',
    ]);

    $response->assertStatus(200)
        ->assertJson(['message' => 'Your password has been reset.']);

    $response = postJson('/api/login', [
        'email' => $user->email,
        'password' => 'new-password-123',
    ]);

    $response->assertStatus(200);
});

test('Password validation with invalid data', function () {
    $user = User::factory()->create();
    $values = ['short', '1234567', 'test123', str_repeat('a', 256), '', null];

    foreach ($values as $value) {
        postJson('api/register', [
            'token' => Password::broker()->createToken($user),
            'email' => $user->email,
            'password' => $value,
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('password');
    }
});

test('Password validation with valid data', function () {
    $user = User::factory()->create();
    $values = ['12345678', 'a 1 б 2 c 3 d 5', ';@#*^!a1', '    5678'];

    foreach ($values as $value) {
        postJson('api/reset-password', [
            'token' => Password::broker()->createToken($user),
            'email' => $user->email,
            'password' => $value,
        ])
            ->assertStatus(200)
            ->assertValid('password');
    }
});

test('Email and password are required for password reset', function () {
    $user = User::factory()->create();
    $token = Password::broker()->createToken($user);

    postJson('/api/reset-password', [
        'token' => $token,
        'email' => '',
        'password' => '',
    ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['email', 'password']);
});
