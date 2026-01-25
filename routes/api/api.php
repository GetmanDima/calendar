<?php

declare(strict_types=1);

use App\Http\Controllers\Api\Event\DestroyEventController;
use App\Http\Controllers\Api\Event\IndexEventController;
use App\Http\Controllers\Api\Event\ShowEventController;
use App\Http\Controllers\Api\Event\StoreEventController;
use App\Http\Controllers\Api\Event\UpdateEventController;
use App\Http\Controllers\Api\Language\ChangeLanguageController;
use App\Http\Controllers\Api\Profile\ShowProfileController;
use App\Http\Controllers\Api\Profile\UpdateEmailController;
use App\Http\Controllers\Api\Profile\UpdatePersonalDataController;

Route::post('language/change', ChangeLanguageController::class)
    ->name('language.update');

Route::middleware(['auth', 'verified'])
    ->prefix('profile')
    ->name('profile.')
    ->group(function () {
        Route::get('', ShowProfileController::class)->name('show');
        Route::put('personal-data', UpdatePersonalDataController::class)->name('personal_data.update');
        Route::put('email', UpdateEmailController::class)->name('email.update');
    });

Route::middleware(['auth', 'verified'])
    ->prefix('events')
    ->name('events.')
    ->group(function () {
        Route::get('', IndexEventController::class)->name('index');
        Route::post('', StoreEventController::class)->name('store');
        Route::get('{event}', ShowEventController::class)
            ->middleware('can:view,event')
            ->name('show');
        Route::put('{event}', UpdateEventController::class)
            ->middleware('can:update,event')
            ->name('update');
        Route::delete('{event}', DestroyEventController::class)
            ->middleware('can:delete,event')
            ->name('destroy');
    });
