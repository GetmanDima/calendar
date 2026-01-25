<?php

declare(strict_types=1);

namespace tests\Feature;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\postJson;
use function PHPUnit\Framework\assertEquals;

test('Authenciated user cannot access to forgot password', function () {
    $user = User::factory()->create();

    $response = actingAs($user)->get('/forgot-password');

    $response->assertRedirect('/');
});

test('User can request password reset link', function () {
    Notification::fake();

    $user = User::factory()->create();

    postJson('/api/forgot-password', ['email' => $user->email])
        ->assertStatus(200)
        ->assertJson(['message' => 'We have emailed your password reset link.']);

    Notification::assertSentTo($user, ResetPassword::class, function (ResetPassword $notification, $channels) use ($user) {
        $mailMessage = $notification->toMail($user);
        $actionUrl = $mailMessage->actionUrl;

        $expectedUrl = url(route('password.reset', [
            'token' => $notification->token,
            'email' => $user->email,
        ]));

        assertEquals($expectedUrl, $actionUrl);

        return true;
    });
});

test('Email is required for password reset link', function () {
    postJson('/api/forgot-password', ['email' => ''])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('Non-existent email cannot get a password reset link', function () {
    postJson('/api/forgot-password', ['email' => 'nonexistent@example.com'])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});
