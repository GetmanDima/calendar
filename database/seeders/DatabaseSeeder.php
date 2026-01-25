<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'first_name' => 'Ivan',
            'last_name' => 'Ivanov',
            'middle_name' => 'Ivanovich',
        ]);

        Event::factory(count: 1000)->for($user)->create();
    }
}
