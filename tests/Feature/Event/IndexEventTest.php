<?php

declare(strict_types=1);

namespace Tests\Feature\Event;

use App\Models\Event;
use App\Models\User;
use Illuminate\Support\Carbon;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

test('Unauthenticated user cannot view events', function () {
    getJson('/api/events')
        ->assertStatus(401);
});

test('User can view events', function () {
    $user = User::factory()->create();
    Event::factory()->count(5)->create(['user_id' => $user->id]);

    actingAs($user)
        ->getJson('/api/events?page=1&per_page=100')
        ->assertStatus(200)
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'title',
                    'limited_description',
                    'description_real_length',
                    'start_at',
                    'finish_at',
                    'remind_about_start_at',
                    'remind_about_finish_at',
                ],
            ],
            'links',
            'meta',
        ]);
});

test('User can only see their own events', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    Event::factory()->count(3)->create(['user_id' => $user->id]);
    Event::factory()->count(2)->create(['user_id' => $otherUser->id]);

    actingAs($user)
        ->getJson('/api/events?page=1&per_page=10')
        ->assertStatus(200)
        ->assertJsonCount(3, 'data');
});

test('Events are paginated', function () {
    $user = User::factory()->create();
    Event::factory()->count(20)->create(['user_id' => $user->id]);

    actingAs($user)
        ->getJson('/api/events?page=2&per_page=15')
        ->assertStatus(200)
        ->assertJsonCount(5, 'data')
        ->assertJsonPath('meta.current_page', 2);
});

test('Filter by title works', function () {
    $user = User::factory()->create();
    Event::factory()->create(['user_id' => $user->id, 'title' => 'My special event']);
    Event::factory()->create(['user_id' => $user->id, 'title' => 'Another event']);

    actingAs($user)
        ->getJson('/api/events?page=1&per_page=10&title=special')
        ->assertStatus(200)
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.title', 'My special event');
});

test('Filter by start_at_from works', function () {
    $user = User::factory()->create();
    $eventInFuture = Event::factory()->create(['user_id' => $user->id, 'start_at' => Carbon::now()->addDays(2)]);
    Event::factory()->create(['user_id' => $user->id, 'start_at' => Carbon::now()->subDays(2)]);

    $filterDate = Carbon::now()->toDateTimeString();
    actingAs($user)
        ->getJson('/api/events?page=1&per_page=10&start_at_from='.urlencode($filterDate))
        ->assertStatus(200)
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $eventInFuture->id);
});

test('Filter by start_at_to works', function () {
    $user = User::factory()->create();
    Event::factory()->create(['user_id' => $user->id, 'start_at' => Carbon::now()->addDays(2)]);
    $eventInPast = Event::factory()->create(['user_id' => $user->id, 'start_at' => Carbon::now()->subDays(2)]);

    $filterDate = Carbon::now()->toDateTimeString();
    actingAs($user)
        ->getJson('/api/events?page=1&per_page=10&start_at_to='.urlencode($filterDate))
        ->assertStatus(200)
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $eventInPast->id);
});

test('Filter by finish_at_from works', function () {
    $user = User::factory()->create();
    $eventInFuture = Event::factory()->create(['user_id' => $user->id, 'finish_at' => Carbon::now()->addDays(5)]);
    Event::factory()->create(['user_id' => $user->id, 'finish_at' => Carbon::now()->addDays(1)]);

    $filterDate = Carbon::now()->addDays(3)->toDateTimeString();
    actingAs($user)
        ->getJson('/api/events?page=1&per_page=10&finish_at_from='.urlencode($filterDate))
        ->assertStatus(200)
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $eventInFuture->id);
});

test('Filter by finish_at_to works', function () {
    $user = User::factory()->create();
    Event::factory()->create(['user_id' => $user->id, 'finish_at' => Carbon::now()->addDays(5)]);
    $eventInPast = Event::factory()->create(['user_id' => $user->id, 'finish_at' => Carbon::now()->addDays(1)]);

    $filterDate = Carbon::now()->addDays(3)->toDateTimeString();
    actingAs($user)
        ->getJson('/api/events?page=1&per_page=10&finish_at_to='.urlencode($filterDate))
        ->assertStatus(200)
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.id', $eventInPast->id);
});

test('Index event validation', function (string $query, array|string $errors) {
    $user = User::factory()->create();

    actingAs($user)
        ->getJson("/api/events?{$query}")
        ->assertStatus(422)
        ->assertJsonValidationErrors($errors);
})->with([
    'required fields' => [
        'query' => '',
        'errors' => ['page', 'per_page'],
    ],
    'page is not an integer' => [
        'query' => 'page=abc&per_page=10',
        'errors' => 'page',
    ],
    'page is less than 1' => [
        'query' => 'page=0&per_page=10',
        'errors' => 'page',
    ],
    'per_page is not an integer' => [
        'query' => 'page=1&per_page=abc',
        'errors' => 'per_page',
    ],
    'per_page is less than 1' => [
        'query' => 'page=1&per_page=0',
        'errors' => 'per_page',
    ],
    'per_page is greater than 100' => [
        'query' => 'page=1&per_page=101',
        'errors' => 'per_page',
    ],
    'title is not a string' => [
        'query' => 'page=1&per_page=10&title[]=',
        'errors' => 'title',
    ],
    'title is too long' => [
        'query' => 'page=1&per_page=10&title='.str_repeat('a', 256),
        'errors' => 'title',
    ],
    'start_at_from is not a date' => [
        'query' => 'page=1&per_page=10&start_at_from=not-a-date',
        'errors' => 'start_at_from',
    ],
    'start_at_to is not a date' => [
        'query' => 'page=1&per_page=10&start_at_to=not-a-date',
        'errors' => 'start_at_to',
    ],
    'start_at_to is before start_at_from' => [
        'query' => 'page=1&per_page=10&start_at_from='.urlencode(Carbon::now()->toDateTimeString()).'&start_at_to='.urlencode(Carbon::now()->subDay()->toDateTimeString()),
        'errors' => 'start_at_to',
    ],
    'finish_at_from is not a date' => [
        'query' => 'page=1&per_page=10&finish_at_from=not-a-date',
        'errors' => 'finish_at_from',
    ],
    'finish_at_to is not a date' => [
        'query' => 'page=1&per_page=10&finish_at_to=not-a-date',
        'errors' => 'finish_at_to',
    ],
    'finish_at_to is before finish_at_from' => [
        'query' => 'page=1&per_page=10&finish_at_from='.urlencode(Carbon::now()->toDateTimeString()).'&finish_at_to='.urlencode(Carbon::now()->subDay()->toDateTimeString()),
        'errors' => 'finish_at_to',
    ],
]);
