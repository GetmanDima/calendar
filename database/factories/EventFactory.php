<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startAt = fake()->dateTimeBetween('now', '+1 month');
        $finishAt = fake()->dateTimeBetween($startAt, '+2 months');

        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(3),
            'start_at' => $startAt,
            'finish_at' => $finishAt,
            'remind_about_start_at' => Carbon::instance($startAt)->subMinutes(5),
            'remind_about_finish_at' => Carbon::instance($finishAt)->subMinutes(5),
        ];
    }
}
