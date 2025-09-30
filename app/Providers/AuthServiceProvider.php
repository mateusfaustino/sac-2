<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Auth;
use App\Models\Client;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Custom CNPJ authentication guard
        Auth::provider('cnpj', function ($app, array $config) {
            return new class implements \Illuminate\Contracts\Auth\UserProvider {
                public function retrieveById($identifier) {
                    return \App\Models\User::find($identifier);
                }

                public function retrieveByToken($identifier, $token) {
                    return \App\Models\User::where('id', $identifier)
                        ->where('remember_token', $token)
                        ->first();
                }

                public function updateRememberToken(\Illuminate\Contracts\Auth\Authenticatable $user, $token) {
                    $user->setRememberToken($token);
                    $user->save();
                }

                public function retrieveByCredentials(array $credentials) {
                    // Find client by CNPJ
                    $client = Client::where('cnpj', $credentials['cnpj'])->first();
                    
                    if (!$client) {
                        return null;
                    }
                    
                    // Find user associated with the client
                    return \App\Models\User::where('client_id', $client->id)
                        ->where('email', $credentials['email'] ?? null)
                        ->first();
                }

                public function validateCredentials(\Illuminate\Contracts\Auth\Authenticatable $user, array $credentials) {
                    return \Illuminate\Support\Facades\Hash::check($credentials['password'], $user->getAuthPassword());
                }
            };
        });
    }
}