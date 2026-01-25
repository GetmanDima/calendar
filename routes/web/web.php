<?php

declare(strict_types=1);

use App\Http\Controllers\Web\Event\IndexEventPageController;
use App\Http\Controllers\Web\Profile\EmailPageController;
use App\Http\Controllers\Web\Profile\PersonalDataPageController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->to('/events');
})->middleware(['auth', 'verified'])->name('home');

Route::middleware(['auth', 'verified'])
    ->prefix('profile')
    ->name('profile.')
    ->group(function () {
        Route::get('personal-data', PersonalDataPageController::class)->name('personal_data.page');
        Route::get('email', EmailPageController::class)->name('email.page');
    });

Route::get('/events', IndexEventPageController::class)
    ->middleware(['auth', 'verified'])
    ->name('events.page');

require base_path('routes/web/auth.php');
