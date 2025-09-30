<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminLayoutTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that admin users can access the admin dashboard with the new layout.
     *
     * @return void
     */
    public function test_admin_can_access_dashboard_with_sidebar_layout(): void
    {
        $user = User::factory()->create([
            'role' => 'admin'
        ]);

        $response = $this->actingAs($user)->get(route('admin.dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Dashboard')
        );
    }

    /**
     * Test that admin users can access the tickets index page.
     *
     * @return void
     */
    public function test_admin_can_access_tickets_index_page(): void
    {
        $user = User::factory()->create([
            'role' => 'admin'
        ]);

        $response = $this->actingAs($user)->get(route('admin.tickets.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Tickets/Index')
        );
    }

    /**
     * Test that non-admin users cannot access admin routes.
     *
     * @return void
     */
    public function test_non_admin_cannot_access_admin_routes(): void
    {
        $user = User::factory()->create([
            'role' => 'client'
        ]);

        $response = $this->actingAs($user)->get(route('admin.dashboard'));

        $response->assertStatus(302); // Redirected due to middleware
    }
}