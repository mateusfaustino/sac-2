<?php

namespace App\Providers;

use App\Services\TicketService;
use Illuminate\Support\ServiceProvider;

class TicketServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(TicketService::class, function ($app) {
            return new TicketService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}