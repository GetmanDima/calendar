<?php

declare(strict_types=1);

namespace Tests\Feature\Event;

use App\Models\Event;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\deleteJson;

test('Unauthenticated user cannot delete event', function () {
    $event = Event::factory()->create();

    deleteJson('/api/events/'.$event->id)
        ->assertStatus(401);
});

test('User can delete event', function () {
    $user = User::factory()->create();
    $event = Event::factory()->create(['user_id' => $user->id]);

    actingAs($user)
        ->deleteJson('/api/events/'.$event->id)
        ->assertStatus(204);

    assertDatabaseMissing('events', ['id' => $event->id]);
});

test('User cannot delete another user event', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $event = Event::factory()->create(['user_id' => $user2->id]);

    actingAs($user1)
        ->deleteJson('/api/events/'.$event->id)
        ->assertStatus(403);
});

test('Returns 404 if event not found', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->deleteJson('/api/events/9999')
        ->assertStatus(404);
});
