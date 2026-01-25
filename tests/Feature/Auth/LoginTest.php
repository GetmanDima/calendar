<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Support\Facades\Hash;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertAuthenticatedAs;
use function Pest\Laravel\assertGuest;
use function Pest\Laravel\postJson;

test('Authenciated user cannot access to login', function () {
    $user = User::factory()->create();

    $response = actingAs($user)->get('/login');

    $response->assertRedirect('/');
});

test('Allows valid user to log in', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password'),
    ]);

    $response = postJson('/api/login', [
        'email' => 'test@example.com',
        'password' => 'password',
    ]);

    $response->assertStatus(200);
    assertAuthenticatedAs($user);
});

test('Does not allow invalid credentials', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password'),
    ]);

    $response = postJson('/api/login', [
        'email' => 'test@example.com',
        'password' => 'wrong-password',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['email']);
    assertGuest();
});

test('Requires email for login', function () {
    $response = postJson('/api/login', [
        'password' => 'password',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['email']);
});

test('Requires password for login', function () {
    $response = postJson('/api/login', [
        'email' => 'test@example.com',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['password']);
});

test('Does not allow login with non-existent email', function () {
    $response = postJson('/api/login', [
        'email' => 'nonexistent@example.com',
        'password' => 'password',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['email']);
    assertGuest();
});
