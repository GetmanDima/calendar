<?php

declare(strict_types=1);

namespace Tests\Feature\Event;

use App\Models\Event;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

test('Unauthenticated user cannot view event', function () {
    $event = Event::factory()->create();

    getJson('/api/events/'.$event->id)
        ->assertStatus(401);
});

test('User can view event', function () {
    $user = User::factory()->create();
    $event = Event::factory()->create(['user_id' => $user->id]);

    actingAs($user)
        ->getJson('/api/events/'.$event->id)
        ->assertStatus(200)
        ->assertJson([
            'id' => $event->id,
            'title' => $event->title,
            'description' => $event->description,
            'start_at' => $event->start_at,
            'finish_at' => $event->finish_at,
            'remind_about_start_at' => $event->remind_about_start_at,
            'remind_about_finish_at' => $event->remind_about_finish_at,
        ]);
});

test('User cannot view another user event', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $event = Event::factory()->create(['user_id' => $user2->id]);

    actingAs($user1)
        ->getJson('/api/events/'.$event->id)
        ->assertStatus(403);
});

test('Returns 404 if event not found', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->getJson('/api/events/9999')
        ->assertStatus(404);
});
