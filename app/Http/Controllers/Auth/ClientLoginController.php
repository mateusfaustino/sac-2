<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\CnpjLoginRequest;
use App\Models\Client;
use App\Models\User;
use App\Services\CnpjValidator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ClientLoginController extends Controller
{
    /**
     * Display the login view.
     *
     * @return \Inertia\Response
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ClientLogin', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     *
     * @param  \App\Http\Requests\Auth\CnpjLoginRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(CnpjLoginRequest $request)
    {
        $request->ensureIsNotRateLimited();

        // Validate CNPJ format
        if (!CnpjValidator::validate($request->cnpj)) {
            throw ValidationException::withMessages([
                'cnpj' => __('The CNPJ is invalid.'),
            ]);
        }

        // Find client by CNPJ
        $client = Client::where('cnpj', $request->cnpj)->first();

        if (!$client) {
            throw ValidationException::withMessages([
                'cnpj' => __('The selected CNPJ is invalid.'),
            ]);
        }

        // Find user associated with the client
        // For client login, we'll authenticate any user associated with the client
        $user = User::where('client_id', $client->id)
                    ->first();

        // If no user found for this client, we can't authenticate
        if (!$user) {
            RateLimiter::hit($this->throttleKey($request));

            throw ValidationException::withMessages([
                'cnpj' => trans('auth.failed'),
            ]);
        }

        // Attempt to authenticate the user with the provided password
        if (!Auth::attempt(['email' => $user->email, 'password' => $request->password])) {
            RateLimiter::hit($this->throttleKey($request));

            throw ValidationException::withMessages([
                'cnpj' => trans('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey($request));

        Auth::login($user, $request->boolean('remember'));

        // Redirect based on user role
        if ($user->isAdmin()) {
            return redirect()->intended(route('admin.dashboard', absolute: false));
        }

        return redirect()->intended(route('client.dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }

    /**
     * Get the rate limiting throttle key for the request.
     *
     * @param  \App\Http\Requests\Auth\CnpjLoginRequest  $request
     * @return string
     */
    protected function throttleKey(CnpjLoginRequest $request): string
    {
        return Str::transliterate(Str::lower($request->input('cnpj')).'|'.$request->ip());
    }
}