<?php

namespace Tests\Feature\Auth;

use App\Models\Client;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientLoginTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that the client login screen can be rendered.
     *
     * @return void
     */
    public function test_client_login_screen_can_be_rendered(): void
    {
        $response = $this->get(route('client.login.form'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Auth/ClientLogin')
        );
    }

    /**
     * Test that clients can authenticate using the client login screen with CNPJ and password only.
     *
     * @return void
     */
    public function test_clients_can_authenticate_using_the_client_login_screen(): void
    {
        $client = Client::factory()->create([
            'cnpj' => '10832014000125',
        ]);
        
        $user = User::factory()->create([
            'client_id' => $client->id,
            'email' => 'client@example.com',
            'password' => bcrypt('password'),
            'role' => 'client',
        ]);

        $response = $this->post(route('client.login'), [
            'cnpj' => '10.832.014/0001-25',
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('client.dashboard', absolute: false));
    }

    /**
     * Test that clients cannot authenticate with invalid password.
     *
     * @return void
     */
    public function test_clients_cannot_authenticate_with_invalid_password(): void
    {
        $client = Client::factory()->create([
            'cnpj' => '10832014000125',
        ]);
        
        $user = User::factory()->create([
            'client_id' => $client->id,
            'email' => 'client@example.com',
            'password' => bcrypt('password'),
            'role' => 'client',
        ]);

        $response = $this->post(route('client.login'), [
            'cnpj' => '10.832.014/0001-25',
            'password' => 'wrong-password',
        ]);

        $response->assertSessionHasErrors('cnpj');
        $this->assertGuest();
    }

    /**
     * Test that clients cannot authenticate with invalid CNPJ.
     *
     * @return void
     */
    public function test_clients_cannot_authenticate_with_invalid_cnpj(): void
    {
        $client = Client::factory()->create([
            'cnpj' => '10832014000125',
        ]);
        
        $user = User::factory()->create([
            'client_id' => $client->id,
            'email' => 'client@example.com',
            'password' => bcrypt('password'),
            'role' => 'client',
        ]);

        $response = $this->post(route('client.login'), [
            'cnpj' => '00.000.000/0000-00',
            'password' => 'password',
        ]);

        $response->assertSessionHasErrors('cnpj');
        $this->assertGuest();
    }

    /**
     * Test that client login form does not require email field.
     *
     * @return void
     */
    public function test_client_login_does_not_require_email(): void
    {
        $client = Client::factory()->create([
            'cnpj' => '10832014000125',
        ]);
        
        $user = User::factory()->create([
            'client_id' => $client->id,
            'email' => 'client@example.com',
            'password' => bcrypt('password'),
            'role' => 'client',
        ]);

        // Test that login works without email field
        $response = $this->post(route('client.login'), [
            'cnpj' => '10.832.014/0001-25',
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('client.dashboard', absolute: false));
    }
}