<?php

declare(strict_types=1);

use App\Http\Controllers\Web\Auth\EmailVerificationPageController;
use App\Http\Controllers\Web\Auth\LoginPageController;
use App\Http\Controllers\Web\Auth\PasswordForgotPageController;
use App\Http\Controllers\Web\Auth\PasswordResetPageController;
use App\Http\Controllers\Web\Auth\RegisterPageController;
use App\Http\Middleware\RedirectIfEmailVerified;
use Illuminate\Support\Facades\Route;

Route::middleware(['guest'])
    ->group(function () {
        Route::get('register', RegisterPageController::class)->name('register.page');
        Route::get('login', LoginPageController::class)->name('login.page');
        Route::get('forgot-password', PasswordForgotPageController::class)->name('password.request');
        Route::get('reset-password/{token}', PasswordResetPageController::class)->name('password.reset');
    });

Route::get('email/verify/{userId?}/{hash?}', EmailVerificationPageController::class)
    ->middleware(['auth', RedirectIfEmailVerified::class])
    ->name('verification.notice');
