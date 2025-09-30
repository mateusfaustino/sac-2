<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function client_can_authenticate_with_cnpj()
    {
        // Create a client and user with a valid CNPJ (this is a known valid CNPJ for testing)
        $client = Client::factory()->create([
            'cnpj' => '00000000000191' // Valid CNPJ for testing
        ]);
        
        $user = User::factory()->create([
            'client_id' => $client->id,
            'role' => 'client',
            'password' => bcrypt('password123')
        ]);
        
        // Attempt to login
        $response = $this->post(route('client.login'), [
            'cnpj' => '00000000000191',
            'email' => $user->email,
            'password' => 'password123'
        ]);
        
        // Should be redirected to client dashboard
        $response->assertRedirect(route('client.dashboard'));
        
        // Should be authenticated
        $this->assertAuthenticatedAs($user);
    }

    /** @test */
    public function client_cannot_authenticate_with_invalid_cnpj()
    {
        // Attempt to login with invalid CNPJ
        $response = $this->post(route('client.login'), [
            'cnpj' => 'invalid-cnpj',
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);
        
        // Should return to login page with errors
        $response->assertSessionHasErrors('cnpj');
        $this->assertGuest();
    }

    /** @test */
    public function admin_can_authenticate_with_email()
    {
        // Create an admin user
        $admin = User::factory()->create([
            'role' => 'admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password123')
        ]);
        
        // Attempt to login
        $response = $this->post(route('login'), [
            'email' => 'admin@example.com',
            'password' => 'password123'
        ]);
        
        // Should be redirected to admin dashboard
        $response->assertRedirect(route('admin.dashboard'));
        
        // Should be authenticated
        $this->assertAuthenticatedAs($admin);
    }
}