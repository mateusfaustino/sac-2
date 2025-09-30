<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Client;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\CnpjValidator;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'cnpj' => 'required|string',
            'company_name' => 'required|string|max:255',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Get clean CNPJ (digits only)
        $cleanCnpj = preg_replace('/[^0-9]/', '', $request->cnpj);

        // Validate CNPJ length
        if (strlen($cleanCnpj) !== 14) {
            return redirect()->back()->withErrors(['cnpj' => 'O CNPJ deve conter exatamente 14 dígitos.']);
        }

        // Validate CNPJ format
        if (!CnpjValidator::validate($cleanCnpj)) {
            return redirect()->back()->withErrors(['cnpj' => 'O CNPJ informado é inválido.']);
        }

        // Create or get the client
        $client = Client::firstOrCreate(
            ['cnpj' => $cleanCnpj],
            [
                'razao_social' => $request->company_name,
                'email_notificacao' => $request->email,
            ]
        );

        // Create the user and associate with the client
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'client',
            'client_id' => $client->id,
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Redirect based on user role
        if ($user->role === 'admin') {
            return redirect(route('admin.dashboard', absolute: false));
        }

        return redirect(route('client.dashboard', absolute: false));
    }
}