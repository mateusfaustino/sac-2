<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class CnpjLoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'cnpj' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        // Clean CNPJ by removing non-digit characters
        $this->merge([
            'cnpj' => preg_replace('/\D/', '', $this->cnpj),
        ]);
    }

    /**
     * Get the needed authorization credentials from the request.
     *
     * @return array<string, string>
     */
    public function credentials(): array
    {
        return [
            'cnpj' => $this->get('cnpj'),
            'password' => $this->get('password'),
        ];
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        //event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw \Illuminate\Validation\ValidationException::withMessages([
            'cnpj' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     *
     * @return string
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->input('cnpj')).'|'.$this->ip());
    }
}