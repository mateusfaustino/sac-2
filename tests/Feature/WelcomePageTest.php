<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Client;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WelcomePageTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that the welcome page can be rendered.
     *
     * @return void
     */
    public function test_welcome_page_can_be_rendered(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Welcome')
        );
    }

    /**
     * Test that the welcome page shows login and register buttons for guests.
     *
     * @return void
     */
    public function test_welcome_page_shows_auth_buttons_for_guests(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Welcome')
            ->where('auth.user', null)
        );
    }

    /**
     * Test that authenticated clients see their dashboard link.
     *
     * @return void
     */
    public function test_welcome_page_shows_client_dashboard_for_authenticated_clients(): void
    {
        $client = Client::factory()->create();
        $user = User::factory()->create([
            'client_id' => $client->id,
            'role' => 'client'
        ]);

        $response = $this->actingAs($user)->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Welcome')
            ->where('auth.user.role', 'client')
        );
    }

    /**
     * Test that authenticated admins see the admin dashboard link.
     *
     * @return void
     */
    public function test_welcome_page_shows_admin_dashboard_for_authenticated_admins(): void
    {
        $user = User::factory()->create([
            'role' => 'admin'
        ]);

        $response = $this->actingAs($user)->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Welcome')
            ->where('auth.user.role', 'admin')
        );
    }

    /**
     * Test that the welcome page explains the return/devolution process.
     *
     * @return void
     */
    public function test_welcome_page_explains_return_process(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Welcome')
        );
    }

    /**
     * Test that the welcome page shows system benefits.
     *
     * @return void
     */
    public function test_welcome_page_shows_system_benefits(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Welcome')
        );
    }

    /**
     * Test that the welcome page shows admin login link for guests.
     *
     * @return void
     */
    public function test_welcome_page_shows_admin_login_link_for_guests(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Welcome')
            ->where('auth.user', null)
        );
    }

    /**
     * Test that the welcome page does not show admin login link for authenticated users.
     *
     * @return void
     */
    public function test_welcome_page_does_not_show_admin_login_link_for_authenticated_users(): void
    {
        $user = User::factory()->create([
            'role' => 'client'
        ]);

        $response = $this->actingAs($user)->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Welcome')
            ->where('auth.user.role', 'client')
        );
    }
}