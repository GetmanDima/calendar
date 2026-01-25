<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\postJson;

test('Authenciated user cannot access to register', function () {
    $user = User::factory()->create();

    $response = actingAs($user)->get('/register');

    $response->assertRedirect('/');
});

test('Successful register', function () {
    Notification::fake();

    $data = [
        'first_name' => 'Ivan',
        'last_name' => 'Ivanov',
        'middle_name' => 'Ivanovich',
        'password' => '12345678',
    ];

    $dataOptions = [
        'first_name' => ['Ivan'],
        'last_name' => ['Ivanov', ' ', '', null],
        'middle_name' => ['Ivanovich', ' ', '', null],
        'password' => ['test1234'],
    ];

    $i = 0;

    foreach ($dataOptions as $validKey => $options) {
        foreach ($options as $option) {
            $email = 'test.success'.$i.'@example.com';

            $userData = array_merge(
                $data,
                [
                    'email' => $email,
                    $validKey => $option,
                ]
            );

            $response = postJson('api/register', $userData);

            $response->assertStatus(201);

            unset($userData['password']);

            if (empty(trim($userData['middle_name'] ?? ''))) {
                $userData['middle_name'] = null;
            }

            if (empty(trim($userData['last_name'] ?? ''))) {
                $userData['last_name'] = null;
            }

            assertDatabaseHas('users', $userData);
            expect(auth()->user()->email)->toBe($email);

            Notification::assertSentTo(auth()->user(), VerifyEmail::class);

            auth()->logout();
            $i++;
        }
    }
});

test('Error when same email register', function () {
    $data = [
        'email' => 'test.repeat@example.com',
        'first_name' => 'Ivan',
        'last_name' => 'Ivanov',
        'middle_name' => 'Ivanovich',
        'password' => '12345678',
    ];

    $response = postJson('api/register', $data);
    $response->assertStatus(201);
    auth()->logout();

    $response = postJson('api/register', $data);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['email']);
});

test('Register validation with invalid data', function (array $values, string $field) {
    foreach ($values as $value) {
        postJson('api/register', [$field => $value])
            ->assertStatus(422)
            ->assertJsonValidationErrors($field);
    }
})->with([
    'email' => [
        ['email', '123', '123@', '@ya.ru', '.@ya.ru', str_repeat('a', 255).'@example.com', '', null],
        'email',
    ],
    'first_name' => [
        ['123', 'Ivan123', '!', ' ', str_repeat('a', 256), '', null],
        'first_name',
    ],
    'last_name' => [
        ['123', 'Ivanov123', '!', str_repeat('a', 256)],
        'last_name',
    ],
    'middle_name' => [
        ['123', 'Ivanovich123', '!', str_repeat('a', 256)],
        'middle_name',
    ],
    'password' => [
        ['short', '1234567', 'test123', str_repeat('a', 256), '', null],
        'password',
    ],
]);

test('Register validation with valid data', function (array $values, string $field) {
    foreach ($values as $value) {
        postJson('api/register', [$field => $value])
            ->assertStatus(422)
            ->assertValid($field);
    }
})->with([
    'email' => [
        ['test@example.com', 'TEST@EXAMPLE.COM', 'test.examp_le@example.com', 'тест@пример.рф'],
        'email',
    ],
    'first_name' => [
        ['Ivan', 'Иван', 'I', 'Anna Maria'],
        'first_name',
    ],
    'last_name' => [
        ['Ivanov', 'Иванов', 'I', 'Anna Maria', '', null],
        'last_name',
    ],
    'middle_name' => [
        ['Ivanovich', 'Иванович', 'I', 'Anna Maria', '', null],
        'middle_name',
    ],
    'password' => [
        ['12345678', 'a 1 б 2 c 3 d 5', ';@#*^!a1', '    5678'],
        'password',
    ],
]);
