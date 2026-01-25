<?php

declare(strict_types=1);

namespace Tests\Feature\Event;

use App\Models\User;
use Carbon\Carbon;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\postJson;

test('Unauthenticated user cannot create an event', function () {
    postJson('/api/events', [])
        ->assertStatus(401);
});

test('User can create an event', function () {
    $user = User::factory()->create();
    $startAt = Carbon::now()->addDays(3);
    $finishAt = Carbon::now()->addDays(4)->addHour();
    $remindAboutStartAt = Carbon::now()->addDays(1);
    $remindAboutFinishAt = Carbon::now()->addDays(2)->addHour();

    $eventData = [
        'title' => 'My New Event',
        'description' => 'This is a description for my new event.',
        'start_at' => $startAt->format('Y-m-d H:i:s'),
        'finish_at' => $finishAt->format('Y-m-d H:i:s'),
        'remind_about_start_at' => $remindAboutStartAt->format('Y-m-d H:i:s'),
        'remind_about_finish_at' => $remindAboutFinishAt->format('Y-m-d H:i:s'),
    ];

    actingAs($user)
        ->postJson('/api/events', $eventData)
        ->assertStatus(201);

    assertDatabaseHas('events', [
        'user_id' => $user->id,
        ...$eventData,
    ]);
});

test('Store event validation with invalid data', function (array $data, array|string $errors) {
    $user = User::factory()->create();

    actingAs($user)
        ->postJson('/api/events', $data)
        ->assertStatus(422)
        ->assertJsonValidationErrors($errors);
})->with([
    'required fields' => [
        ['title' => '', 'start_at' => '', 'finish_at' => ''],
        ['title', 'start_at', 'finish_at'],
    ],
    'title not a string' => [
        ['title' => 123],
        'title',
    ],
    'description not a string' => [
        ['description' => 123],
        'description',
    ],
    'start_at not a date' => [
        ['start_at' => 'not-a-date'],
        'start_at',
    ],
    'finish_at not a date' => [
        ['finish_at' => 'not-a-date'],
        'finish_at',
    ],
    'finish_at before start_at' => [
        [
            'start_at' => Carbon::now()->toDateTimeString(),
            'finish_at' => Carbon::now()->subDay()->toDateTimeString(),
        ],
        'finish_at',
    ],
    'start_at before remind_about_start_at' => [
        [
            'start_at' => Carbon::now()->addDays(1)->toDateTimeString(),
            'remind_about_start_at' => Carbon::now()->addDays(2)->toDateTimeString(),
        ],
        'remind_about_start_at',
    ],
    'finish_at before remind_about_finish_at' => [
        [
            'finish_at' => Carbon::now()->addDays(1)->toDateTimeString(),
            'remind_about_finish_at' => Carbon::now()->addDays(2)->toDateTimeString(),
        ],
        'remind_about_finish_at',
    ],
    'remind_about_start_at before now' => [
        [
            'remind_about_start_at' => Carbon::now()->subDay()->toDateTimeString(),
        ],
        'remind_about_start_at',
    ],
    'remind_about_finish_at before now' => [
        [
            'remind_about_finish_at' => Carbon::now()->subDay()->toDateTimeString(),
        ],
        'remind_about_finish_at',
    ],
]);

test('Store event validation with valid data', function (array $values, string $field, array $context = []) {
    $user = User::factory()->create();

    foreach ($values as $value) {
        $data = array_merge($context, [$field => $value]);

        actingAs($user)
            ->postJson('/api/events', $data)
            ->assertStatus(422)
            ->assertValid($field);
    }
})->with([
    'title' => [
        ['Valid Title', str_repeat('a', 255)],
        'title',
    ],
    'description' => [
        ['Valid Description', null, '', str_repeat('a', 1000)],
        'description',
    ],
    'start_at' => [
        [Carbon::now()->addDay()->format('Y-m-d H:i:s')],
        'start_at',
    ],
    'finish_at' => [
        [
            Carbon::now()->addDay()->startOfDay()->format('Y-m-d H:i:s'),
            Carbon::now()->addDay()->endOfDay()->format('Y-m-d H:i:s'),
        ],
        'finish_at',
        ['start_at' => Carbon::now()->addDay()->startOfDay()->format('Y-m-d H:i:s')],
    ],
    'remind_about_start_at' => [
        [
            null,
            Carbon::now()->addHour()->format('Y-m-d H:i:s'),
            Carbon::now()->addDays(2)->startOfDay()->format('Y-m-d H:i:s'),
        ],
        'remind_about_start_at',
        ['start_at' => Carbon::now()->addDays(2)->startOfDay()->format('Y-m-d H:i:s')],
    ],
    'remind_about_finish_at' => [
        [
            null,
            Carbon::now()->addHour()->format('Y-m-d H:i:s'),
            Carbon::now()->addDays(3)->startOfDay()->format('Y-m-d H:i:s'),
        ],
        'remind_about_finish_at',
        [
            'start_at' => Carbon::now()->addDays(2)->startOfDay()->format('Y-m-d H:i:s'),
            'finish_at' => Carbon::now()->addDays(3)->startOfDay()->format('Y-m-d H:i:s'),
        ],
    ],
]);
