<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\Notification;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;
use function PHPUnit\Framework\assertNotNull;

test('Unauthenciated user cannot verify email', function () {
    $response = get('/email/verify/1/hash');

    $response->assertRedirect('/login');
});

test('Redirects already verified user to home', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $response = $this
        ->actingAs($user)
        ->get('/email/verify/1/hash');

    $response->assertRedirect('/');
});

test('Can resend verification email', function () {
    Notification::fake();

    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);

    $response = actingAs($user)
        ->postJson('/api/email/verification-notification');

    $response->assertStatus(202); // Accepted status for sending notification
    Notification::assertSentTo($user, VerifyEmail::class);
});

test('Can verify email', function () {
    Notification::fake();

    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);

    actingAs($user)
        ->postJson('/api/email/verification-notification');

    Notification::assertSentTo($user, VerifyEmail::class, function ($notification) use ($user) {
        $mailData = $notification->toMail($user);
        $verificationUrl = str_replace('email/verify', 'api/email/verify', $mailData->actionUrl ?? $mailData->action);

        $response = get($verificationUrl);

        $response->assertRedirect(route('home', ['verified' => 1]));
        assertNotNull($user->fresh()->email_verified_at);

        return true;
    });
});
