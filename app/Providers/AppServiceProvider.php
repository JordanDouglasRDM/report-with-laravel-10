<?php

namespace App\Providers;

use App\Rules\UniqueForUserRule;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;
use Monolog\Handler\IFTTTHandler;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Paginator::useBootstrapFive();


        Validator::extend('unique_for_user', function ($attribute, $value, $parameters) {
            $table = $parameters[0];
            $column = $parameters[1];

            $rule = new UniqueForUserRule($table, $column);
            return $rule->passes($attribute, $value);

        }, 'O campo :attribute já existe.');
    }
}
