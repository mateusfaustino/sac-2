<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreTicketRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only clients can create tickets
        return Auth::check() && Auth::user()->role === 'client';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'product_id' => 'required|exists:products,id',
            'quantidade' => 'required|integer|min:1',
            'numero_contrato' => 'required|string|max:255',
            'numero_nf' => 'required|string|max:255',
            'numero_serie' => 'nullable|string|max:255',
            'descricao' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'product_id.required' => 'Please select a product',
            'product_id.exists' => 'The selected product is invalid',
            'quantidade.required' => 'Please enter the quantity',
            'quantidade.integer' => 'Quantity must be a number',
            'quantidade.min' => 'Quantity must be at least 1',
            'numero_contrato.required' => 'Please enter the contract number',
            'numero_nf.required' => 'Please enter the invoice number',
        ];
    }
}