<?php

declare(strict_types=1);

namespace App\Providers;

use App\Contracts\Repositories\EventRepositoryContract;
use App\Contracts\Repositories\UserRepositoryContract;
use App\Repositories\EventRepository;
use App\Repositories\UserRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(UserRepositoryContract::class, UserRepository::class);
        $this->app->bind(EventRepositoryContract::class, EventRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
