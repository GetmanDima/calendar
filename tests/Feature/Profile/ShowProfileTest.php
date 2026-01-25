<?php

declare(strict_types=1);

namespace Tests\Feature\Profile;

use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

test('Unauthenticated user cannot view profile', function () {
    getJson('/api/profile')->assertStatus(401);
});

test('User can view profile', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->getJson('/api/profile')
        ->assertStatus(200)
        ->assertJson([
            'id' => $user->id,
            'email' => $user->email,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'middle_name' => $user->middle_name,
        ]);
});
